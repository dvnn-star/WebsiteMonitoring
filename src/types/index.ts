// Auth Types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

// Website Types
export interface Website {
  id: string
  user_id: string
  url: string
  domain: string
  name?: string
  is_active: boolean
  last_audit_at?: string
  last_audit_status?: 'healthy' | 'warning' | 'critical'
  created_at: string
  updated_at: string
}

// Audit Types
export type AuditStatus = 'queued' | 'running' | 'completed' | 'partial' | 'failed'
export type CheckStatus = 'PASS' | 'WARNING' | 'ERROR' | 'CRITICAL'
export type Category = 'technical' | 'seo' | 'crawlability' | 'performance' | 'security' | 'infrastructure'

export interface Audit {
  id: string
  website_id: string
  user_id: string
  status: AuditStatus
  started_at?: string
  completed_at?: string
  error_message?: string
  created_at: string
  pass_count: number
  warning_count: number
  error_count: number
}

export interface AuditResult {
  id: string
  audit_id: string
  category: Category
  check_type: string
  status: CheckStatus
  severity: 'critical' | 'error' | 'warning' | 'passed'
  title: string
  message?: string
  technical_details?: Record<string, unknown>
  recommendation?: string
  created_at: string
}

// API Types
export interface ApiResponse<T> {
  data?: T
  error?: string
}
