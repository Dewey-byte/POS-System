export const APP_SETTINGS_KEY = "pos_system_settings";

export interface AppSettings {
  lowStockThreshold: number;
  lowStockAlertsEnabled: boolean;
  storeName: string;
  storeLocation: string;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  lowStockThreshold: 5,
  lowStockAlertsEnabled: true,
  storeName: "Motorcycle POS System",
  storeLocation: "Main Branch",
};

const clampThreshold = (value: number) => {
  if (!Number.isFinite(value)) return DEFAULT_APP_SETTINGS.lowStockThreshold;
  return Math.min(100, Math.max(1, Math.round(value)));
};

export function readAppSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_APP_SETTINGS;

  try {
    const raw = localStorage.getItem(APP_SETTINGS_KEY);
    if (!raw) return DEFAULT_APP_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      lowStockThreshold: clampThreshold(
        Number(parsed.lowStockThreshold ?? DEFAULT_APP_SETTINGS.lowStockThreshold)
      ),
      lowStockAlertsEnabled:
        parsed.lowStockAlertsEnabled ?? DEFAULT_APP_SETTINGS.lowStockAlertsEnabled,
      storeName: String(parsed.storeName ?? DEFAULT_APP_SETTINGS.storeName),
      storeLocation: String(
        parsed.storeLocation ?? DEFAULT_APP_SETTINGS.storeLocation
      ),
    };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function writeAppSettings(next: AppSettings) {
  if (typeof window === "undefined") return;

  const normalizedStoreName = String(
    next.storeName || DEFAULT_APP_SETTINGS.storeName
  ).trim();
  const normalizedStoreLocation = String(
    next.storeLocation || DEFAULT_APP_SETTINGS.storeLocation
  ).trim();

  const normalized: AppSettings = {
    lowStockThreshold: clampThreshold(next.lowStockThreshold),
    lowStockAlertsEnabled: !!next.lowStockAlertsEnabled,
    storeName: normalizedStoreName || DEFAULT_APP_SETTINGS.storeName,
    storeLocation: normalizedStoreLocation || DEFAULT_APP_SETTINGS.storeLocation,
  };

  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("app-settings-updated"));
}
