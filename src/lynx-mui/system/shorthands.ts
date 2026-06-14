/** sx spacing shorthands -> the CSS longhand props they expand into. */
export const spacingShorthands: Record<string, string[]> = {
  m: ['margin'],
  mt: ['marginTop'],
  mr: ['marginRight'],
  mb: ['marginBottom'],
  ml: ['marginLeft'],
  mx: ['marginLeft', 'marginRight'],
  my: ['marginTop', 'marginBottom'],
  p: ['padding'],
  pt: ['paddingTop'],
  pr: ['paddingRight'],
  pb: ['paddingBottom'],
  pl: ['paddingLeft'],
  px: ['paddingLeft', 'paddingRight'],
  py: ['paddingTop', 'paddingBottom'],
}

/** sx props whose numeric value is multiplied by the spacing unit. */
export const spacingValueProps = new Set<string>([
  'gap',
  'rowGap',
  'columnGap',
])

/** Simple key renames (sx name -> CSS name). */
export const aliasProps: Record<string, string> = {
  bgcolor: 'backgroundColor',
}

/** CSS props whose string value may reference a palette token (e.g. 'primary.main'). */
export const colorProps = new Set<string>([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
])
