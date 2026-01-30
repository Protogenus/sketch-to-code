import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { addCredits, getOrCreateUser } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    console.log('Webhook received checkout.session.completed:', {
      sessionId: session.id,
      metadata: session.metadata,
      customerEmail: session.customer_email
    })
    
    const clerkUserId = session.metadata?.clerkUserId
    const credits = parseInt(session.metadata?.credits || '0', 10)
    const packId = session.metadata?.packId

    if (!clerkUserId || !credits) {
      console.error('Missing metadata in checkout session:', { clerkUserId, credits, metadata: session.metadata })
      return NextResponse.json({ received: true })
    }

    try {
      console.log('Creating or finding user:', { clerkUserId, email: session.customer_email })
      try {
        await getOrCreateUser(clerkUserId, session.customer_email || '')
        console.log('User created/found successfully')
      } catch (userError) {
        console.error('Error creating/finding user:', userError)
        throw userError
      }
      
      console.log('Adding credits:', { clerkUserId, credits })
      const success = await addCredits(clerkUserId, credits)
      
      if (!success) {
        console.error('Failed to add credits for user:', clerkUserId)
      } else {
        console.log('Successfully added credits:', { clerkUserId, credits })
      }

      await supabaseAdmin.from('purchases').insert({
        user_id: clerkUserId,
        stripe_session_id: session.id,
        credits_purchased: credits,
        amount_paid: session.amount_total ? session.amount_total / 100 : 0,
      })

      console.log(`Added ${credits} credits to user ${clerkUserId}`)
    } catch (error) {
      console.error('Error processing webhook:', error)
    }
  }

  return NextResponse.json({ received: true })
}
