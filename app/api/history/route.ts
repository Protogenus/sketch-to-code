import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getConversionHistory } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const history = await getConversionHistory(userId)

    return NextResponse.json({ history })
  } catch (error: any) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history', message: error.message },
      { status: 500 }
    )
  }
}
