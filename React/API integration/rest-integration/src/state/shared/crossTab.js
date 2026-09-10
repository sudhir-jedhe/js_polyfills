/**
 * Cross-tab synchronisation.
 *
 * The scenario: a user has your app open in three tabs and signs out in one.
 * The other two keep making authenticated requests with a dead token until
 * something 401s. Worse: they may still be showing the previous user's data
 * after someone else signs in.
 *
 * Two mechanisms, and they are not interchangeable:
 *
 *   BroadcastChannel   same-origin pub/sub between tabs. Clean API, but
 *                      nothing persists — a tab opened later hears nothing.
 *
 *   storage event      fires in OTHER tabs when localStorage changes. Older
 *                      and clunkier, but the value persists, so a new tab
 *                      can read the current state on boot.
 *
 * Use BroadcastChannel for EVENTS (sign-out happened) and localStorage for
 * the STATE a fresh tab needs to read.
 *
 * Note: never put the access token itself in localStorage. Broadcast the
 * FACT of a sign-out; each tab then refreshes from its own httpOnly cookie.
 */

const CHANNEL = 'app-auth';
const STORAGE_KEY = 'app:auth-event';

const hasBroadcast = typeof BroadcastChannel !== 'undefined';
const channel = hasBroadcast ? new BroadcastChannel(CHANNEL) : null;

/**
 * Publish an event to every other tab.
 * @param {{type: 'signed-out'|'signed-in'|'session-expired', at?: number}} event
 */
export function broadcast(event) {
  const payload = { ...event, at: event.at ?? Date.now(), tabId: TAB_ID };

  channel?.postMessage(payload);

  // localStorage fallback + persistence. Writing a changing value is what
  // makes the storage event fire; the key is then read by tabs opened later.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private mode / quota — the BroadcastChannel path still works.
  }
}

/** A per-tab id, so a tab can ignore the event it published itself. */
const TAB_ID = Math.random().toString(36).slice(2);

/**
 * Subscribe to events from OTHER tabs.
 * @param {(event: object) => void} handler
 * @returns {() => void} unsubscribe
 */
export function subscribe(handler) {
  const onMessage = (event) => {
    const data = event.data ?? safeParse(event.newValue);
    if (!data || data.tabId === TAB_ID) return; // ignore our own
    handler(data);
  };

  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY) return;
    onMessage(event);
  };

  channel?.addEventListener('message', onMessage);
  window.addEventListener('storage', onStorage);

  return () => {
    channel?.removeEventListener('message', onMessage);
    window.removeEventListener('storage', onStorage);
  };
}

function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

/**
 * Wire cross-tab auth into any store implementation.
 *
 * @param {{ signOut: () => void, refresh: () => Promise<any> }} handlers
 * @param {import('@tanstack/react-query').QueryClient} [queryClient]
 */
export function installCrossTabAuth(handlers, queryClient) {
  return subscribe((event) => {
    if (event.type === 'signed-out' || event.type === 'session-expired') {
      handlers.signOut();
      // Critical: drop the cache so the next user never sees the last one's data.
      queryClient?.clear();
    }

    if (event.type === 'signed-in') {
      // Another tab signed in; pick up the new session from the cookie.
      handlers.refresh?.().catch(() => {});
      queryClient?.invalidateQueries();
    }
  });
}

/** Leader election, so only ONE tab runs a polling loop or a refresh timer. */
export function useLeaderTab() {
  const LEADER_KEY = 'app:leader';
  const HEARTBEAT_MS = 3000;

  const claim = () => {
    const current = safeParse(localStorage.getItem(LEADER_KEY));
    const isStale = !current || Date.now() - current.at > HEARTBEAT_MS * 2;

    if (isStale || current.tabId === TAB_ID) {
      localStorage.setItem(LEADER_KEY, JSON.stringify({ tabId: TAB_ID, at: Date.now() }));
      return true;
    }

    return false;
  };

  return { claim, isLeader: claim, tabId: TAB_ID };
}
