import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getUserCredits, deductCredit, saveConversion } from '@/lib/supabase'
import { analyzeCodeQuality } from '@/lib/codeQuality'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Cost control settings
const MAX_TOKENS_PER_REQUEST = 8000
const MAX_COST_PER_CONVERSION = 0.50 // $0.50 max per conversion
const ESTIMATED_COST_PER_TOKEN = 0.00003 // ~$0.03 per 1K tokens
const DAILY_COST_LIMIT_PER_USER = 10.00 // $10 max per user per day
const HOURLY_CONVERSION_LIMIT = 20 // Max 20 conversions per hour

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
        "react": "// Complete React functional component with inline styles",
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
      max_tokens: MAX_TOKENS_PER_REQUEST,
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
- Look for handwritten labels AND color coding to create appropriate HTML elements:

**Color Coding System:**
- **Blue** → Cards, containers, content blocks
- **Green** → Hero sections, main CTAs
- **Red/Pink** → Buttons, important actions
- **Orange** → Pricing tables, features
- **Purple** → Testimonials, quotes
- **Yellow** → Forms, input fields
- **Gray** → Navigation, headers, footers
- **Teal** → Sidebars, secondary content

**Text Labels + Colors:**
- **Layout:** "Header"/Gray → <header>, "Navigation"/Gray → <nav>, "Sidebar"/Teal → <aside>, "Main Content"/Blue → <main>, "Footer"/Gray → <footer>
- **Marketing:** "Hero"/Green → hero section, "CTA"/Green → call-to-action, "Testimonial"/Purple → testimonial cards, "Pricing"/Orange → pricing table, "Features"/Orange → feature grid
- **Content:** "Article"/Blue → <article>, "Form"/Yellow → contact form, "Grid"/Blue → grid container, "Card"/Blue → card components
- **UI:** "Button"/Red → <button>, "Modal"/Blue → modal dialog, "Accordion"/Blue → collapsible content, "Tabs"/Gray → tab navigation, "Carousel"/Blue → image slider, "Dropdown"/Gray → dropdown menu

**Smart Combination System:**
1. **Text labels define the element type** (Button, Header, Card, etc.)
2. **Colors suggest styling/layout context** (Green = prominent, Blue = standard, Red = action)
3. **Colors enhance text labels** (Green + "Subscribe" → prominent CTA section)
4. **Colors alone create basic elements** (blue box = generic card)
5. **Conflicts resolved intelligently** (text wins, but color influences styling)

**Example Combinations:**
- Green box + "Subscribe" → Prominent CTA section with subscribe form
- Blue box + "Pricing" → Standard pricing table layout
- Red box + "Button" → Action-styled button
- Purple box + "Testimonial" → Emphasized testimonial card

**Important:** All generated code must work as standalone HTML/CSS/JS files without backend dependencies. Use text labels for specific elements, colors for visual hierarchy and styling context.

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

    // Log cost monitoring
    const inputTokens = response.usage?.input_tokens || 0
    const outputTokens = response.usage?.output_tokens || 0
    const totalTokens = inputTokens + outputTokens
    const estimatedCost = totalTokens * ESTIMATED_COST_PER_TOKEN
    
    console.log('AI Cost Analysis:', {
      userId,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost: `$${estimatedCost.toFixed(4)}`,
      maxAllowed: `$${MAX_COST_PER_CONVERSION}`,
      withinLimit: estimatedCost <= MAX_COST_PER_CONVERSION
    })

    // Warn if approaching cost limit
    if (estimatedCost > MAX_COST_PER_CONVERSION * 0.8) {
      console.warn('High cost conversion detected:', {
        userId,
        estimatedCost: `$${estimatedCost.toFixed(4)}`,
        tokens: totalTokens
      })
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

    // Check user credits
    const userCredits = await getUserCredits(userId)
    if (userCredits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Check user's daily cost limit (basic in-memory tracking)
    // In production, this should be stored in Redis or database
    const userCostKey = `user_cost_${userId}_${new Date().toDateString()}`
    const userHourlyKey = `user_conversions_${userId}_${new Date().getHours()}`
    
    // Note: In production, implement proper rate limiting storage
    // For now, we'll log and warn about potential abuses
    console.log('Cost Control Check:', {
      userId,
      dailyLimit: `$${DAILY_COST_LIMIT_PER_USER}`,
      hourlyLimit: HOURLY_CONVERSION_LIMIT,
      currentCredits: userCredits
    })

    const deducted = await deductCredit(userId)
    if (!deducted) {
      return NextResponse.json(
        { error: 'Failed to deduct credit' },
        { status: 500 }
      )
    }

    // Analyze code quality
    const qualityScore = analyzeCodeQuality(
      parsedResult.html || '',
      parsedResult.css || '',
      parsedResult.js || ''
    )

    console.log('Code Quality Analysis:', {
      userId,
      overall: qualityScore.overall,
      grade: qualityScore.grade,
      issues: qualityScore.issues.length,
      suggestions: qualityScore.suggestions.length
    })

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
      qualityScore: qualityScore
    })
  } catch (error: any) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Conversion failed', message: error.message },
      { status: 500 }
    )
  }
}
