import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { grantCredits, setSubscriptionStatus } from '@/lib/credits'

export const dynamic = 'force-dynamic'

const CREDIT_GRANTS: Record<string, number> = {
  credits_20: 20,
  credits_100: 100,
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const signature = request.headers.get('stripe-signature')
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email || session.metadata?.email
    const plan = session.metadata?.plan
    const customerId = String(session.customer || '')

    if (email && plan && CREDIT_GRANTS[plan]) {
      await grantCredits(customerId, email, CREDIT_GRANTS[plan], `purchase_${plan.replace('credits_', '')}`, event.id)
    }
    if (email && plan === 'subscription_unlimited' && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(String(session.subscription))
      const periodEnd = new Date(sub.current_period_end * 1000).toISOString()
      await setSubscriptionStatus(customerId, email, sub.status, periodEnd, event.id)
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const customer = await stripe.customers.retrieve(String(sub.customer))
    const email = 'email' in customer ? customer.email : null
    const periodEnd = new Date(sub.current_period_end * 1000).toISOString()
    if (email) {
      await setSubscriptionStatus(String(sub.customer), email, sub.status, periodEnd, event.id)
    }
  }

  return NextResponse.json({ received: true })
}
