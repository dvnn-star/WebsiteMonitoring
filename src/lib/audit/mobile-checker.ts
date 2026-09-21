import { AuditResult } from '@/types'

export async function checkMobileViewport(url: string): Promise<AuditResult[]> {
  const results: AuditResult[] = []

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    })

    const html = await response.text()
    
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["']/i)

    if (viewportMatch) {
      const content = viewportMatch[1]
      
      if (content.includes('width=device-width')) {
        results.push({
          audit_id: '',
          category: 'performance',
          check_type: 'mobile_viewport',
          status: 'PASS',
          severity: 'passed',
          title: 'Mobile Viewport',
          message: 'Properly configured',
          technical_details: { content },
        })
      } else {
        results.push({
          audit_id: '',
          category: 'performance',
          check_type: 'mobile_viewport',
          status: 'WARNING',
          severity: 'warning',
          title: 'Mobile Viewport',
          message: 'Missing width=device-width',
          technical_details: { content },
          recommendation: 'Add width=device-width to your viewport meta tag.',
        })
      }
    } else {
      results.push({
        audit_id: '',
        category: 'performance',
        check_type: 'mobile_viewport',
        status: 'ERROR',
        severity: 'error',
        title: 'Mobile Viewport',
        message: 'Missing viewport meta tag',
        recommendation: 'Add a viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">',
      })
    }
  } catch (error) {
    results.push({
      audit_id: '',
      category: 'performance',
      check_type: 'mobile_viewport',
      status: 'WARNING',
      severity: 'warning',
      title: 'Mobile Viewport',
      message: 'Could not check',
      technical_details: { error: error instanceof Error ? error.message : 'Unknown error' },
    })
  }

  return results
}
