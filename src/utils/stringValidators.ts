export function isValidProof(test: string) {
  const head = test?.substring(0, 2)
  const testHex = test?.substring(2)

  return head === '0x' && isValidHexString(testHex)
}

export function isValidHexString(test: string) {
  return /^[0-9A-Fa-f]+$/.test(test)
}

export function isValidV4UUID(test: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    test,
  )
}
