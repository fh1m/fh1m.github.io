/**
 * Tiny inline-markdown renderer for essay/dossier body paragraphs.
 * Supports `code`, **bold**, *italic* only — no block-level syntax (those are
 * handled by the caller via '## ' / '> ' prefixes). Escapes HTML first since
 * output is injected with {@html}; content is first-party authored, not user
 * input, so the only risk here is a stray '<' in a real number/path.
 */
export function inlineMd(src: string): string {
  const esc = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
