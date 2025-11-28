/**
 * Session management utilities for cart functionality
 */

const SESSION_ID_KEY = 'quick-bite-session-id';

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return '8b53afe7-f7cb-4b25-81ca-828124ed6040'; // Replace with actual UUID generation logic
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
