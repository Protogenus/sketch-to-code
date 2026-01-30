import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserCredits, getOrCreateUser } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const email = user.emailAddresses[0]?.emailAddress || ''
    await getOrCreateUser(userId, email)
    
    const credits = await getUserCredits(userId)

    return NextResponse.json({ credits })
  } catch (error: any) {
    console.error('Credits fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credits', message: error.message },
      { status: 500 }
    )
  }
}
