/**
 * Escapes HTML special characters to prevent XSS when injecting into innerHTML.
 */
function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Validates that a URL uses an allowed protocol (http, https).
 * Returns empty string for invalid/dangerous URLs (javascript:, data:, etc.).
 */
function sanitizeURL(url) {
    if (!url) return '';
    try {
        const parsed = new URL(url);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return url;
        }
        return '';
    } catch (e) {
        return '';
    }
}
