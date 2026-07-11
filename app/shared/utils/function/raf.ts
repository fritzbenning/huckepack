export function raf(callback: () => void): () => void {
  const frameId = requestAnimationFrame(callback);

  return () => {
    cancelAnimationFrame(frameId);
  };
}
