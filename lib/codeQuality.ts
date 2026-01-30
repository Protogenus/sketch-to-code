interface QualityScore {
  overall: number
  breakdown: {
    semantics: number
    structure: number
    styling: number
    responsiveness: number
    accessibility: number
    bestPractices: number
  }
  issues: string[]
  suggestions: string[]
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
}

export function analyzeCodeQuality(html: string, css: string, js: string): QualityScore {
  const issues: string[] = []
  const suggestions: string[] = []
  
  // Semantic HTML Analysis (25% weight)
  const semanticScore = analyzeSemantics(html, issues, suggestions)
  
  // Structure Analysis (20% weight)
  const structureScore = analyzeStructure(html, issues, suggestions)
  
  // Styling Analysis (20% weight)
  const stylingScore = analyzeStyling(css, issues, suggestions)
  
  // Responsiveness Analysis (15% weight)
  const responsivenessScore = analyzeResponsiveness(css, issues, suggestions)
  
  // Accessibility Analysis (10% weight)
  const accessibilityScore = analyzeAccessibility(html, issues, suggestions)
  
  // Best Practices Analysis (10% weight)
  const bestPracticesScore = analyzeBestPractices(html, css, js, issues, suggestions)
  
  const breakdown = {
    semantics: semanticScore,
    structure: structureScore,
    styling: stylingScore,
    responsiveness: responsivenessScore,
    accessibility: accessibilityScore,
    bestPractices: bestPracticesScore
  }
  
  // Calculate weighted overall score
  const overall = Math.round(
    semanticScore * 0.25 +
    structureScore * 0.20 +
    stylingScore * 0.20 +
    responsivenessScore * 0.15 +
    accessibilityScore * 0.10 +
    bestPracticesScore * 0.10
  )
  
  const grade = getGrade(overall)
  
  return {
    overall,
    breakdown,
    issues,
    suggestions,
    grade
  }
}

function analyzeSemantics(html: string, issues: string[], suggestions: string[]): number {
  let score = 100
  
  // Check for semantic HTML5 elements
  const semanticElements = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'figure', 'figcaption']
  const foundSemantic = semanticElements.filter(el => html.includes(`<${el}`))
  
  if (foundSemantic.length < 3) {
    score -= 20
    issues.push('Limited use of semantic HTML5 elements')
    suggestions.push('Use semantic elements like header, nav, main, section for better structure')
  }
  
  // Check for proper heading hierarchy
  const hasH1 = html.includes('<h1')
  const headings = html.match(/<h[1-6]/g) || []
  
  if (!hasH1) {
    score -= 15
    issues.push('Missing H1 heading')
    suggestions.push('Add a single H1 heading for page title')
  }
  
  if (headings.length === 0) {
    score -= 10
    issues.push('No heading structure found')
    suggestions.push('Use headings (h1-h6) to create content hierarchy')
  }
  
  // Check for proper list usage
  const hasLists = html.includes('<ul') || html.includes('<ol') || html.includes('<dl')
  if (!hasLists && (html.includes('•') || html.includes('-') || html.includes('*'))) {
    score -= 10
    issues.push('Bullet points not using proper list elements')
    suggestions.push('Use <ul> or <ol> for lists instead of plain text bullets')
  }
  
  return Math.max(0, score)
}

function analyzeStructure(html: string, issues: string[], suggestions: string[]): number {
  let score = 100
  
  // Check for proper document structure
  const hasDoctype = html.includes('<!DOCTYPE')
  const hasHtmlTag = html.includes('<html')
  const hasHeadTag = html.includes('<head')
  const hasBodyTag = html.includes('<body')
  
  if (!hasDoctype) {
    score -= 20
    issues.push('Missing DOCTYPE declaration')
    suggestions.push('Add <!DOCTYPE html> at the beginning')
  }
  
  if (!hasHtmlTag || !hasHeadTag || !hasBodyTag) {
    score -= 15
    issues.push('Incomplete HTML document structure')
    suggestions.push('Ensure proper HTML structure with html, head, and body tags')
  }
  
  // Check for meta tags
  const hasViewport = html.includes('viewport')
  const hasCharset = html.includes('charset')
  
  if (!hasViewport) {
    score -= 10
    issues.push('Missing viewport meta tag')
    suggestions.push('Add <meta name="viewport" content="width=device-width, initial-scale=1.0">')
  }
  
  if (!hasCharset) {
    score -= 5
    issues.push('Missing charset meta tag')
    suggestions.push('Add <meta charset="UTF-8">')
  }
  
  // Check for proper nesting
  const openDivs = (html.match(/<div/g) || []).length
  const closeDivs = (html.match(/<\/div>/g) || []).length
  
  if (openDivs !== closeDivs) {
    score -= 25
    issues.push('Mismatched div tags')
    suggestions.push('Check that all opening div tags have corresponding closing tags')
  }
  
  return Math.max(0, score)
}

