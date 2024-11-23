export const POLISH_CHARS = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

/**
 * Capitalize first letter of string
 * @param string - string to capitalize
 * @returns string with first letter capitalized
 */
export function capitalizeFirstLetter(string: string) {
  return (
    string.charAt(0).toLocaleUpperCase() + string.slice(1).toLocaleLowerCase()
  );
}

/**
 * Slugify string
 * @param title - string to slugify
 * @returns slugified string
 */
export function slugify(title: string): string {
  return (
    title
      .split('')
      .map((char) => POLISH_CHARS[char] || char)
      .join('')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') +
    '-' +
    randomNchars(9)
  );
}

/**
 * Generate random string of n characters
 * @param n - number of characters
 * @returns random string of n characters
 */
function randomNchars(n: number) {
  return Math.random()
    .toString(36)
    .substring(2, n + 2);
}
