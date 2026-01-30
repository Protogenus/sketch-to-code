import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getUserCredits, deductCredit, saveConversion } from '@/lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `You are an expert web developer who converts hand-drawn wireframes into production-ready code. 

When analyzing a wireframe image:
1. Identify all UI components (headers, navigation, buttons, forms, cards, images, text blocks)
2. Understand the layout structure (grid, flexbox patterns)
3. **IMPORTANT: Pay special attention to handwritten labels and text annotations**
4. If you see text labels like "Header", "Navigation", "Sidebar", "Main Content", "Footer", "Button", "Card", etc., use these as semantic HTML elements
5. Use labels to determine element hierarchy and structure
6. Infer reasonable styling based on the sketch

Generate clean, semantic, responsive code that:
- Uses modern HTML5 elements
- Includes comprehensive CSS with flexbox/grid layouts
- Is mobile-responsive with media queries
- Uses a modern color palette (indigo/purple primary, gray neutrals)
- Includes hover states and transitions
- Has placeholder content that matches the wireframe intent

Always respond with a valid JSON object containing:
{
  "html": "<!-- The body content HTML -->",
  "css": "/* Complete CSS styles */",
  "js": "// Optional JavaScript for interactivity",
  "react": "// Complete React functional component with inline styles or Tailwind classes",
  "structure": { /* JSON representation of the page structure */ }
}

Make the generated website look professional and polished, not like a wireframe.`

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const credits = await getUserCredits(userId)
    if (credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits', message: 'Please purchase more credits to continue.' },
        { status: 402 }
      )
    }

    const { image, format } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image,
              },
            },
            {
              type: 'text',
              text: `Convert this wireframe to production-ready code. 

**IMPORTANT INSTRUCTIONS:**
- Look for handwritten labels and create appropriate HTML elements (all work in static sites):
- **Layout:** "Header" → <header>, "Navigation"/"Nav" → <nav>, "Sidebar" → <aside>, "Main Content" → <main>, "Footer" → <footer>, "Section" → <section>
- **Marketing:** "Hero" → hero section, "CTA" → call-to-action section, "Testimonial" → testimonial cards, "Pricing" → pricing table, "Features" → feature grid
- **Content:** "Article" → <article>, "Form" → contact form (works with email services), "Grid" → grid container, "Card" → card components
- **UI:** "Button" → <button>, "Modal" → modal dialog, "Accordion" → collapsible content, "Tabs" → tab navigation, "Carousel" → image slider, "Dropdown" → dropdown menu
- **Navigation:** "Breadcrumb" → breadcrumb navigation
- **Important:** All generated code must work as standalone HTML/CSS/JS files without backend dependencies
- Use the labels to understand the layout structure and create semantic, accessible HTML

Focus on creating a beautiful, modern, responsive website. Return ONLY a valid JSON object with html, css, js, react, and structure fields.`,
            },
          ],
        },
      ],
      system: SYSTEM_PROMPT,
    })

    const textContent = response.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    let parsedResult
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      parsedResult = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      parsedResult = {
        html: `<div class="container">
          <header class="header">
            <h1>Generated Website</h1>
            <nav><a href="#">Home</a> <a href="#">About</a> <a href="#">Contact</a></nav>
          </header>
          <main class="main">
            <section class="hero">
              <h2>Welcome to Your Website</h2>
              <p>This is a placeholder. The AI couldn't fully parse the wireframe.</p>
              <button class="btn">Get Started</button>
            </section>
          </main>
          <footer class="footer">
            <p>&copy; 2024 Your Website</p>
          </footer>
        </div>`,
        css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; line-height: 1.6; color: #1f2937; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #e5e7eb; }
.header h1 { font-size: 1.5rem; color: #6366f1; }
.header nav a { margin-left: 1.5rem; color: #4b5563; text-decoration: none; }
.header nav a:hover { color: #6366f1; }
.hero { text-align: center; padding: 4rem 0; }
.hero h2 { font-size: 2.5rem; margin-bottom: 1rem; }
.hero p { color: #6b7280; max-width: 600px; margin: 0 auto 2rem; }
.btn { background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.5rem; font-size: 1rem; cursor: pointer; }
.btn:hover { opacity: 0.9; }
.footer { text-align: center; padding: 2rem 0; border-top: 1px solid #e5e7eb; color: #6b7280; }
@media (max-width: 768px) { .header { flex-direction: column; gap: 1rem; } .hero h2 { font-size: 1.75rem; } }`,
        js: '',
        react: `export default function GeneratedComponent() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">Generated Website</h1>
          <nav className="space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">About</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to Your Website</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">This is placeholder content.</p>
        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:opacity-90">
          Get Started
        </button>
      </main>
    </div>
  );
}`,
        structure: { type: 'page', sections: ['header', 'hero', 'footer'] }
      }
    }

    const deducted = await deductCredit(userId)
    if (!deducted) {
      return NextResponse.json(
        { error: 'Failed to deduct credit' },
        { status: 500 }
      )
    }

    await saveConversion(
      userId,
      `data:image/jpeg;base64,${image.substring(0, 100)}...`,
      JSON.stringify(parsedResult),
      format || 'html'
    )

    return NextResponse.json({
      html: parsedResult.html,
      css: parsedResult.css,
      js: parsedResult.js || '',
      react: parsedResult.react,
      json: parsedResult.structure || parsedResult,
    })
  } catch (error: any) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Conversion failed', message: error.message },
      { status: 500 }
    )
  }
}
