export default function isValidHexString(test: string) {
  return /^[0-9A-Fa-f]+$/.test(test);
}
