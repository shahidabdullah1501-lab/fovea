export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const item = localStorage.getItem(`fovea_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading key ${key} from storage:`, e);
    return fallback;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<boolean> {
  try {
    localStorage.setItem(`fovea_${key}`, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error saving key ${key} to storage:`, e);
    return false;
  }
}
