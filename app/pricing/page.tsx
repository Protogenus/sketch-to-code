"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Check, Code, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

const PACKS = [
  {
    id: 'pack_10',
    name: 'Starter Pack',
    credits: 10,
    price: 25,
    pricePerCredit: '2.50',
    savings: '15% off',
    features: ['10 conversions', 'All export formats', 'Priority support'],
  },
  {
    id: 'pack_50',
    name: 'Pro Pack',
    credits: 50,
    price: 100,
    pricePerCredit: '2.00',
    savings: '50% off',
    popular: true,
    features: ['50 conversions', 'All export formats', 'Priority support', 'Conversion history'],
  },
  {
    id: 'pack_100',
    name: 'Agency Pack',
    credits: 100,
    price: 180,
    pricePerCredit: '1.80',
    savings: 'Best value',
    features: ['100 conversions', 'All export formats', 'Priority support', 'Conversion history', 'API access (coming soon)'],
  },
]

export default function PricingPage() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [loadingPack, setLoadingPack] = useState<string | null>(null)

  const handlePurchase = async (packId: string) => {
    if (!user) {
      window.location.href = '/sign-up'
      return
    }

    setLoadingPack(packId)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoadingPack(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SketchToCode</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/app">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to App
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="gradient">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Buy Credits</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pay only for what you use. Credits never expire.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PACKS.map((pack) => (
              <Card 
                key={pack.id} 
                className={`relative ${pack.popular ? 'border-2 border-indigo-500 shadow-lg' : ''}`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pack.name}</CardTitle>
                  <CardDescription>{pack.savings}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${pack.price}</span>
                    <span className="text-gray-500 ml-2">/ {pack.credits} credits</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    ${pack.pricePerCredit} per conversion
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pack.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handlePurchase(pack.id)}
                    disabled={loadingPack === pack.id}
                    className="w-full"
                    variant={pack.popular ? 'gradient' : 'outline'}
                  >
                    {loadingPack === pack.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p className="text-gray-600 mb-2">
              <strong>Do credits expire?</strong> No, credits never expire.
            </p>
            <p className="text-gray-600 mb-2">
              <strong>What payment methods do you accept?</strong> All major credit cards via Stripe.
            </p>
            <p className="text-gray-600">
              <strong>Can I get a refund?</strong> Yes, contact support within 7 days for unused credits.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
