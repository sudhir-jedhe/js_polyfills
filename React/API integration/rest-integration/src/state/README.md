# State management alongside a REST layer

Three implementations of the **same three slices**, so you can compare the
code rather than the marketing.

```
shared/contracts.js    the contract all three satisfy (read this first)
shared/crossTab.js     sign out here -> sign out everywhere
shared/offlineQueue.js queue writes offline, replay on reconnect
zustand/stores.js      implementation 1
rtk/slices.js + store.js  implementation 2 (incl. RTK Query)
jotai/atoms.js         implementation 3
AppShell.jsx           the wiring: bootstrap, logout, offline, toasts
```

---

## The rule that decides everything

**Server state is not client state.** Put the *inputs* in your store; leave
the *results* in the query cache.

```
filters  (page, search, sort)  ──►  STORE      you own these
   │
   └── derives the query key ──►  QUERY CACHE  the server owns this
```

```js
// RIGHT — filters in the store, results in the cache
const filters = useQueryFilters();
useQuery({ queryKey: ['users', filters], queryFn: () => users.list(filters) });

// WRONG — two sources of truth that drift
const { data } = useQuery(...);
useEffect(() => dispatch(setUsers(data)), [data]);   // ✋
```

The second version has no idea when its copy is stale, and every mutation
has to remember to update both places.

---

## Side by side

The same "set the search term" operation:

**Zustand** — a store is a hook
```js
export const useFilterStore = create((set) => ({
  search: '',
  setSearch: (search) => set({ search, page: 1 }),
}));

const setSearch = useFilterStore((s) => s.setSearch);
```

**Redux Toolkit** — slice, action, dispatch
```js
const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: { searchChanged: (state, action) => { state.search = action.payload; state.page = 1; } },
});

const dispatch = useDispatch();
dispatch(searchChanged('ada'));
```

**Jotai** — atoms compose
```js
export const setSearchAtom = atom(null, (get, set, search) =>
  set(filtersAtom, { ...get(filtersAtom), search, page: 1 })
);

const setSearch = useSetAtom(setSearchAtom);
```

| | Zustand | Redux Toolkit | Jotai |
|---|---|---|---|
| Size (gz) | ~1.2 kB | ~13 kB + React-Redux | ~3 kB |
| Provider needed | No | Yes | Optional |
| Boilerplate | Lowest | Highest | Low |
| Devtools | Basic | **Excellent** (time travel) | Basic |
| Re-render control | Manual selectors | Manual selectors | **Automatic** |
| Read outside React | `getState()` | `store.getState()` | `getDefaultStore().get()` |
| Async built in | No | Thunks / RTK Query | Async atoms + Suspense |
| Best for | Most apps | Big teams, audit trails | Fine-grained/derived state |

---

## The footgun in each

**Zustand — selecting too much.**
```js
const { page } = useFilterStore();          // subscribes to EVERYTHING
const page = useFilterStore((s) => s.page); // subscribes to one primitive
```
Selecting an object needs `useShallow`, or the new literal is a fresh
reference every render and you loop forever.

**Redux — unmemoised derived selectors.**
```js
const filters = useSelector((s) => ({ page: s.filters.page }));  // new object every dispatch
const filters = useSelector(selectQueryFilters);                 // createSelector, memoised
```

**Jotai — `selectAtom` without an equality function.**
```js
selectAtom(filtersAtom, toQueryKeyInput)                    // new object each read
selectAtom(filtersAtom, toQueryKeyInput, shallowEqual)      // correct
```

Same bug in three dialects: **a derived object needs a comparator.**

---

## Pick one

| If | Use |
|---|---|
| Starting fresh | TanStack Query + **Zustand** |
| Already Redux | **RTK Query** — do not add TanStack too |
| Heavy derived state | TanStack Query + **Jotai** |
| Just auth + a couple of flags | No library — `useSyncExternalStore` (`api/auth.js`) |

**Never run TanStack Query and RTK Query together.** They solve the identical
problem and you will fragment the cache.

---

## The app-shell concerns

These are nobody's feature and everybody's bug. `AppShell.jsx` handles all five.

**1. Bootstrap.** Auth status is a three-state enum, not a boolean:
`'unknown' | 'authenticated' | 'anonymous'`. On first paint you do not yet
know if the refresh cookie is valid — guessing `false` flashes the login
screen at a signed-in user.

**2. Logout clears the query cache.**
```js
signOut();
queryClient.clear();   // ← the step people forget
```
Skip it and the next user who signs in on that machine sees the previous
user's cached data before the refetch lands.

**3. Cross-tab.** `BroadcastChannel` for events, the `storage` event as the
persistent fallback. Broadcast the *fact* of a sign-out — never the token.

**4. Offline writes.** Reads degrade fine (show the cache); writes vanish.
The queue needs four properties, and each is a bug if missing:
idempotency keys (a replay may duplicate a write the server already took),
sequential order (an edit must follow its create), persistence (survive the
tab), and giving up on 4xx (it will never succeed).

**5. Toasts from the mutation cache.** Subscribe once to
`queryClient.getMutationCache()` rather than writing `onError` in forty
components.

---

## Interview answers

- *Should API data go in Redux?* No. It is a cache of something you do not
  own; a synchronous store makes you hand-roll invalidation and staleness.
  Use a server-state library and keep the store for the inputs.
- *Zustand vs Redux?* Zustand for less ceremony and a smaller bundle; Redux
  for time-travel devtools, a serialisable action log, and RTK Query.
- *Why does my component re-render on every action?* An unmemoised selector
  returning a new object. `useShallow` / `createSelector` / `selectAtom` with
  an equality function.
- *Ten tabs, user signs out in one?* Broadcast the event; each tab clears
  its own store and query cache.
- *How do you handle offline writes?* Persisted queue + idempotency keys +
  sequential replay on `online`, dropping permanent 4xx failures.
