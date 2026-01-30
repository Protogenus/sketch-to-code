"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Code, 
  Download, 
  Zap, 
  Check, 
  ArrowRight,
  Sparkles,
  Layout,
  Smartphone,
  Palette,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  const { user, isLoaded } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SketchToCode</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
              <Link href="#faq" className="text-gray-600 hover:text-gray-900 transition">FAQ</Link>
            </div>

            <div className="flex items-center gap-4">
              {isLoaded && user ? (
                <Link href="/app">
                  <Button variant="gradient">Go to App</Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="gradient">Get Started Free</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Claude AI Vision
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your <span className="text-gradient">Wireframes</span>
              <br />Into Production Code
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Draw your website on paper, snap a photo, and get clean, responsive HTML/CSS/JavaScript in seconds. No design skills required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/sign-up">
                <Button size="xl" variant="gradient" className="gap-2">
                  Start Converting Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="xl" variant="outline" className="gap-2">
                  Watch Demo
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              2 free conversions • No credit card required
            </p>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10" />
            <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden max-w-5xl mx-auto">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-sm text-gray-500">SketchToCode Converter</div>
              </div>
              <div className="grid md:grid-cols-2 divide-x">
                <div className="p-8 bg-gray-50">
                  <div className="aspect-[4/3] bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Drop your wireframe here</p>
                      <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="aspect-[4/3] bg-gray-900 rounded-lg p-4 font-mono text-sm text-left overflow-hidden">
                    <pre className="text-green-400">
{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Website</title>
  <link href="styles.css" rel="stylesheet">
</head>
<body>
  <header class="hero">
    <nav class="navbar">
      <div class="logo">Brand</div>
      <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
  </header>
</body>
</html>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-gray-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10,000+</div>
              <div className="text-sm">Wireframes Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">&lt;30s</div>
              <div className="text-sm">Average Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">2,500+</div>
              <div className="text-sm">Happy Developers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From sketch to production-ready code in one click
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "AI-Powered Analysis",
                description: "Claude AI understands your hand-drawn wireframes with incredible accuracy, interpreting layouts, components, and structure."
              },
              {
                icon: <Code className="w-6 h-6" />,
                title: "Clean Code Output",
                description: "Get semantic HTML5, modern CSS (with Tailwind option), and vanilla JavaScript that follows best practices."
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Responsive by Default",
                description: "Every generated design is mobile-first and fully responsive across all device sizes."
              },
              {
                icon: <Layout className="w-6 h-6" />,
                title: "Multiple Export Formats",
                description: "Export as HTML/CSS, React JSX, or JSON structure. More frameworks coming soon."
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "Style Customization",
                description: "Choose color schemes, fonts, and styling preferences before generating code."
              },
              {
                icon: <Download className="w-6 h-6" />,
                title: "Instant Download",
                description: "Download your code as a ZIP file or copy directly to clipboard. Ready to use immediately."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to production code</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Draw Your Wireframe",
                description: "Sketch your website layout on paper or whiteboard. Include boxes for sections, text labels, and basic UI elements."
              },
              {
                step: "2",
                title: "Upload the Photo",
                description: "Take a clear photo and upload it. Our AI analyzes the structure, identifies components, and understands the layout."
              },
              {
                step: "3",
                title: "Get Your Code",
                description: "Receive clean, production-ready HTML/CSS/JS. Preview it live, customize styles, then download or copy to clipboard."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold rounded-2xl flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Pay only for what you use. No subscriptions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Free Trial</CardTitle>
                <CardDescription>Try before you buy</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>2 free conversions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>All export formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Live preview</span>
                  </li>
                </ul>
                <Link href={isLoaded && user ? "/app" : "/sign-up"} className="block mt-6">
                  <Button className="w-full" variant="outline">{isLoaded && user ? "Go to App" : "Get Started"}</Button>
                </Link>
              </CardContent>
            </Card>

            {/* 10 Pack */}
            <Card className="relative border-2 border-indigo-500 shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Starter Pack</CardTitle>
                <CardDescription>Best for individuals</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$25</span>
                  <span className="text-gray-500 ml-2">/ 10 credits</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>10 conversions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>$2.50 per conversion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Save 15%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block mt-6">
                  <Button className="w-full" variant="gradient">Buy Now</Button>
                </Link>
              </CardContent>
            </Card>

            {/* 100 Pack */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Agency Pack</CardTitle>
                <CardDescription>Best for teams & agencies</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$180</span>
                  <span className="text-gray-500 ml-2">/ 100 credits</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>100 conversions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>$1.80 per conversion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Save 55%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>API access (coming soon)</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block mt-6">
                  <Button className="w-full" variant="outline">Buy Now</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-xl text-gray-600">See what our users are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "This tool saved me hours of initial coding. I sketch ideas on paper and have a working prototype in minutes.",
                author: "Sarah Chen",
                role: "Freelance Developer"
              },
              {
                quote: "Perfect for client presentations. I draw their ideas live, upload the photo, and show them a working website immediately.",
                author: "Marcus Johnson",
                role: "Agency Owner"
              },
              {
                quote: "The code quality is impressive. Clean HTML, proper semantic structure, and the responsive CSS just works.",
                author: "Emily Rodriguez",
                role: "Frontend Engineer"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg border px-6">
              <AccordionTrigger className="text-left">What kind of wireframes work best?</AccordionTrigger>
              <AccordionContent>
                Clear, well-drawn wireframes on white paper work best. Use boxes for sections, label text elements, and include basic icons or placeholders. Darker lines and good lighting when taking photos help improve accuracy.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-white rounded-lg border px-6">
              <AccordionTrigger className="text-left">What code formats can I export?</AccordionTrigger>
              <AccordionContent>
                Currently we support HTML/CSS (with optional Tailwind CSS), React JSX components, and a raw JSON structure. Vue, Svelte, and other frameworks are coming soon.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-white rounded-lg border px-6">
              <AccordionTrigger className="text-left">Do credits expire?</AccordionTrigger>
              <AccordionContent>
                No, credits never expire. Buy once and use whenever you need. Your conversion history is also saved permanently.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-white rounded-lg border px-6">
              <AccordionTrigger className="text-left">Is the generated code production-ready?</AccordionTrigger>
              <AccordionContent>
                The code is clean, semantic, and follows modern best practices. It&apos;s a great starting point that you can customize further. Most users deploy it directly or make minor adjustments.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="bg-white rounded-lg border px-6">
              <AccordionTrigger className="text-left">What happens if the conversion fails?</AccordionTrigger>
              <AccordionContent>
                If the AI can&apos;t interpret your wireframe, you won&apos;t be charged a credit. You can try again with a clearer photo or reach out to support for help.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Wireframes?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who save hours with AI-powered wireframe conversion.
          </p>
          <Link href={isLoaded && user ? "/app" : "/sign-up"}>
            <Button size="xl" className="bg-white text-indigo-600 hover:bg-gray-100 gap-2">
              {isLoaded && user ? "Go to App" : "Get Started Free"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm opacity-75">2 free conversions • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SketchToCode</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms</Link>
              <Link href="mailto:support@sketchtocode.app" className="hover:text-gray-900">Support</Link>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2024 SketchToCode. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
