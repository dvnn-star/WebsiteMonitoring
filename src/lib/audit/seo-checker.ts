import { AuditResult } from '@/types'

interface SEOMetadata {
  title?: string
  titleLength?: number
  description?: string
  descriptionLength?: number
  h1Count?: number
  h2Count?: number
  h3Count?: number
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

export async function checkSEO(url: string): Promise<AuditResult[]> {
  const results: AuditResult[] = []
  let metadata: SEOMetadata = {}

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    })

    const html = await response.text()
    metadata = extractMetadata(html)
  } catch (error) {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'page_fetch',
      status: 'ERROR',
      severity: 'error',
      title: 'Page Fetch',
      message: 'Failed to fetch page content',
      technical_details: { error: error instanceof Error ? error.message : 'Unknown error' },
    })
    return results
  }

  if (metadata.title) {
    if (metadata.titleLength! < 60) {
      results.push({
        audit_id: '',
        category: 'seo',
        check_type: 'title',
        status: 'PASS',
        severity: 'passed',
        title: 'Title',
        message: `"${metadata.title}"`,
        technical_details: { title: metadata.title, length: metadata.titleLength },
      })
    } else {
      results.push({
        audit_id: '',
        category: 'seo',
        check_type: 'title',
        status: 'WARNING',
        severity: 'warning',
        title: 'Title',
        message: `"${metadata.title}" - Too long (${metadata.titleLength} chars)`,
        technical_details: { title: metadata.title, length: metadata.titleLength },
        recommendation: 'Keep title under 60 characters for optimal display in search results.',
      })
    }
  } else {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'title',
      status: 'ERROR',
      severity: 'error',
      title: 'Title',
      message: 'Missing title tag',
      recommendation: 'Add a descriptive title tag to your page.',
    })
  }

  if (metadata.description) {
    if (metadata.descriptionLength! >= 50 && metadata.descriptionLength! <= 160) {
      results.push({
        audit_id: '',
        category: 'seo',
        check_type: 'meta_description',
        status: 'PASS',
        severity: 'passed',
        title: 'Meta Description',
        message: `"${metadata.description.substring(0, 100)}..."`,
        technical_details: { description: metadata.description, length: metadata.descriptionLength },
      })
    } else if (metadata.descriptionLength! < 50) {
      results.push({
        audit_id: '',
        category: 'seo',
        check_type: 'meta_description',
        status: 'WARNING',
        severity: 'warning',
        title: 'Meta Description',
        message: 'Too short',
        technical_details: { description: metadata.description, length: metadata.descriptionLength },
        recommendation: 'Meta description should be 50-160 characters.',
      })
    } else {
      results.push({
        audit_id: '',
        category: 'seo',
        check_type: 'meta_description',
        status: 'WARNING',
        severity: 'warning',
        title: 'Meta Description',
        message: 'Too long',
        technical_details: { description: metadata.description, length: metadata.descriptionLength },
        recommendation: 'Meta description should be 50-160 characters.',
      })
    }
  } else {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'meta_description',
      status: 'WARNING',
      severity: 'warning',
      title: 'Meta Description',
      message: 'Missing meta description',
      recommendation: 'Add a meta description to improve click-through rates in search results.',
    })
  }

  if (metadata.h1Count === 1) {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'h1',
      status: 'PASS',
      severity: 'passed',
      title: 'H1 Heading',
      message: 'Single H1 found',
      technical_details: { h1Count: metadata.h1Count },
    })
  } else if (metadata.h1Count === 0) {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'h1',
      status: 'WARNING',
      severity: 'warning',
      title: 'H1 Heading',
      message: 'No H1 found',
      technical_details: { h1Count: 0 },
      recommendation: 'Add an H1 heading to your page.',
    })
  } else {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'h1',
      status: 'WARNING',
      severity: 'warning',
      title: 'H1 Heading',
      message: `Multiple H1 tags found (${metadata.h1Count})`,
      technical_details: { h1Count: metadata.h1Count },
      recommendation: 'Use only one H1 tag per page.',
    })
  }

  if (metadata.canonical) {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'canonical',
      status: 'PASS',
      severity: 'passed',
      title: 'Canonical URL',
      message: metadata.canonical,
      technical_details: { canonical: metadata.canonical },
    })
  } else {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'canonical',
      status: 'WARNING',
      severity: 'warning',
      title: 'Canonical URL',
      message: 'Missing canonical tag',
      recommendation: 'Add a canonical tag to prevent duplicate content issues.',
    })
  }

  if (metadata.ogTitle) {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'og_title',
      status: 'PASS',
      severity: 'passed',
      title: 'Open Graph Title',
      message: metadata.ogTitle,
    })
  } else {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'og_title',
      status: 'WARNING',
      severity: 'warning',
      title: 'Open Graph Title',
      message: 'Missing og:title',
      recommendation: 'Add og:title for better social media sharing.',
    })
  }

  if (metadata.ogDescription) {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'og_description',
      status: 'PASS',
      severity: 'passed',
      title: 'Open Graph Description',
      message: metadata.ogDescription,
    })
  } else {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'og_description',
      status: 'WARNING',
      severity: 'warning',
      title: 'Open Graph Description',
      message: 'Missing og:description',
      recommendation: 'Add og:description for better social media sharing.',
    })
  }

  if (metadata.ogImage) {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'og_image',
      status: 'PASS',
      severity: 'passed',
      title: 'Open Graph Image',
      message: metadata.ogImage,
    })
  } else {
    results.push({
      audit_id: '',
      category: 'seo',
      check_type: 'og_image',
      status: 'WARNING',
      severity: 'warning',
      title: 'Open Graph Image',
      message: 'Missing og:image',
      recommendation: 'Add og:image for better social media sharing.',
    })
  }

  return results
}

function extractMetadata(html: string): SEOMetadata {
  const metadata: SEOMetadata = {}

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    metadata.title = titleMatch[1].trim()
    metadata.titleLength = metadata.title.length
  }

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
  if (!descMatch) {
    const descMatch2 = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
    if (descMatch2) {
      metadata.description = descMatch2[1].trim()
      metadata.descriptionLength = metadata.description.length
    }
  } else {
    metadata.description = descMatch[1].trim()
    metadata.descriptionLength = metadata.description.length
  }

  const h1Matches = html.match(/<h1[^>]*>/gi)
  metadata.h1Count = h1Matches ? h1Matches.length : 0

  const h2Matches = html.match(/<h2[^>]*>/gi)
  metadata.h2Count = h2Matches ? h2Matches.length : 0

  const h3Matches = html.match(/<h3[^>]*>/gi)
  metadata.h3Count = h3Matches ? h3Matches.length : 0

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
  if (canonicalMatch) {
    metadata.canonical = canonicalMatch[1]
  }

  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
  if (ogTitleMatch) {
    metadata.ogTitle = ogTitleMatch[1]
  }

  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
  if (ogDescMatch) {
    metadata.ogDescription = ogDescMatch[1]
  }

  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
  if (ogImageMatch) {
    metadata.ogImage = ogImageMatch[1]
  }

  return metadata
}
