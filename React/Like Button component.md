*** copy Like Button component.md ***

An interactive, accessible React Like Button component with toggle animation, live counter, and optimistic updates.

---

### Implementation

```tsx
import React, { useState } from 'react';

interface LikeButtonProps {
  initialLikes?: number;
  initialLiked?: boolean;
  onLikeChange?: (isLiked: boolean, totalLikes: number) => Promise<void> | void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  initialLikes = 100,
  initialLiked = false,
  onLikeChange,
}) => {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likesCount, setLikesCount] = useState<number>(initialLikes);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleToggleLike = async () => {
    if (isLoading) return;

    // Optimistic UI state
    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : likesCount - 1;

    setLiked(nextLiked);
    setLikesCount(nextCount);

    if (onLikeChange) {
      try {
        setIsLoading(true);
        await onLikeChange(nextLiked, nextCount);
      } catch (error) {
        // Rollback on failure
        setLiked(liked);
        setLikesCount(likesCount);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-pressed={liked}
      aria-label={liked ? `Unlike, ${likesCount} likes` : `Like, ${likesCount} likes`}
      disabled={isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        fontSize: '15px',
        fontWeight: 600,
        fontFamily: 'sans-serif',
        borderRadius: '9999px',
        border: `1.5px solid ${liked ? '#ef4444' : '#cbd5e1'}`,
        backgroundColor: liked ? '#fee2e2' : isHovered ? '#f1f5f9' : '#ffffff',
        color: liked ? '#ef4444' : '#475569',
        cursor: isLoading ? 'wait' : 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        userSelect: 'none',
        transform: liked ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {/* Heart Icon SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={liked ? '#ef4444' : 'none'}
        stroke={liked ? '#ef4444' : '#64748b'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: 'transform 0.15s ease, fill 0.2s ease',
          transform: liked ? 'scale(1.2)' : 'scale(1)',
        }}
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {/* Label and Count */}
      <span>{liked ? 'Liked' : 'Like'}</span>
      <span
        style={{
          borderLeft: '1px solid currentColor',
          paddingLeft: '8px',
          opacity: 0.85,
        }}
      >
        {likesCount}
      </span>
    </button>
  );
};

```

---

### Usage Example

```tsx
export const App = () => {
  const handleApiSync = async (isLiked: boolean, count: number) => {
    // Simulate backend network latency
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log(`Synced to DB -> Liked: ${isLiked}, Total: ${count}`);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <LikeButton initialLikes={42} onLikeChange={handleApiSync} />
    </div>
  );
};

```

---

### Key Features

* **`aria-pressed={liked}`**: Informs screen readers of the binary toggle state.
* **Optimistic Updates**: Changes the UI instantly and rolls back if an asynchronous API call fails.
* **SVG Scaling**: Dynamic SVG heart fill with CSS scale animations on click.
