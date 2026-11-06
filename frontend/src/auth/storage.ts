export type BrowserStore = Pick<Storage,'getItem'|'setItem'|'removeItem'>;
/** A blocked browser store stays unavailable; it must not look like an empty registry. */
export function browserStorage(kind: 'sessionStorage'|'localStorage'): BrowserStore | undefined {
 if(typeof window === 'undefined') return undefined;
 try { return window[kind]; } catch {
  const unavailable = (): never => { throw new Error('Browser storage unavailable'); };
  return { getItem: unavailable, setItem: unavailable, removeItem: unavailable };
 }
}
/** Deletion is essential for sign-out. Some stores reject one mutator but allow the other. */
export function setStoredValue(storage: BrowserStore, key: string, value: string | null): boolean {
 if (value !== null) {
  try { storage.setItem(key,value); return true; } catch { return false; }
 }
 try { storage.removeItem(key); return true; } catch {
  try { storage.setItem(key,'null'); return true; } catch { return false; }
 }
}
