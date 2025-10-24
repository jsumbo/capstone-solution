import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  return handleHealthCheck()
}

export async function HEAD(request: NextRequest) {
  const response = await handleHealthCheck()
  // For HEAD requests, return the same headers but no body
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers
  })
}

async function handleHealthCheck() {
  const startTime = Date.now()
  
  try {
    // Check basic service health
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'unknown'
      }
    }

    // Check Supabase connection
    try {
      const supabase = await getSupabaseServerClient()
      if (supabase) {
        // Simple query to test database connectivity
        const { error } = await supabase.from('schools').select('id').limit(1)
        health.checks.database = error ? 'unhealthy' : 'healthy'
      } else {
        health.checks.database = 'not_configured'
      }
    } catch (error) {
      console.error('Database health check failed:', error)
      health.checks.database = 'unhealthy'
    }



    // Determine overall status
    const isHealthy = health.checks.database !== 'unhealthy'
    health.status = isHealthy ? 'healthy' : 'degraded'

    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      ...health,
      responseTime: `${responseTime}ms`
    }, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: `${Date.now() - startTime}ms`
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}