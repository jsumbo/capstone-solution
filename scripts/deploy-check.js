#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Validates environment and configuration before deployment
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 RE-Novate Deployment Check\n')

const checks = []

// Check Node.js version
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
checks.push({
  name: 'Node.js Version',
  status: majorVersion >= 18 ? 'PASS' : 'FAIL',
  message: majorVersion >= 18 ? `${nodeVersion} ✅` : `${nodeVersion} - Requires Node 18+ ❌`
})

// Check package.json
const packageJsonPath = path.join(process.cwd(), 'package.json')
const hasPackageJson = fs.existsSync(packageJsonPath)
checks.push({
  name: 'package.json',
  status: hasPackageJson ? 'PASS' : 'FAIL',
  message: hasPackageJson ? 'Found ✅' : 'Missing ❌'
})

// Check required scripts
if (hasPackageJson) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const requiredScripts = ['build', 'start']
  const hasAllScripts = requiredScripts.every(script => packageJson.scripts && packageJson.scripts[script])
  
  checks.push({
    name: 'Build Scripts',
    status: hasAllScripts ? 'PASS' : 'FAIL',
    message: hasAllScripts ? 'build, start scripts found ✅' : 'Missing required scripts ❌'
  })
}

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY'
]

const envStatus = requiredEnvVars.map(envVar => ({
  name: envVar,
  configured: !!process.env[envVar]
}))

const allEnvConfigured = envStatus.every(env => env.configured)
checks.push({
  name: 'Environment Variables',
  status: allEnvConfigured ? 'PASS' : 'WARN',
  message: allEnvConfigured ? 'All required env vars configured ✅' : 'Some env vars missing ⚠️'
})

// Check Next.js config
const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')
const hasNextConfig = fs.existsSync(nextConfigPath)
checks.push({
  name: 'Next.js Config',
  status: hasNextConfig ? 'PASS' : 'WARN',
  message: hasNextConfig ? 'next.config.mjs found ✅' : 'next.config.mjs missing ⚠️'
})

// Check migration files
const migrationsPath = path.join(process.cwd(), 'supabase', 'migrations')
const hasMigrations = fs.existsSync(migrationsPath)
let migrationCount = 0
if (hasMigrations) {
  migrationCount = fs.readdirSync(migrationsPath).filter(file => file.endsWith('.sql')).length
}

checks.push({
  name: 'Database Migrations',
  status: migrationCount > 0 ? 'PASS' : 'WARN',
  message: migrationCount > 0 ? `${migrationCount} migration files found ✅` : 'No migration files found ⚠️'
})

// Display results
console.log('📋 Deployment Readiness Check:\n')
checks.forEach(check => {
  const statusIcon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌'
  console.log(`${statusIcon} ${check.name}: ${check.message}`)
})

// Environment variables detail
if (!allEnvConfigured) {
  console.log('\n🔧 Environment Variables Status:')
  envStatus.forEach(env => {
    const status = env.configured ? '✅' : '❌'
    console.log(`  ${status} ${env.name}`)
  })
}

// Summary
const passCount = checks.filter(c => c.status === 'PASS').length
const warnCount = checks.filter(c => c.status === 'WARN').length
const failCount = checks.filter(c => c.status === 'FAIL').length

console.log(`\n📊 Summary: ${passCount} passed, ${warnCount} warnings, ${failCount} failed`)

if (failCount > 0) {
  console.log('\n❌ Deployment not recommended. Please fix failing checks.')
  process.exit(1)
} else if (warnCount > 0) {
  console.log('\n⚠️  Deployment possible but with warnings. Review before proceeding.')
  process.exit(0)
} else {
  console.log('\n🎉 All checks passed! Ready for deployment.')
  process.exit(0)
}