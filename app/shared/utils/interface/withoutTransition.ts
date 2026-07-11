/**
 * Utility function to perform actions without CSS transitions
 * This prevents flickering and unwanted animations during theme changes or other DOM updates
 */
export const withoutTransition = (action: () => void) => {
  // Create style element to disable transitions
  const style = document.createElement("style");
  const css = document.createTextNode(`* {
     -webkit-transition: none !important;
     -moz-transition: none !important;
     -o-transition: none !important;
     -ms-transition: none !important;
     transition: none !important;
  }`);
  style.appendChild(css);

  // Functions to insert and remove style element
  const disable = () => document.head.appendChild(style);
  const enable = () => {
    try {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    } catch (_error) {
      // Style element may have already been removed
    }
  };

  // Best method, getComputedStyle forces browser to repaint
  if (typeof window.getComputedStyle !== "undefined") {
    disable();
    action();
    // Force browser repaint by accessing computed style
    void window.getComputedStyle(style).opacity;
    enable();
    return;
  }

  // Better method, requestAnimationFrame processes function before next repaint
  if (typeof window.requestAnimationFrame !== "undefined") {
    disable();
    action();
    window.requestAnimationFrame(enable);
    return;
  }

  // Fallback for older browsers - with proper cleanup
  disable();
  const timeoutAction = setTimeout(() => {
    action();
    const timeoutEnable = setTimeout(enable, 120);
    // Store timeout reference to allow cleanup if needed
    (timeoutAction as any).__enableTimeout = timeoutEnable;
  }, 120);

  // Return cleanup function for the fallback case
  return () => {
    clearTimeout(timeoutAction);
    if ((timeoutAction as any).__enableTimeout) {
      clearTimeout((timeoutAction as any).__enableTimeout);
    }
    enable(); // Ensure styles are cleaned up
  };
};
