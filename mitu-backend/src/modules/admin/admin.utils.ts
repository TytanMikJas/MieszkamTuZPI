/**
 * Generate a random password
 * @returns A random password - string
 */
export async function generatePassword(): Promise<string> {
  const { generate } = await import('generate-passphrase');
  return generate({
    length: 4,
    separator: '-',
    uppercase: false,
    numbers: true,
    titlecase: true,
  });
}
