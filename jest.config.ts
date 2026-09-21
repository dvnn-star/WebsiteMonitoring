import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/lib/utils.ts',
    'src/lib/audit/uptime-monitor.ts',
    'src/lib/audit/**/*.ts',
    'src/components/auth/LoginForm.tsx',
    'src/components/auth/RegisterForm.tsx',
    'src/components/websites/AddWebsiteForm.tsx',
    'src/components/websites/WebsiteCard.tsx',
    'src/components/websites/AuditCharts.tsx',
    'src/components/websites/UptimeChart.tsx',
    'src/components/audit/AuditSummary.tsx',
    'src/components/audit/CheckItem.tsx',
    'src/components/dashboard/DashboardStats.tsx',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
}

export default createJestConfig(config)
