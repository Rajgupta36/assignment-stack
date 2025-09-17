const CONFIG_KEY_STORAGE_KEY = "app_config_key";

export function getConfigKey(): string | null {
  try {
    return localStorage.getItem(CONFIG_KEY_STORAGE_KEY);
  } catch (_) {
    return null;
  }
}

export function setConfigKey(value: string): void {
  try {
    localStorage.setItem(CONFIG_KEY_STORAGE_KEY, value);
  } catch (_) {
    // ignore
  }
}

export function hasConfigKey(): boolean {
  const key = getConfigKey();
  return typeof key === "string" && key.length >= 100 && key.length <= 1000;
}

export function clearConfigKey(): void {
  try {
    localStorage.removeItem(CONFIG_KEY_STORAGE_KEY);
  } catch (_) {
    // ignore
  }
}

