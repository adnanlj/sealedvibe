import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RateLimit from '@/models/RateLimit';

export function getClientIp(req: Request): string {
  const headers = req.headers;

  // 1. Prioritize trusted hosting edge proxy headers
  const vercelIp = headers.get('x-vercel-forwarded-for');
  if (vercelIp) return vercelIp.split(',')[0].trim();

  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // 2. Standard X-Forwarded-For (take the client-originating leftmost IP)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const client = forwarded.split(',')[0].trim();
    if (client) return client;
  }

  return '127.0.0.1';
}

export async function clearRateLimit(keyPrefix: string, identifier: string): Promise<void> {
  try {
    await connectDB();
    const fullKey = `${keyPrefix}:${identifier.toLowerCase().trim()}`;
    await RateLimit.deleteOne({ key: fullKey });
  } catch (err) {
    console.error('Clear RateLimit Error:', err);
  }
}

export interface RateLimitOptions {
  keyPrefix: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { keyPrefix, identifier, limit, windowSeconds } = options;
  const fullKey = `${keyPrefix}:${identifier.toLowerCase().trim()}`;
  const now = new Date();
  const expireAt = new Date(Date.now() + windowSeconds * 1000);

  try {
    await connectDB();

    // Atomic upsert with conditional reset if expired
    const existing = await RateLimit.findOne({ key: fullKey });

    if (!existing || existing.expireAt <= now) {
      // Create or reset window
      await RateLimit.findOneAndUpdate(
        { key: fullKey },
        { $set: { points: 1, expireAt } },
        { upsert: true, returnDocument: 'after' }
      );
      return {
        allowed: true,
        limit,
        remaining: limit - 1,
        retryAfterSeconds: 0,
      };
    }

    if (existing.points >= limit) {
      const retryAfter = Math.max(1, Math.ceil((existing.expireAt.getTime() - now.getTime()) / 1000));
      return {
        allowed: false,
        limit,
        remaining: 0,
        retryAfterSeconds: retryAfter,
      };
    }

    // Increment points atomically
    const updated = await RateLimit.findOneAndUpdate(
      { key: fullKey },
      { $inc: { points: 1 } },
      { returnDocument: 'after' }
    );

    const currentPoints = updated ? updated.points : existing.points + 1;
    const remaining = Math.max(0, limit - currentPoints);

    return {
      allowed: true,
      limit,
      remaining,
      retryAfterSeconds: 0,
    };
  } catch (err) {
    console.error('RateLimit DB Error:', err);
    // Fail-open gracefully if DB is temporarily unreachable to avoid blocking legitimate traffic
    return {
      allowed: true,
      limit,
      remaining: 1,
      retryAfterSeconds: 0,
    };
  }
}

export function createRateLimitResponse(retryAfterSeconds: number, customMessage?: string): NextResponse {
  const message = customMessage || `Too many requests. Please wait ${retryAfterSeconds} second${retryAfterSeconds > 1 ? 's' : ''} before trying again.`;
  return NextResponse.json(
    {
      error: message,
      rateLimited: true,
      retryAfter: retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + retryAfterSeconds),
      },
    }
  );
}
