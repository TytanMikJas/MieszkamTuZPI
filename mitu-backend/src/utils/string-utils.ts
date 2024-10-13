import { POLISH_CHARS } from '../strings';

export function capitalizeFirstLetter(string: string) {
  return (
    string.charAt(0).toLocaleUpperCase() + string.slice(1).toLocaleLowerCase()
  );
}

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

function randomNchars(n: number) {
  return Math.random()
    .toString(36)
    .substring(2, n + 2);
}
