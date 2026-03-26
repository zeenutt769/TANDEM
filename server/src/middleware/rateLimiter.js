import rateLimit from 'express-rate-limit';

/**
 * rateLimiter.js — Express rate limiting middleware
 * Prevents abuse of the HTTP API endpoints
 * Socket.io connections are handled separately
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // Max 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
  skip: (req) => req.path === '/health', // Skip health checks
});
