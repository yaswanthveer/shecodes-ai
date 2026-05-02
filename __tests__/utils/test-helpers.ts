// Test helper utilities for SheCodes.AI tests

import { NextRequest } from 'next/server';

/**
 * Create a mock Next.js request object for testing API routes
 */
export function createMockRequest(body: any, method: string = 'POST'): NextRequest {
  const request = new NextRequest('http://localhost:3000/api/test', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  return request;
}

/**
 * Wait for async operations (useful for testing)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random test user ID
 */
export function generateTestUserId(): string {
  return `test_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clean up test data (mock implementation)
 */
export async function cleanupTestData(userId: string): Promise<void> {
  // In a real implementation, this would clean up test data from the database
  // For now, it's a placeholder for future implementation
  console.log(`Cleaning up test data for user: ${userId}`);
}

/**
 * Extract JSON from AI response that might contain markdown or extra text
 */
export function extractJSON(text: string): any {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('No JSON found in response');
}

// Made with Bob
