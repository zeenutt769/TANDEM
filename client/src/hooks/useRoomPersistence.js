/**
 * useRoomPersistence.js
 *
 * Two responsibilities:
 *  1. On mount  → GET /rooms/:roomId  — restore last-saved code + language
 *  2. On change → debounced PATCH /rooms/:roomId — save after 1.5 s of inactivity
 *
 * Why debounce?
 *  Yjs fires observe() on EVERY keystroke. Hitting the DB each time would create
 *  hundreds of write queries per minute per user. With a 1.5 s trailing debounce
 *  we collapse a burst of keystrokes into a single DB write.
 */
import { useEffect, useRef, useCallback } from 'react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const DEBOUNCE_MS = 1500; // 1.5 seconds of idle → save

/**
 * @param {string|null} roomId   - Active room ID (null = not joined yet)
 * @param {string}      code     - Current editor content (Yjs synced)
 * @param {string}      language - Current language selection
 * @param {Function}    onLoad   - Called with { code, language } once initial data arrives
 */
export function useRoomPersistence(roomId, code, language, onLoad) {
  const debounceTimer = useRef(null);
  const isFirstLoad = useRef(true);  // Skip the first observe() fire on mount

  // ── 1. Load persisted state when room is joined ───────────────────────────
  useEffect(() => {
    if (!roomId) return;

    isFirstLoad.current = true; // Reset on each new room

    fetch(`${SERVER_URL}/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code !== undefined && data.language !== undefined) {
          onLoad(data);
        }
      })
      .catch((err) => {
        console.warn('[Persistence] Could not load room state:', err.message);
      });
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Debounced save whenever code/language changes ─────────────────────
  const scheduleSave = useCallback(() => {
    if (!roomId) return;

    // Skip the very first value that arrives right after loading from DB
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${SERVER_URL}/rooms/${roomId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn('[Persistence] Save failed:', errData.error ?? res.statusText);
        }
      } catch (err) {
        console.warn('[Persistence] Network error during save:', err.message);
      }
    }, DEBOUNCE_MS);
  }, [roomId, code, language]);

  // Trigger save whenever code or language changes
  useEffect(() => {
    scheduleSave();
    return () => clearTimeout(debounceTimer.current);
  }, [scheduleSave]);
}
