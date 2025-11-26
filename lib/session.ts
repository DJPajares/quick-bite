/**
 * Session management utilities for cart functionality
 */

const SESSION_ID_KEY = 'quick-bite-session-id';

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return 'b18f2e0c-1235-4126-b77a-8465361cf3d4'; // Replace with actual UUID generation logic
}

/**
 * Get or create a session ID from localStorage
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Clear the session ID
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(SESSION_ID_KEY);
}
