export const copyImageToClipboard = async (canvas: HTMLCanvasElement): Promise<boolean> => {
  try {
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });

    // Create ClipboardItem
    const item = new ClipboardItem({ 'image/png': blob });

    // Copy to clipboard
    await navigator.clipboard.write([item]);
    return true;
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    return false;
  }
}; 