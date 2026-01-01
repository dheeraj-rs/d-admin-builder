declare module 'istextorbinary' {
  export function getEncoding(
    buffer: Buffer | Uint8Array | null,
    opts?: { chunkLength?: number; chunkBegin?: number }
  ): 'utf8' | 'binary' | null;
}
