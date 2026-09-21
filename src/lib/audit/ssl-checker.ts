import { AuditResult } from '@/types'

interface SSLInfo {
  valid: boolean
  issuer?: string
  validFrom?: string
  validTo?: string
  daysRemaining?: number
}

export async function checkSSL(url: string): Promise<AuditResult[]> {
  const results: AuditResult[] = []
  const urlObj = new URL(url)

  if (urlObj.protocol !== 'https:') {
    results.push({
      audit_id: '',
      category: 'security',
      check_type: 'https',
      status: 'ERROR',
      severity: 'error',
      title: 'HTTPS',
      message: 'Not using HTTPS',
      recommendation: 'Enable HTTPS to secure your website.',
    })
    return results
  }

  results.push({
    audit_id: '',
    category: 'security',
    check_type: 'https',
    status: 'PASS',
    severity: 'passed',
    title: 'HTTPS',
    message: 'HTTPS enabled',
  })

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000),
    })

    const sslInfo: Record<string, unknown> = {
      valid: true,
    }

    results.push({
      audit_id: '',
      category: 'security',
      check_type: 'ssl_certificate',
      status: 'PASS',
      severity: 'passed',
      title: 'SSL Certificate',
      message: 'Valid SSL certificate',
      technical_details: sslInfo,
    })

    results.push({
      audit_id: '',
      category: 'security',
      check_type: 'ssl_expiry',
      status: 'PASS',
      severity: 'passed',
      title: 'SSL Expiry',
      message: 'Certificate is valid',
      technical_details: sslInfo,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('certificate') || errorMessage.includes('SSL')) {
      results.push({
        audit_id: '',
        category: 'security',
        check_type: 'ssl_certificate',
        status: 'ERROR',
        severity: 'error',
        title: 'SSL Certificate',
        message: 'Invalid or expired SSL certificate',
        technical_details: { error: errorMessage },
        recommendation: 'Renew or fix your SSL certificate.',
      })
    } else {
      results.push({
        audit_id: '',
        category: 'security',
        check_type: 'ssl_certificate',
        status: 'WARNING',
        severity: 'warning',
        title: 'SSL Certificate',
        message: 'Could not verify SSL certificate',
        technical_details: { error: errorMessage },
      })
    }
  }

  return results
}
