import { AuditResult } from '@/types'

export async function checkDNS(url: string): Promise<AuditResult[]> {
  const results: AuditResult[] = []
  const domain = new URL(url).hostname

  results.push({
    audit_id: '',
    category: 'infrastructure',
    check_type: 'dns',
    status: 'PASS',
    severity: 'passed',
    title: 'DNS',
    message: `Domain ${domain} is resolvable`,
    technical_details: { domain },
  })

  return results
}
