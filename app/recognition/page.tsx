"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Upload, Download, Copy, Check, Palette, Type, Zap, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function RecognitionPage() {
  const [copied, setCopied] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMenuOpen && !target.closest('header') && !target.closest('[data-mobile-menu]')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SketchToCode</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition">Features</Link>
              <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</Link>
              <Link href="/recognition" className="text-indigo-600 hover:text-indigo-700 transition font-medium">Smart Recognition</Link>
              <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
              <Link href="/#faq" className="text-gray-600 hover:text-gray-900 transition">FAQ</Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 hover:from-indigo-100 hover:to-purple-100 transition-all"
              >
                <div className="w-6 h-5 flex flex-col justify-center items-center gap-1.5">
                  <div className={`w-full h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </div>
              </button>

              <Link href="/app" className="hidden md:block">
                <Button variant="gradient">Go to App</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0
        }}
        className="md:hidden fixed top-16 left-0 right-0 z-40 glass border-b overflow-hidden"
        data-mobile-menu
      >
        <div className="container mx-auto px-4 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/#features" 
              className="text-gray-600 hover:text-gray-900 transition py-2 px-4 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              className="text-gray-600 hover:text-gray-900 transition py-2 px-4 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/recognition" 
              className="text-indigo-600 hover:text-indigo-700 transition py-2 px-4 rounded-lg hover:bg-indigo-50 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Smart Recognition
            </Link>
            <Link 
              href="/#pricing" 
              className="text-gray-600 hover:text-gray-900 transition py-2 px-4 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/#faq" 
              className="text-gray-600 hover:text-gray-900 transition py-2 px-4 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
          </div>
          
          <div className="flex flex-col space-y-3 pt-4 border-t">
            <Link href="/app" onClick={() => setIsMenuOpen(false)}>
              <Button variant="gradient" className="w-full">Go to App</Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Recognition System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Master the art of wireframe-to-code conversion with our intelligent text and color recognition system
            </p>
            <Link href="/app">
              <Button size="xl" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2">
                Try It Now
                <Zap className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Interactive Examples</h2>
            <p className="text-xl text-gray-600">See exactly how text labels and colors work together</p>
          </div>

          <Tabs defaultValue="text-labels" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text-labels">Text Labels</TabsTrigger>
              <TabsTrigger value="color-coding">Color Coding</TabsTrigger>
              <TabsTrigger value="combinations">Smart Combinations</TabsTrigger>
            </TabsList>

            {/* Text Labels Examples */}
            <TabsContent value="text-labels" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="w-5 h-5" />
                        Basic Wireframe with Text Labels
                      </CardTitle>
                      <CardDescription>
                        Simple wireframe showing how text labels guide the AI (works with paper, MS Paint, or any tool)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 rounded-lg p-6 mb-4">
                        <div className="space-y-4">
                          <div className="border-2 border-gray-400 p-4 text-center">
                            <div className="text-sm font-bold text-gray-700 mb-2">Header</div>
                            <div className="text-xs text-gray-500">Navigation goes here</div>
                          </div>
                          <div className="border-2 border-gray-400 p-8 text-center">
                            <div className="text-sm font-bold text-gray-700 mb-4">Hero</div>
                            <div className="text-xs text-gray-500">Main content area</div>
                          </div>
                          <div className="border-2 border-gray-400 p-4 text-center">
                            <div className="text-sm font-bold text-gray-700 mb-2">Footer</div>
                            <div className="text-xs text-gray-500">Footer content</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">What the AI Creates:</h4>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                          <div className="space-y-4">
                            <div className="bg-gray-100 p-4 rounded border">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Logo</span>
                                <div className="flex gap-4 text-sm">
                                  <span>Home</span>
                                  <span>About</span>
                                  <span>Contact</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-indigo-50 p-8 rounded border text-center">
                              <h2 className="text-2xl font-bold text-indigo-600 mb-2">Hero Content</h2>
                              <p className="text-gray-600">Your main message goes here</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded border text-center text-sm text-gray-600">
                              <p>Footer Content © 2024</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Advanced Wireframe
                      </CardTitle>
                      <CardDescription>
                        Complex layout with multiple element types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 rounded-lg p-6 mb-4">
                        <div className="space-y-4">
                          <div className="border-2 border-gray-400 p-4 text-center">
                            <div className="text-sm font-bold text-gray-700 mb-2">Header</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="border-2 border-gray-400 p-4 text-center">
                              <div className="text-xs font-bold text-gray-700">Sidebar</div>
                            </div>
                            <div className="border-2 border-gray-400 p-4 text-center col-span-2">
                              <div className="text-xs font-bold text-gray-700">Main Content</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="border-2 border-gray-400 p-2 text-center">
                              <div className="text-xs font-bold text-gray-700">Card</div>
                            </div>
                            <div className="border-2 border-gray-400 p-2 text-center">
                              <div className="text-xs font-bold text-gray-700">Card</div>
                            </div>
                            <div className="border-2 border-gray-400 p-2 text-center">
                              <div className="text-xs font-bold text-gray-700">Card</div>
                            </div>
                          </div>
                          <div className="border-2 border-gray-400 p-4 text-center">
                            <div className="text-sm font-bold text-gray-700">Footer</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Generated Structure:</h4>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                          <div className="space-y-4">
                            <div className="bg-gray-100 p-4 rounded border">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Logo</span>
                                <div className="flex gap-4 text-sm">
                                  <span>Home</span>
                                  <span>About</span>
                                  <span>Contact</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="bg-blue-50 p-4 rounded border text-center">
                                <div className="text-xs font-bold text-blue-600 mb-2">Sidebar</div>
                                <div className="text-xs text-gray-500">Menu items</div>
                              </div>
                              <div className="bg-gray-50 p-4 rounded border text-center col-span-3">
                                <div className="text-xs font-bold text-gray-700 mb-2">Main Content</div>
                                <div className="text-xs text-gray-500">Primary content area</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-white p-3 rounded border text-center shadow-sm">
                                <div className="text-xs font-bold text-gray-700">Card 1</div>
                              </div>
                              <div className="bg-white p-3 rounded border text-center shadow-sm">
                                <div className="text-xs font-bold text-gray-700">Card 2</div>
                              </div>
                              <div className="bg-white p-3 rounded border text-center shadow-sm">
                                <div className="text-xs font-bold text-gray-700">Card 3</div>
                              </div>
                            </div>
                            <div className="bg-gray-100 p-4 rounded border text-center text-sm text-gray-600">
                              <p>Footer Content © 2024</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Color Coding Examples */}
            <TabsContent value="color-coding" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Color-Coded Wireframe
                      </CardTitle>
                      <CardDescription>
                        Using colors to define element types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 rounded-lg p-6 mb-4">
                        <div className="space-y-4">
                          <div className="bg-gray-500 p-4 text-center text-white">
                            <div className="text-sm font-bold">Navigation</div>
                          </div>
                          <div className="bg-green-500 p-8 text-center text-white">
                            <div className="text-sm font-bold">Hero Section</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-500 p-4 text-center text-white">
                              <div className="text-xs font-bold">Card</div>
                            </div>
                            <div className="bg-blue-500 p-4 text-center text-white">
                              <div className="text-xs font-bold">Card</div>
                            </div>
                          </div>
                          <div className="bg-red-500 p-4 text-center text-white">
                            <div className="text-sm font-bold">Button</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">AI Creates:</h4>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                          <div className="space-y-4">
                            <div className="bg-gray-200 p-4 rounded border">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Logo</span>
                                <div className="flex gap-4 text-sm">
                                  <span>Home</span>
                                  <span>About</span>
                                  <span>Contact</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-green-100 p-8 rounded border text-center">
                              <h2 className="text-2xl font-bold text-green-600 mb-2">Hero Section</h2>
                              <p className="text-gray-600 mb-4">Main call-to-action content</p>
                              <div className="bg-white p-3 rounded border inline-block">
                                <span className="text-green-600 font-medium">Learn More</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-blue-50 p-6 rounded border text-center">
                                <div className="text-sm font-bold text-blue-600 mb-2">Card</div>
                                <div className="text-xs text-gray-500">Content area</div>
                              </div>
                              <div className="bg-blue-50 p-6 rounded border text-center">
                                <div className="text-sm font-bold text-blue-600 mb-2">Card</div>
                                <div className="text-xs text-gray-500">Content area</div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-red-500 text-white px-6 py-3 rounded-lg inline-block">
                                <span className="font-medium">Button</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Marketing Page Example
                      </CardTitle>
                      <CardDescription>
                        Color-coded landing page wireframe
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 rounded-lg p-6 mb-4">
                        <div className="space-y-4">
                          <div className="bg-gray-500 p-4 text-center text-white">
                            <div className="text-sm font-bold">Header</div>
                          </div>
                          <div className="bg-green-500 p-8 text-center text-white">
                            <div className="text-sm font-bold">Hero CTA</div>
                          </div>
                          <div className="bg-orange-500 p-6 text-center text-white">
                            <div className="text-sm font-bold">Pricing</div>
                          </div>
                          <div className="bg-purple-500 p-4 text-center text-white">
                            <div className="text-sm font-bold">Testimonial</div>
                          </div>
                          <div className="bg-yellow-500 p-4 text-center text-white">
                            <div className="text-sm font-bold">Contact Form</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Generated Website:</h4>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                          <div className="space-y-4">
                            <div className="bg-gray-200 p-4 rounded border">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Logo</span>
                                <div className="flex gap-4 text-sm">
                                  <span>Home</span>
                                  <span>Pricing</span>
                                  <span>Contact</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-green-100 p-8 rounded border text-center">
                              <h2 className="text-2xl font-bold text-green-600 mb-2">Hero CTA</h2>
                              <p className="text-gray-600 mb-4">Main call-to-action message</p>
                              <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block">
                                <span className="font-medium">Get Started</span>
                              </div>
                            </div>
                            <div className="bg-orange-100 p-6 rounded border text-center">
                              <h3 className="text-lg font-bold text-orange-600 mb-3">Pricing</h3>
                              <div className="bg-white p-4 rounded border">
                                <div className="text-sm font-medium">$29/mo</div>
                                <div className="text-xs text-gray-500">Premium plan</div>
                              </div>
                            </div>
                            <div className="bg-purple-100 p-6 rounded border text-center">
                              <h3 className="text-lg font-bold text-purple-600 mb-3">Testimonial</h3>
                              <div className="bg-white p-4 rounded border">
                                <div className="text-sm italic text-gray-600">"Great service!"</div>
                                <div className="text-xs text-gray-500 mt-2">- Happy Customer</div>
                              </div>
                            </div>
                            <div className="bg-yellow-100 p-6 rounded border text-center">
                              <h3 className="text-lg font-bold text-yellow-600 mb-3">Contact Form</h3>
                              <div className="bg-white p-3 rounded border mb-2">
                                <div className="text-xs text-gray-500">Email address</div>
                              </div>
                              <div className="bg-yellow-600 text-white px-4 py-2 rounded text-sm">
                                <span>Submit</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Smart Combinations */}
            <TabsContent value="combinations" className="mt-8">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Perfect Combination: Green + "Subscribe"
                      </CardTitle>
                      <CardDescription>
                        See how text and colors work together for maximum precision
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold mb-4">Wireframe:</h4>
                          <div className="bg-gray-100 rounded-lg p-6">
                            <div className="bg-green-500 p-8 text-center text-white">
                              <div className="text-lg font-bold mb-2">Subscribe</div>
                              <div className="text-sm">Get updates</div>
                              <div className="bg-white text-green-500 mt-4 p-2 rounded">
                                <div className="text-xs font-bold">Button</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-4">AI Creates:</h4>
                          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded border text-center">
                              <h2 className="text-3xl font-bold text-green-600 mb-4">Subscribe</h2>
                              <p className="text-gray-600 mb-6">Get updates delivered to your inbox</p>
                              <div className="max-w-md mx-auto">
                                <div className="bg-white p-4 rounded border mb-4">
                                  <div className="text-sm text-gray-500">Enter email address</div>
                                </div>
                                <div className="bg-green-600 text-white px-8 py-4 rounded-lg font-medium">
                                  Subscribe Now
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>More Combination Examples</CardTitle>
                      <CardDescription>
                        Different ways to combine text and colors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            color: "bg-blue-500",
                            text: "Pricing Table",
                            result: "Pricing section with table layout"
                          },
                          {
                            color: "bg-purple-500",
                            text: "Customer Review",
                            result: "Testimonial card with quote styling"
                          },
                          {
                            color: "bg-red-500",
                            text: "Buy Now",
                            result: "Prominent purchase button"
                          },
                          {
                            color: "bg-yellow-500",
                            text: "Contact Us",
                            result: "Contact form with validation"
                          },
                          {
                            color: "bg-teal-500",
                            text: "Sidebar Menu",
                            result: "Navigation sidebar with links"
                          },
                          {
                            color: "bg-orange-500",
                            text: "Features Grid",
                            result: "Feature showcase with grid layout"
                          }
                        ].map((example, index) => (
                          <div key={index} className="text-center">
                            <div className={`${example.color} p-4 rounded-lg text-white mb-2`}>
                              <div className="text-sm font-bold">{example.text}</div>
                            </div>
                            <p className="text-xs text-gray-600">{example.result}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Drawing Tools Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Draw Anywhere, Convert Everywhere</h2>
            <p className="text-xl text-gray-600">Use any tool you're comfortable with - our AI understands them all</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "✏️",
                title: "Paper & Pen",
                description: "Traditional sketching with pen, pencil, or markers. Perfect for quick ideas.",
                examples: ["Notebook", "Whiteboard", "Sticky notes"]
              },
              {
                icon: "🎨",
                title: "MS Paint",
                description: "Simple, accessible tool everyone has. Great for basic shapes and text.",
                examples: ["Rectangles", "Text tool", "Fill colors"]
              },
              {
                icon: "💻",
                title: "Design Tools",
                description: "Any digital drawing app works perfectly with our smart recognition.",
                examples: ["Figma", "Sketch", "Photoshop"]
              },
              {
                icon: "📱",
                title: "Mobile Apps",
                description: "Draw on your phone or tablet with any sketching app.",
                examples: ["Procreate", "Paper", "Sketchbook"]
              }
            ].map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="text-4xl mb-4">{tool.icon}</div>
                    <CardTitle>{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{tool.description}</CardDescription>
                    <div className="space-y-1">
                      {tool.examples.map((example, i) => (
                        <div key={i} className="text-sm text-gray-600">{example}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto border">
              <h3 className="text-2xl font-bold mb-4">Why MS Paint Works Great</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-indigo-600 mb-2">🎯 Simple Shapes</h4>
                  <p className="text-gray-600 text-sm">Perfect rectangles and lines make clean wireframes</p>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-600 mb-2">📝 Easy Text</h4>
                  <p className="text-gray-600 text-sm">Text tool makes labeling elements straightforward</p>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-600 mb-2">🎨 Color Fill</h4>
                  <p className="text-gray-600 text-sm">Fill tool perfect for our color coding system</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Quick Reference Guide</h2>
            <p className="text-xl text-gray-600">Copy these examples for your wireframes</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Text Label Examples</CardTitle>
                  <CardDescription>Common labels and what they create</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "Header", creates: "<header> element" },
                      { label: "Navigation", creates: "<nav> with links" },
                      { label: "Hero", creates: "Hero section" },
                      { label: "CTA", creates: "Call-to-action section" },
                      { label: "Features", creates: "Feature grid" },
                      { label: "Pricing", creates: "Pricing table" },
                      { label: "Testimonial", creates: "Testimonial cards" },
                      { label: "Form", creates: "Contact form" },
                      { label: "Button", creates: "<button> element" },
                      { label: "Card", creates: "Card component" },
                      { label: "Footer", creates: "<footer> element" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-sm text-gray-500">{item.creates}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Color Coding Guide</CardTitle>
                  <CardDescription>Colors and their meanings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { color: "bg-blue-500", label: "Blue", usage: "Cards, containers, content" },
                      { color: "bg-green-500", label: "Green", usage: "Hero sections, CTAs" },
                      { color: "bg-red-500", label: "Red", usage: "Buttons, actions" },
                      { color: "bg-orange-500", label: "Orange", usage: "Pricing, features" },
                      { color: "bg-purple-500", label: "Purple", usage: "Testimonials, quotes" },
                      { color: "bg-yellow-500", label: "Yellow", usage: "Forms, inputs" },
                      { color: "bg-gray-500", label: "Gray", usage: "Navigation, headers" },
                      { color: "bg-teal-500", label: "Teal", usage: "Sidebars, secondary" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-6 h-6 ${item.color} rounded`}></div>
                        <div className="flex-1">
                          <span className="font-medium">{item.label}</span>
                          <p className="text-sm text-gray-500">{item.usage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Try It Out?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Draw your website on paper, in MS Paint, or any tool - snap a photo, and get clean, responsive HTML/CSS/JavaScript in seconds.
          </p>
          <Link href="/app">
            <Button size="xl" className="bg-white text-indigo-600 hover:bg-gray-100 gap-2">
              Start Converting
              <Zap className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
