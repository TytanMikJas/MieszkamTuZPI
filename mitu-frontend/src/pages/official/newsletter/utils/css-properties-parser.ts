export function parseCssProperties(cssProperties: object) {
  return Object.entries(cssProperties)
    .map(([key, value]) => {
      return `${key}: ${value};`;
    })
    .join('\n');
}
