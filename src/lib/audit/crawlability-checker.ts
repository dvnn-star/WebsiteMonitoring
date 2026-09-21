import { AuditResult } from '@/types'

export async function checkRobotsAndSitemap(url: string): Promise<AuditResult[]> {
  const results: AuditResult[] = []
  const urlObj = new URL(url)
  const robotsUrl = `${urlObj.origin}/robots.txt`
  const sitemapUrl = `${urlObj.origin}/sitemap.xml`

  try {
    const robotsResponse = await fetch(robotsUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    })

    if (robotsResponse.ok) {
      const robotsContent = await robotsResponse.text()
      const disallowAll = /User-agent:\s*\*\s*Disallow:\s*\//i.test(robotsContent)
      
      if (disallowAll) {
        results.push({
          audit_id: '',
          category: 'crawlability',
          check_type: 'robots_txt',
          status: 'WARNING',
          severity: 'warning',
          title: 'Robots.txt',
          message: 'Blocks all crawlers',
          technical_details: { url: robotsUrl, content: robotsContent.substring(0, 500) },
          recommendation: 'Check if blocking all crawlers is intentional.',
        })
      } else {
        results.push({
          audit_id: '',
          category: 'crawlability',
          check_type: 'robots_txt',
          status: 'PASS',
          severity: 'passed',
          title: 'Robots.txt',
          message: 'Found',
          technical_details: { url: robotsUrl },
        })
      }
    } else {
      results.push({
        audit_id: '',
        category: 'crawlability',
        check_type: 'robots_txt',
        status: 'WARNING',
        severity: 'warning',
        title: 'Robots.txt',
        message: 'Not found',
        technical_details: { url: robotsUrl, status: robotsResponse.status },
        recommendation: 'Add a robots.txt file to control crawler access.',
      })
    }
  } catch (error) {
    results.push({
      audit_id: '',
      category: 'crawlability',
      check_type: 'robots_txt',
      status: 'WARNING',
      severity: 'warning',
      title: 'Robots.txt',
      message: 'Could not fetch',
      technical_details: { error: error instanceof Error ? error.message : 'Unknown error' },
    })
  }

  try {
    const sitemapResponse = await fetch(sitemapUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000),
    })

    if (sitemapResponse.ok) {
      results.push({
        audit_id: '',
        category: 'crawlability',
        check_type: 'sitemap',
        status: 'PASS',
        severity: 'passed',
        title: 'Sitemap',
        message: 'Found',
        technical_details: { url: sitemapUrl },
      })
    } else {
      results.push({
        audit_id: '',
        category: 'crawlability',
        check_type: 'sitemap',
        status: 'WARNING',
        severity: 'warning',
        title: 'Sitemap',
        message: 'Not found',
        technical_details: { url: sitemapUrl, status: sitemapResponse.status },
        recommendation: 'Add a sitemap.xml file to help search engines discover your pages.',
      })
    }
  } catch (error) {
    results.push({
      audit_id: '',
      category: 'crawlability',
      check_type: 'sitemap',
      status: 'WARNING',
      severity: 'warning',
      title: 'Sitemap',
      message: 'Could not fetch',
      technical_details: { error: error instanceof Error ? error.message : 'Unknown error' },
    })
  }

  return results
}
