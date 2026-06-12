// ─── HTML escaping for user-controlled values in email/HTML output ───────────
//
// User-supplied strings (form fields, UTM params, referrers, email addresses)
// are interpolated into HTML email bodies and subjects sent to the internal
// team. Without escaping, a crafted value such as
//   <img src=x onerror="...">  or  </td><script>...</script>
// renders/executes when a team member opens the notification. Escape the five
// HTML-significant characters so the value is always treated as text.

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function htmlEscape(s: string): string {
  if (typeof s !== "string") return "";
  return s.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);
}