function analyzeStyling(css: string, issues: string[], suggestions: string[]): number {
  let score = 100
  
  if (!css || css.trim().length === 0) {
    score -= 50
    issues.push('No CSS provided')
    suggestions.push('Add CSS styling for visual presentation')
    return Math.max(0, score)
  }
  
  // Check for responsive units
  const hasRelativeUnits = css.includes('rem') || css.includes('em') || css.includes('%') || css.includes('vw') || css.includes('vh')
  if (!hasRelativeUnits) {
    score -= 15
    issues.push('No relative CSS units found')
    suggestions.push('Use relative units (rem, em, %) for better scalability')
  }
  
  // Check for CSS organization
  const hasComments = css.includes('/*')
  if (!hasComments && css.length > 500) {
    score -= 10
    issues.push('CSS lacks organization comments')
    suggestions.push('Add comments to organize CSS sections')
  }
  
  // Check for modern CSS features
  const hasFlexbox = css.includes('display: flex') || css.includes('display:flex')
  const hasGrid = css.includes('display: grid') || css.includes('display:grid')
  
  if (!hasFlexbox && !hasGrid) {
    score -= 20
    issues.push('No modern layout systems (Flexbox/Grid) found')
    suggestions.push('Use Flexbox or Grid for modern layouts')
  }
  
  // Check for color contrast basics
  const hasColorStyles = css.includes('color:') || css.includes('background:')
  if (hasColorStyles) {
    // Basic check for hardcoded colors
    const hexColors = css.match(/#[0-9a-fA-F]{6}/g) || []
    if (hexColors.length > 5) {
      score -= 10
      issues.push('Many hardcoded colors detected')
      suggestions.push('Consider using CSS variables for consistent color scheme')
    }
  }
  
  return Math.max(0, score)
}

function analyzeResponsiveness(css: string, issues: string[], suggestions: string[]): number {
  let score = 100
  
  if (!css || css.trim().length === 0) {
    return 50 // No CSS means no responsiveness
  }
  
  // Check for media queries
  const hasMediaQueries = css.includes('@media')
  if (!hasMediaQueries) {
    score -= 40
    issues.push('No media queries for responsive design')
    suggestions.push('Add @media queries for different screen sizes')
  }
  
  // Check for mobile-first approach
  const hasMinWidthQueries = css.includes('@media') && css.includes('min-width')
  if (hasMediaQueries && !hasMinWidthQueries) {
    score -= 15
    issues.push('Not using mobile-first approach')
    suggestions.push('Use min-width media queries for mobile-first design')
  }
  
  // Check for flexible layouts
  const hasFlexibleUnits = css.includes('%') || css.includes('vw') || css.includes('vh')
  const hasFlexbox = css.includes('display: flex') || css.includes('display:flex')
  
  if (!hasFlexibleUnits && !hasFlexbox) {
    score -= 20
    issues.push('Layout may not be responsive')
    suggestions.push('Use flexible units or Flexbox for responsive layouts')
  }
  
  // Check for responsive images
  const hasImageStyles = css.includes('img') || css.includes('image')
  if (hasImageStyles && !css.includes('max-width')) {
    score -= 15
    issues.push('Images may not be responsive')
    suggestions.push('Add max-width: 100% to images for responsiveness')
  }
  
  return Math.max(0, score)
}

function analyzeAccessibility(html: string, issues: string[], suggestions: string[]): number {
  let score = 100
  
  // Check for alt text on images
  const images = html.match(/<img[^>]*>/g) || []
  const imagesWithoutAlt = images.filter(img => !img.includes('alt='))
  
  if (imagesWithoutAlt.length > 0) {
    score -= 20
    issues.push(`${imagesWithoutAlt.length} image(s) missing alt text`)
    suggestions.push('Add descriptive alt text to all images')
  }
  
  // Check for form labels
  const inputs = html.match(/<input[^>]*>/g) || []
  const hasLabels = html.includes('<label')
  
  if (inputs.length > 0 && !hasLabels) {
    score -= 25
    issues.push('Form inputs without labels')
    suggestions.push('Add labels to all form inputs for accessibility')
  }
  
  // Check for button accessibility
  const buttons = html.match(/<button[^>]*>/g) || []
  const buttonLinks = html.match(/<a[^>]*>/g) || []
  
  if (buttons.length === 0 && buttonLinks.length === 0) {
    score -= 10
    issues.push('No interactive elements found')
    suggestions.push('Add buttons or links for user interaction')
  }
  
  // Check for skip navigation (bonus)
  const hasSkipLink = html.includes('skip') || html.includes('Skip')
  if (html.length > 2000 && !hasSkipLink) {
    score -= 5
    suggestions.push('Consider adding skip navigation link for keyboard users')
  }
  
  return Math.max(0, score)
}

function analyzeBestPractices(html: string, css: string, js: string, issues: string[], suggestions: string[]): number {
  let score = 100
  
  // Check for inline styles
  const inlineStyles = html.match(/style=/g) || []
  if (inlineStyles.length > 3) {
    score -= 15
    issues.push('Excessive inline CSS styles')
    suggestions.push('Move styles to external CSS for better maintainability')
  }
  
  // Check for inline scripts
  const inlineScripts = html.match(/<script>/g) || []
  if (inlineScripts.length > 0) {
    score -= 10
    issues.push('Inline JavaScript detected')
    suggestions.push('Move JavaScript to external files')
  }
  
  // Check for table usage (should be for data only)
  const hasTables = html.includes('<table')
  const hasLayoutTables = hasTables && !html.includes('<th') && !html.includes('<thead')
  
  if (hasLayoutTables) {
    score -= 20
    issues.push('Tables possibly used for layout')
    suggestions.push('Use CSS for layout, reserve tables for data')
  }
  
  // Check for divitis (too many nested divs)
  const divDepth = getMaxDivDepth(html)
  if (divDepth > 8) {
    score -= 10
    issues.push('Excessively nested divs')
    suggestions.push('Simplify HTML structure, use semantic elements')
  }
  
  // JavaScript best practices
  if (js && js.length > 0) {
    // Check for console.log
    const consoleLogs = js.match(/console\.log/g) || []
    if (consoleLogs.length > 2) {
      score -= 5
      issues.push('Console.log statements in production code')
      suggestions.push('Remove console.log statements')
    }
    
    // Check for use of var
    const varUsage = js.match(/\bvar\b/g) || []
    if (varUsage.length > 0) {
      score -= 10
      issues.push('Using var instead of const/let')
      suggestions.push('Use const and let instead of var')
    }
  }
  
  return Math.max(0, score)
}

function getMaxDivDepth(html: string): number {
  let maxDepth = 0
  let currentDepth = 0
  
  for (const char of html) {
    if (char === '<') {
      const nextChars = html.substring(html.indexOf(char), html.indexOf(char) + 10)
      if (nextChars.includes('<div')) {
        currentDepth++
        maxDepth = Math.max(maxDepth, currentDepth)
      } else if (nextChars.includes('</div>')) {
        currentDepth--
      }
    }
  }
  
  return maxDepth
}

function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-green-600'
    case 'B': return 'text-blue-600'
    case 'C': return 'text-yellow-600'
    case 'D': return 'text-orange-600'
    case 'F': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

export function getGradeDescription(grade: string): string {
  switch (grade) {
    case 'A': return 'Excellent - Production ready code'
    case 'B': return 'Good - Minor improvements needed'
    case 'C': return 'Fair - Several improvements needed'
    case 'D': return 'Poor - Significant improvements needed'
    case 'F': return 'Fail - Major issues present'
    default: return 'Unknown quality'
  }
}
