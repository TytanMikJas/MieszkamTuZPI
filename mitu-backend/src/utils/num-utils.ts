export function getQuantizedFloat(value: string, precision = 8): number {
  return parseFloat(parseFloat(value).toFixed(precision));
}
