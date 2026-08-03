import { createClient } from '@supabase/supabase-js'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export type CreditAccount = {
  id: string
  email: string
  credits_remaining: number
  subscription_status: string | null
  subscription_current_period_end: string | null
}

export async function getOrCreateAccount(email: string): Promise<CreditAccount> {
  const supabase = db()
  const normalized = email.trim().toLowerCase()

  const { data: existing } = await supabase
    .from('credit_accounts')
    .select('id, email, credits_remaining, subscription_status, subscription_current_period_end')
    .eq('email', normalized)
    .maybeSingle()

  if (existing) return existing as CreditAccount

  const { data: created, error } = await supabase
    .from('credit_accounts')
    .insert({ email: normalized, credits_remaining: 3 })
    .select('id, email, credits_remaining, subscription_status, subscription_current_period_end')
    .single()

  if (error) throw error

  await supabase.from('credit_transactions').insert({
    account_id: created.id,
    delta: 3,
    reason: 'free_grant',
  })

  return created as CreditAccount
}

export function hasUnlimitedAccess(account: CreditAccount): boolean {
  if (account.subscription_status !== 'active') return false
  if (!account.subscription_current_period_end) return false
  return new Date(account.subscription_current_period_end).getTime() > Date.now()
}

/** Atomically consumes one credit. Returns false if the account has none left and no active subscription. */
export async function consumeScanCredit(email: string): Promise<{ ok: boolean; account: CreditAccount }> {
  const supabase = db()
  const account = await getOrCreateAccount(email)

  if (hasUnlimitedAccess(account)) {
    await supabase.from('credit_transactions').insert({ account_id: account.id, delta: 0, reason: 'scan' })
    return { ok: true, account }
  }

  if (account.credits_remaining <= 0) return { ok: false, account }

  const { data: updated, error } = await supabase
    .from('credit_accounts')
    .update({ credits_remaining: account.credits_remaining - 1, updated_at: new Date().toISOString() })
    .eq('id', account.id)
    .eq('credits_remaining', account.credits_remaining) // optimistic lock, avoids double-spend on concurrent requests
    .select('id, email, credits_remaining, subscription_status, subscription_current_period_end')
    .single()

  if (error || !updated) return { ok: false, account }

  await supabase.from('credit_transactions').insert({ account_id: account.id, delta: -1, reason: 'scan' })
  return { ok: true, account: updated as CreditAccount }
}

export async function grantCredits(stripeCustomerId: string, email: string, delta: number, reason: string, stripeEventId: string) {
  const supabase = db()
  const account = await getOrCreateAccount(email)

  // Idempotency: if this Stripe event was already applied, skip (webhook retries are expected)
  const { data: existingEvent } = await supabase
    .from('credit_transactions')
    .select('id')
    .eq('stripe_event_id', stripeEventId)
    .maybeSingle()
  if (existingEvent) return

  await supabase
    .from('credit_accounts')
    .update({
      credits_remaining: account.credits_remaining + delta,
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', account.id)

  await supabase.from('credit_transactions').insert({
    account_id: account.id,
    delta,
    reason,
    stripe_event_id: stripeEventId,
  })
}

export async function setSubscriptionStatus(
  stripeCustomerId: string,
  email: string,
  status: string,
  currentPeriodEnd: string | null,
  stripeEventId: string,
) {
  const supabase = db()
  const account = await getOrCreateAccount(email)

  const { data: existingEvent } = await supabase
    .from('credit_transactions')
    .select('id')
    .eq('stripe_event_id', stripeEventId)
    .maybeSingle()
  if (existingEvent) return

  await supabase
    .from('credit_accounts')
    .update({
      subscription_status: status,
      subscription_current_period_end: currentPeriodEnd,
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', account.id)

  await supabase.from('credit_transactions').insert({
    account_id: account.id,
    delta: 0,
    reason: 'subscription_unlimited',
    stripe_event_id: stripeEventId,
  })
}
