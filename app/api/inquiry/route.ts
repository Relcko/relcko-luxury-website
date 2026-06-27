/**
 * Inquiry API Route — Lead Capture System
 *
 * Server-side handler for form submissions with rate limiting.
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { validateForm, generalInquirySchema } from '@/lib/forms/schema';

// Simple in-memory rate limiter (use Redis for production)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();

    // Validate against schema
    const result = validateForm(generalInquirySchema, body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.errors },
        { status: 400 }
      );
    }

    // Process the inquiry (in production, send to email/CRM)
    console.log('Inquiry received:', result.data);

    // Return success
    return NextResponse.json(
      { success: true, message: 'Thank you for your inquiry. We will contact you shortly.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
