import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const PLANS = {
  credits_20: { price: process.env.STRIPE_PRICE_CREDITS_20, mode: 'payment' as const },
  credits_100: { price: process.env.STRIPE_PRICE_CREDITS_100, mode: 'payment' as const },
  subscription_unlimited: { price: process.env.STRIPE_PRICE_SUB_UNLIMITED, mode: 'subscription' as const },
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const plan = String(body.plan || '') as keyof typeof PLANS

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }
  const selected = PLANS[plan]
  if (!selected || !selected.price) {
    return NextResponse.json({ error: 'Unknown or unconfigured plan.' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const origin = request.headers.get('origin') || new URL(request.url).origin

  const session = await stripe.checkout.sessions.create({
    mode: selected.mode,
    customer_email: email,
    line_items: [{ price: selected.price, quantity: 1 }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
    metadata: { plan, email },
  })

  return NextResponse.json({ url: session.url })
}
