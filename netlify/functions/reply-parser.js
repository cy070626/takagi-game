// Repair only single JSON-string escapes that are recognizable TeX commands.
// Valid doubled backslashes and ordinary JSON escapes remain unchanged.
const texCommand = /^(?:frac|dfrac|tfrac|sqrt|text|textrm|textbf|theta|times|tau|tan|beta|begin|binom|bar|boxed|rho|right|mathrm|mathbb|mathbf|nabla|nu|neq|varepsilon|vec|left|end|sum|int|infty|alpha|gamma|delta|lambda|pi|sin|cos|log|ln|cdot|leq|geq|overline|underline|qquad|quad|forall|to|rightarrow|Rightarrow|not|varphi|boldsymbol|underbrace|underbracket|uparrow)(?![A-Za-z])/;
export function repairTexEscapes(raw) {
  let result = '', quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '"') { quoted = !quoted; result += ch; continue; }
    if (quoted && ch === '\\') {
      let end = i;
      while (raw[end] === '\\') end++;
      const count = end - i;
      result += '\\'.repeat(count);
      if (count % 2) {
        const next = raw[end];
        if (texCommand.test(raw.slice(end)) || (next && (!/["\\/bfnrtu]/.test(next) || (next === 'u' && !/^[0-9a-fA-F]{4}/.test(raw.slice(end + 1)))))) result += '\\';
        else if (next === '"') { result += next; end++; }
      }
      i = end - 1;
    } else result += ch;
  }
  return result;
}
export function decodeModelReply(raw) {
  const unfenced = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try { return JSON.parse(repairTexEscapes(unfenced)); }
  catch {
    // A truncated page must not leak the JSON wrapper into the chat bubble.
    const repaired = repairTexEscapes(unfenced);
    const textField = repaired.match(/"text"\s*:\s*("(?:\\.|[^"\\])*")/);
    if (textField) {
      try { return { text: JSON.parse(textField[1]) }; } catch {}
    }
    return { text: unfenced };
  }
}
