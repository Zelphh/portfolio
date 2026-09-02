/**
 * Fills `{name}` placeholders in a dictionary string.
 *
 * Dictionaries hold plain strings rather than functions so the whole
 * dictionary can be handed from a Server Component to a Client Component
 * without a serialization boundary problem.
 */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key]
    return value === undefined ? match : String(value)
  })
}
