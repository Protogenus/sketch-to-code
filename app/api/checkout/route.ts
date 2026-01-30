import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, CREDIT_PACKS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { packId } = await request.json()

    if (!packId || !CREDIT_PACKS.find(p => p.id === packId)) {
      return NextResponse.json(
        { error: 'Invalid pack selected' },
        { status: 400 }
      )
    }

    const email = user.emailAddresses[0]?.emailAddress
    if (!email) {
      return NextResponse.json(
        { error: 'No email found' },
        { status: 400 }
      )
    }

    console.log('Creating checkout session:', { userId, email, packId })
    const session = await createCheckoutSession(userId, email, packId)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', message: error.message },
      { status: 500 }
    )
  }
}
