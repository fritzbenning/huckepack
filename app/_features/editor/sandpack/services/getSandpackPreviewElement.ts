export function getSandpackPreviewElement(): HTMLIFrameElement | null {
  return document.querySelector<HTMLIFrameElement>(".sp-preview-iframe");
}
