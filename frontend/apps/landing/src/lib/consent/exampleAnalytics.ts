let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  initialized = true;
  // Placeholder: here you'd load GA/YC Metrica etc.
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[analytics] initialized");
  }
}


