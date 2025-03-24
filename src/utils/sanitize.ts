import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  if (typeof window === 'undefined') {
    return input; // Return as-is on server-side
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
  });
};

export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return html; // Return as-is on server-side
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'], // Allow basic formatting
    ALLOWED_ATTR: ['href'], // Only allow href attributes for links
  });
}; 