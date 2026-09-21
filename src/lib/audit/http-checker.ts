import { AuditResult } from '@/types'

export async function checkHTTPStatus(url: string): Promise<AuditResult[]> {
  const results: AuditResult[] = []
  const startTime = Date.now()

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    })

    const responseTime = Date.now() - startTime
    const data: Record<string, unknown> = {
      status: response.status,
      finalUrl: response.url,
      responseTime,
      redirected: response.redirected,
    }

    if (response.status >= 200 && response.status < 300) {
      results.push({
        audit_id: '',
        category: 'technical',
        check_type: 'http_status',
        status: 'PASS',
        severity: 'passed',
        title: 'HTTP Status',
        message: `${response.status} OK`,
        technical_details: data,
      })
    } else if (response.status >= 300 && response.status < 400) {
      results.push({
        audit_id: '',
        category: 'technical',
        check_type: 'http_status',
        status: 'WARNING',
        severity: 'warning',
        title: 'HTTP Status',
        message: `Redirect: ${response.status}`,
        technical_details: data,
        recommendation: 'Check if the redirect is intentional.',
      })
    } else {
      results.push({
        audit_id: '',
        category: 'technical',
        check_type: 'http_status',
        status: 'ERROR',
        severity: 'error',
        title: 'HTTP Status',
        message: `Error: ${response.status}`,
        technical_details: data,
        recommendation: 'Fix the HTTP status code. The page should return 200 OK.',
      })
    }

    if (responseTime < 1000) {
      results.push({
        audit_id: '',
        category: 'performance',
        check_type: 'response_time',
        status: 'PASS',
        severity: 'passed',
        title: 'Response Time',
        message: `${responseTime}ms`,
        technical_details: { responseTime },
      })
    } else if (responseTime < 3000) {
      results.push({
        audit_id: '',
        category: 'performance',
        check_type: 'response_time',
        status: 'WARNING',
        severity: 'warning',
        title: 'Response Time',
        message: `${responseTime}ms - Slow`,
        technical_details: { responseTime },
        recommendation: 'Consider optimizing server response time. Target: under 1000ms.',
      })
    } else {
      results.push({
        audit_id: '',
        category: 'performance',
        check_type: 'response_time',
        status: 'ERROR',
        severity: 'error',
        title: 'Response Time',
        message: `${responseTime}ms - Very Slow`,
        technical_details: { responseTime },
        recommendation: 'Server response is too slow. Investigate server performance.',
      })
    }

    if (response.redirected) {
      results.push({
        audit_id: '',
        category: 'technical',
        check_type: 'redirect',
        status: 'WARNING',
        severity: 'warning',
        title: 'Redirect',
        message: `Redirects to ${response.url}`,
        technical_details: { from: url, to: response.url },
        recommendation: 'Update the URL to the final destination to avoid redirects.',
      })
    } else {
      results.push({
        audit_id: '',
        category: 'technical',
        check_type: 'redirect',
        status: 'PASS',
        severity: 'passed',
        title: 'Redirect',
        message: 'No redirect',
        technical_details: { redirected: false },
      })
    }
  } catch (error) {
    results.push({
      audit_id: '',
      category: 'technical',
      check_type: 'http_status',
      status: 'ERROR',
      severity: 'error',
      title: 'HTTP Status',
      message: 'Failed to connect',
      technical_details: { error: error instanceof Error ? error.message : 'Unknown error' },
      recommendation: 'Check if the website is accessible and the URL is correct.',
    })
  }

  return results
}
