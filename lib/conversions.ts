// Conversion history and utility functions

export interface Conversion {
  id: string
  userId: string
  imageData: string
  result: string
  format: string
  createdAt: string
}

export async function getConversions(): Promise<Conversion[]> {
  // This would typically fetch from your API/database
  // For now, return empty array to prevent build errors
  return []
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(content: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(content)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = content
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}
