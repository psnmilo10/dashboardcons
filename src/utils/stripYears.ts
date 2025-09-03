// src/utils/stripYears.ts
export function stripYears(input: string = ""): string {
  return input
    .replace(/\((?:19|20)\d{2}\)/g, "")                    // (2020)
    .replace(/(?:19|20)\d{2}\s*\/\s*(?:19|20)\d{2}/g, "")  // 2020/2021
    .replace(/(?:^|[\s\-])(?:19|20)\d{2}(?=[\s\-]|$)/g, " ") // años sueltos
    .replace(/\s{2,}/g, " ")
    .trim();
}
