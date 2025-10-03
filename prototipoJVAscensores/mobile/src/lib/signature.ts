// signature.ts — guarda firma como dataURL

export function saveSignature(signature: string): string {
  // Simula guardar firma, retorna dataURL mock
  return `data:image/png;base64,${btoa('mock-signature')}`;
}