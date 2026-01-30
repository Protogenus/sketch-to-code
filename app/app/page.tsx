"use client"

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Code,
  Download,
  Copy,
  Check,
  Loader2,
  Image as ImageIcon,
  FileCode,
  Eye,
  History,
  CreditCard,
  LogOut,
  ChevronDown,
  X,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatPrice, fileToBase64 } from '@/lib/utils'
import { getConversions, downloadFile, copyToClipboard } from '@/lib/conversions'
import Link from 'next/link'

type ExportFormat = 'html' | 'react' | 'json'

interface ConversionResult {
  html: string
  css: string
  js: string
  react: string
  json: object
}

export default function ConverterApp() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('html')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  })

  const handleConvert = async () => {
    if (!imageFile || !user) return

    setIsConverting(true)
    setConversionProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setConversionProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      const base64 = await fileToBase64(imageFile)
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          format: exportFormat
        })
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Conversion failed')
      }

      const data = await response.json()
      setConversionProgress(100)
      setResult(data)
      setCredits(prev => prev - 1)
      
      toast({
        title: "Conversion complete!",
        description: "Your wireframe has been converted to code.",
      })
    } catch (error: any) {
      toast({
        title: "Conversion failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsConverting(false)
      setConversionProgress(0)
    }
  }

  const handleDownload = () => {
    if (!result) return

    if (exportFormat === 'html') {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <style>
${result.css}
  </style>
</head>
<body>
${result.html}
  <script>
${result.js}
  </script>
</body>
</html>`
      downloadFile(fullHtml, 'website.html', 'text/html')
    } else if (exportFormat === 'react') {
      downloadFile(result.react, 'Component.jsx', 'text/javascript')
    } else {
      downloadFile(JSON.stringify(result.json, null, 2), 'structure.json', 'application/json')
    }

    toast({
      title: "Downloaded!",
      description: `Your ${exportFormat.toUpperCase()} file has been downloaded.`,
    })
  }

  const handleCopy = async () => {
    if (!result) return

    let content = ''
    if (exportFormat === 'html') {
      content = `<!-- HTML -->\n${result.html}\n\n/* CSS */\n${result.css}\n\n// JavaScript\n${result.js}`
    } else if (exportFormat === 'react') {
      content = result.react
    } else {
      content = JSON.stringify(result.json, null, 2)
    }

    await copyToClipboard(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    })
  }

  const clearImage = () => {
    setUploadedImage(null)
    setImageFile(null)
    setResult(null)
  }

  // Fetch credits on component mount and check for successful purchase
  useEffect(() => {
    if (!user) return

    const fetchCredits = async () => {
      try {
        const response = await fetch('/api/credits')
        if (response.ok) {
          const data = await response.json()
          setCredits(data.credits)
        }
      } catch (error) {
        console.error('Failed to fetch credits:', error)
      }
    }

    fetchCredits()

    // Check for successful purchase from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      // Clear URL parameters immediately
      window.history.replaceState({}, '', window.location.pathname)
      // Refetch credits after a short delay to ensure webhook processed
      setTimeout(fetchCredits, 2000)
    }
  }, [user, toast])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SketchToCode</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-600">{credits} credits</span>
              </div>

              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity">
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase()}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && user?.lastName && (
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      )}
                      {user?.emailAddresses && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.emailAddresses[0].emailAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/app/history" className="flex items-center gap-2">
                      <History className="w-4 h-4" />
                      History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pricing" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Buy Credits
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <SignOutButton>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Log out
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Upload Wireframe
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedImage ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50'
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <Upload className="w-10 h-10 text-indigo-600" />
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    {isDragActive ? 'Drop your wireframe here' : 'Drag & drop your wireframe'}
                  </p>
                  <p className="text-gray-600 mb-6 text-lg">or click to browse</p>
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">PNG, JPG up to 10MB</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={uploadedImage}
                    alt="Uploaded wireframe"
                    className="w-full rounded-lg border"
                  />
                </div>
              )}

              {uploadedImage && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Export Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'html', label: 'HTML/CSS', icon: FileCode },
                        { id: 'react', label: 'React', icon: Code },
                        { id: 'json', label: 'JSON', icon: FileCode }
                      ].map((format) => (
                        <button
                          key={format.id}
                          onClick={() => setExportFormat(format.id as ExportFormat)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            exportFormat === format.id
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <format.icon className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm font-medium">{format.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleConvert}
                    disabled={isConverting || credits < 1}
                    className="w-full"
                    variant="gradient"
                    size="lg"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : credits < 1 ? (
                      'No credits remaining'
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Convert to Code (1 credit)
                      </>
                    )}
                  </Button>

                  {isConverting && (
                    <div className="space-y-2">
                      <Progress value={conversionProgress} />
                      <p className="text-sm text-center text-gray-500">
                        Analyzing wireframe with AI...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Generated Code
                </CardTitle>
                {result && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="border-2 border-dashed rounded-xl p-12 text-center bg-gradient-to-br from-gray-50 to-indigo-50">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                    <FileCode className="w-10 h-10 text-indigo-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Ready to generate code
                  </p>
                  <p className="text-gray-500">
                    Upload a wireframe and click convert to see the magic
                  </p>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full bg-gray-100 rounded-lg p-1">
                    <TabsTrigger value="preview" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="html" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">HTML</TabsTrigger>
                    <TabsTrigger value="css" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">CSS</TabsTrigger>
                    <TabsTrigger value="js" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">JS</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
                      <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-4 py-3 flex items-center gap-1.5 border-b">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                        <span className="ml-auto text-xs text-gray-500 font-medium">Preview</span>
                      </div>
                      <iframe
                        srcDoc={`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${result.css}</style>
</head>
<body>${result.html}<script>${result.js}</script></body>
</html>`}
                        className="w-full h-[450px] bg-white"
                        title="Preview"
                      />
                    </div>
                    
                                      </TabsContent>

                  <TabsContent value="html" className="mt-4">
                    <pre className="code-preview p-4 max-h-[400px] overflow-auto">
                      <code>{result.html}</code>
                    </pre>
                  </TabsContent>

                  <TabsContent value="css" className="mt-4">
                    <pre className="code-preview p-4 max-h-[400px] overflow-auto">
                      <code>{result.css}</code>
                    </pre>
                  </TabsContent>

                  <TabsContent value="js" className="mt-4">
                    <pre className="code-preview p-4 max-h-[400px] overflow-auto">
                      <code>{result.js || '// No JavaScript generated'}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
