import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const CREDIT_PACKS = [
  {
    id: 'pack_10',
    name: '10 Credits',
    credits: 10,
    price: 2500,
    priceDisplay: '$25',
    savings: '15% off',
  },
  {
    id: 'pack_50',
    name: '50 Credits',
    credits: 50,
    price: 10000,
    priceDisplay: '$100',
    savings: '50% off',
    popular: true,
  },
  {
    id: 'pack_100',
    name: '100 Credits',
    credits: 100,
    price: 18000,
    priceDisplay: '$180',
    savings: 'Best value',
  },
] as const

export async function createCheckoutSession(
  clerkUserId: string,
  email: string,
  packId: string
) {
  const pack = CREDIT_PACKS.find((p) => p.id === packId)
  if (!pack) throw new Error('Invalid pack')

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: pack.name,
            description: `${pack.credits} wireframe-to-code conversions`,
          },
          unit_amount: pack.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?success=true&credits=${pack.credits}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      clerkUserId,
      packId,
      credits: pack.credits.toString(),
    },
  })

  return session
}
