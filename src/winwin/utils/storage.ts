const inMemoryStorage: Record<string, string> = {};

/**
 * Safely sets a persistent flag across localStorage, sessionStorage, document.cookie, and in-memory fallback.
 * Works seamlessly even in incognito mode or browsers where localStorage is restricted or disabled.
 */
export const setStoredFlag = (key: string, value: string = 'true'): void => {
  inMemoryStorage[key] = value;
  
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Ignore localStorage errors (e.g. private browsing restrictions)
  }

  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    // Ignore sessionStorage errors
  }

  try {
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; max-age=31536000; path=/; SameSite=Lax`;
  } catch (e) {
    // Ignore cookie errors
  }
};

/**
 * Checks if a flag is set to 'true' in any available storage mechanism or memory.
 */
export const getStoredFlag = (key: string): boolean => {
  if (inMemoryStorage[key] === 'true') {
    return true;
  }

  try {
    if (localStorage.getItem(key) === 'true') {
      return true;
    }
  } catch (e) {
    // Ignore
  }

  try {
    if (sessionStorage.getItem(key) === 'true') {
      return true;
    }
  } catch (e) {
    // Ignore
  }

  try {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cName, cVal] = cookie.trim().split('=');
      if (decodeURIComponent(cName) === key && decodeURIComponent(cVal) === 'true') {
        return true;
      }
    }
  } catch (e) {
    // Ignore
  }

  return false;
};
