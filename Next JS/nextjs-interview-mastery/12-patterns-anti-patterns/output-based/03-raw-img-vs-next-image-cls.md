# Why does adding this "harmless" avatar image tank the page's CLS score?

```tsx
export function CommentItem({ comment }: { comment: { authorAvatarUrl: string; text: string } }) {
  return (
    <div className="comment">
      <img src={comment.authorAvatarUrl} className="avatar" />
      <p>{comment.text}</p>
    </div>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}
```

This renders inside a long list of 50+ comments. The team is surprised a "small profile picture" is responsible for a large chunk of the page's Cumulative Layout Shift score.

**Answer:** Neither the `<img>` tag nor the CSS specifies a `width`/`height` (or `aspect-ratio`), so the browser has no idea how much space to reserve for each avatar before its image data arrives — each of the 50+ avatars independently pops into existence at whatever its natural intrinsic size is, pushing surrounding comment text down each time. With 50+ instances on one page, each individually small shift compounds into a large cumulative score, since CLS sums shifts across the entire page, not just the largest single one.

**Why:** This is a case where the *severity* of a normally-minor-looking omission scales with how many times the pattern repeats on a page — a single missing-dimension image might barely register, but the same mistake multiplied across a long list is a very different story. The fix is `next/image` with explicit dimensions matching the actual rendered avatar size:

```tsx
import Image from 'next/image';

export function CommentItem({ comment }: { comment: { authorAvatarUrl: string; text: string } }) {
  return (
    <div className="comment">
      <Image
        src={comment.authorAvatarUrl}
        alt=""
        width={40}
        height={40}
        className="avatar"
      />
      <p>{comment.text}</p>
    </div>
  );
}
```

Beyond fixing the layout-shift problem via reserved space, `next/image` also automatically resizes and format-converts each avatar, which matters at this scale too — 50 unoptimized full-resolution avatar images (if the source URLs serve larger-than-needed originals) is a meaningfully larger total payload than 50 correctly downsized ones, compounding the raw-`<img>` mistake with a bandwidth cost on top of the layout-shift cost.
