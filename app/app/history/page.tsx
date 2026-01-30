"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Code, ArrowLeft, Download, Eye, Loader2, Clock, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, downloadFile } from '@/lib/utils'

interface Conversion {
  id: string
  image_url: string
  generated_code: string
  format: string
  created_at: string
}

export default function HistoryPage() {
  const { user } = useUser()
  const [history, setHistory] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history')
        if (response.ok) {
          const data = await response.json()
          setHistory(data.history || [])
        }
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const handleDownload = (conversion: Conversion) => {
    try {
      const parsed = JSON.parse(conversion.generated_code)
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <style>${parsed.css}</style>
</head>
<body>
${parsed.html}
  <script>${parsed.js || ''}</script>
</body>
</html>`
      downloadFile(fullHtml, `website-${conversion.id.slice(0, 8)}.html`, 'text/html')
    } catch (error) {
      console.error('Failed to download:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/app" className="flex items-center gap-2">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Converter
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SketchToCode</span>
            </Link>
            <div className="w-32" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Conversion History</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">No conversions yet</h2>
              <p className="text-gray-500 mb-6">Your converted wireframes will appear here.</p>
              <Link href="/app">
                <Button variant="gradient">Create Your First Conversion</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((conversion) => {
              let parsed = null
              try {
                parsed = JSON.parse(conversion.generated_code)
              } catch {}

              return (
                <Card key={conversion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 relative">
                    {parsed && (
                      <iframe
                        srcDoc={`<!DOCTYPE html><html><head><style>${parsed.css}</style></head><body>${parsed.html}</body></html>`}
                        className="w-full h-full pointer-events-none"
                        title={`Preview ${conversion.id}`}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-sm">
                      <Clock className="w-3 h-3" />
                      {formatDate(conversion.created_at)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 uppercase font-medium">
                        {conversion.format || 'HTML'}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedConversion(conversion)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(conversion)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {selectedConversion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedConversion(null)}>
                Close
              </Button>
            </div>
            <div className="h-[70vh]">
              {(() => {
                try {
                  const parsed = JSON.parse(selectedConversion.generated_code)
                  return (
                    <iframe
                      srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${parsed.css}</style></head><body>${parsed.html}<script>${parsed.js || ''}</script></body></html>`}
                      className="w-full h-full"
                      title="Full Preview"
                    />
                  )
                } catch {
                  return <p className="p-4 text-red-500">Failed to parse conversion data</p>
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
