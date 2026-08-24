# Problem: Refactor an Oversized "Does Everything" Component

## Task

The `UserDashboard` component below fetches three unrelated pieces of data, manages several pieces of local UI state, and renders a large JSX tree mixing all of it together. Refactor it into a thin container plus several focused, single-responsibility presentational components (and custom hooks for the data-fetching).

## Starting point (the anti-pattern)

```jsx
function UserDashboard({ userId }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [postFilter, setPostFilter] = useState("all");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchProfile(userId).then((p) => {
      setProfile(p);
      setBioDraft(p.bio);
    });
  }, [userId]);

  useEffect(() => {
    fetchPosts(userId).then(setPosts);
  }, [userId]);

  useEffect(() => {
    fetchNotifications(userId).then(setNotifications);
  }, [userId]);

  const visiblePosts =
    postFilter === "all" ? posts : posts.filter((p) => p.type === postFilter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function saveBio() {
    updateBio(userId, bioDraft).then(() => {
      setProfile((p) => ({ ...p, bio: bioDraft }));
      setIsEditingBio(false);
    });
  }

  if (!profile) return <p>Loading…</p>;

  return (
    <div className="dashboard">
      <div className="profile-header">
        <img src={profile.avatarUrl} alt={profile.name} />
        <h1>{profile.name}</h1>
        {isEditingBio ? (
          <div>
            <textarea value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} />
            <button onClick={saveBio}>Save</button>
            <button onClick={() => setIsEditingBio(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>{profile.bio}</p>
            <button onClick={() => setIsEditingBio(true)}>Edit bio</button>
          </div>
        )}
      </div>

      <div className="notifications">
        <button onClick={() => setNotificationsOpen((o) => !o)}>
          Notifications ({unreadCount})
        </button>
        {notificationsOpen && (
          <ul>
            {notifications.map((n) => (
              <li key={n.id} className={n.read ? "read" : "unread"}>{n.text}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="posts">
        <select value={postFilter} onChange={(e) => setPostFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="article">Articles</option>
          <option value="photo">Photos</option>
        </select>
        <ul>
          {visiblePosts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## Refactored solution

```jsx
// --- Data hooks: one per concern, each independently reusable/testable ---

function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetchProfile(userId).then(setProfile);
  }, [userId]);
  return profile;
}

function usePosts(userId) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts(userId).then(setPosts);
  }, [userId]);
  return posts;
}

function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    fetchNotifications(userId).then(setNotifications);
  }, [userId]);
  return notifications;
}

// --- Presentational components: one clear responsibility each ---

function ProfileHeader({ profile, onSaveBio }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bioDraft, setBioDraft] = useState(profile.bio);

  function handleSave() {
    onSaveBio(bioDraft);
    setIsEditing(false);
  }

  return (
    <div className="profile-header">
      <img src={profile.avatarUrl} alt={profile.name} />
      <h1>{profile.name}</h1>
      {isEditing ? (
        <div>
          <textarea value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>{profile.bio}</p>
          <button onClick={() => setIsEditing(true)}>Edit bio</button>
        </div>
      )}
    </div>
  );
}

function NotificationsPanel({ notifications }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications">
      <button onClick={() => setOpen((o) => !o)}>
        Notifications ({unreadCount})
      </button>
      {open && (
        <ul>
          {notifications.map((n) => (
            <li key={n.id} className={n.read ? "read" : "unread"}>{n.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PostsList({ posts }) {
  const [filter, setFilter] = useState("all");
  const visiblePosts = filter === "all" ? posts : posts.filter((p) => p.type === filter);

  return (
    <div className="posts">
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="article">Articles</option>
        <option value="photo">Photos</option>
      </select>
      <ul>
        {visiblePosts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

// --- Container: thin composition, no rendering logic of its own ---

function UserDashboard({ userId }) {
  const profile = useProfile(userId);
  const posts = usePosts(userId);
  const notifications = useNotifications(userId);

  function handleSaveBio(newBio) {
    updateBio(userId, newBio);
  }

  if (!profile) return <p>Loading…</p>;

  return (
    <div className="dashboard">
      <ProfileHeader profile={profile} onSaveBio={handleSaveBio} />
      <NotificationsPanel notifications={notifications} />
      <PostsList posts={posts} />
    </div>
  );
}
```

## Why this is better

- Each custom hook (`useProfile`, `usePosts`, `useNotifications`) owns exactly one fetch and its own piece of state — any of them can be reused on a different page or tested independently of the dashboard's JSX.
- Each presentational component (`ProfileHeader`, `NotificationsPanel`, `PostsList`) now owns its *own* local UI state (bio-editing mode, panel-open state, post filter) instead of `UserDashboard` holding seven unrelated `useState` calls — a change to how notifications toggle open no longer risks touching bio-editing logic, because they're no longer in the same function.
- `UserDashboard` itself is now a thin composition layer: it fetches the three pieces of top-level data and renders three components, nothing more. Reading it tells you the page's overall shape at a glance, without wading through implementation details of any one section.
- A PR that changes only the notifications panel now touches only `NotificationsPanel` (and maybe `useNotifications`), producing a small, focused diff instead of a risky edit inside a 150-line function.

## Things to watch out for

- Don't over-fragment — splitting every three-line JSX block into its own file adds navigation overhead without a real benefit. Extract along genuine responsibility boundaries (a section of the UI with its own state and purpose), not arbitrarily.
- Watch prop-drilling creeping back in as you split: if `ProfileHeader`, `NotificationsPanel`, and `PostsList` all needed the same five props from a common source, that would be a sign to consider context instead of passing everything down through `UserDashboard`.
