import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Redis from 'ioredis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client with the provided URL
const redis = new Redis("rediss://default:AZ7vAAIjcDEyZGQzNTM4YWEyYmQ0MmRhYWZiM2VlZjc0NmYyZThkNHAxMA@deciding-camel-40687.upstash.io:6379");

// Create rate limiter instance
const ratelimit = new Ratelimit({
  redis: redis as any, // Type assertion needed as Upstash expects their own Redis client
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function middleware(request: NextRequest) {
  // Apply rate limiting
  try {
    const ip = request.ip ?? '127.0.0.1';
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    );

    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': reset.toString(),
        },
      });
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue without rate limiting if there's an error
  }

  // Get the response
  const response = NextResponse.next();

  // Security Headers
  const headers = response.headers;

  // HTTPS only
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // XSS Protection
  headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim()
  );

  return response;
} 