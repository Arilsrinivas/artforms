export const ARTFORMS_WHATSAPP_PHONE = "918147131315";
export const DEFAULT_QUOTE_MESSAGE = "Hello Artforms Civil and Interiors, I would like to get a free quote for my project.";

/**
 * Returns the direct whatsapp:// native app protocol URL
 */
export function getWhatsAppDirectUrl(message = DEFAULT_QUOTE_MESSAGE): string {
  const encoded = encodeURIComponent(message);
  return `whatsapp://send?phone=${ARTFORMS_WHATSAPP_PHONE}&text=${encoded}`;
}

/**
 * Directly opens the user's WhatsApp application and the chat with 81471 31315.
 * On mobile devices: launches the native WhatsApp app immediately.
 * On desktop: launches the native WhatsApp desktop app, with a fallback to WhatsApp Web.
 */
export function openWhatsAppChat(e?: React.MouseEvent, message = DEFAULT_QUOTE_MESSAGE): void {
  if (e) {
    e.preventDefault();
  }

  if (typeof window === "undefined") return;

  const encoded = encodeURIComponent(message);
  const nativeAppUrl = `whatsapp://send?phone=${ARTFORMS_WHATSAPP_PHONE}&text=${encoded}`;
  const webChatUrl = `https://web.whatsapp.com/send?phone=${ARTFORMS_WHATSAPP_PHONE}&text=${encoded}`;

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    // On iOS and Android, directly launch the native WhatsApp app
    window.location.href = nativeAppUrl;
  } else {
    // On desktop, try native app first; if not opened within 1s, open direct WhatsApp Web chat
    const startTime = Date.now();
    window.location.href = nativeAppUrl;

    setTimeout(() => {
      // If user remained on the browser tab, open WhatsApp Web directly
      if (Date.now() - startTime < 2000) {
        window.open(webChatUrl, "_blank");
      }
    }, 1000);
  }
}
