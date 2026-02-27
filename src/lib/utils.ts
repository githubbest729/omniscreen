export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatCode(code: string): string {
  return code.replace(/(\d{3})(\d{3})/, '$1-$2');
}
