# Product Review Page in React

### Frontend System Design + Complete Interview-Ready Code

Product review pages are used by:

```txt
Amazon
Flipkart
Myntra
Nykaa
Zomato
Google Play
```

They are a very common **React frontend interview question** because they combine:

✅ Component decomposition

✅ Ratings display

✅ Add review form

✅ Filter reviews

✅ Sort reviews

✅ Pagination / Infinite Scroll

✅ Helpful votes

✅ Star ratings

✅ Responsive UI

✅ Reusable components

---

# Requirements

## Features

✅ Show product summary

✅ Show average rating

✅ Star breakdown (5★, 4★, 3★, 2★, 1★)

✅ Review list

✅ Add review with rating

✅ Filter by rating

✅ Sort by newest / oldest / rating

✅ Helpful / Not Helpful

✅ Pagination

✅ Persistence in localStorage

---

# 1. System Design

```txt
Product Page
     │
     ▼
Product Summary
     │
     ▼
Rating Breakdown
     │
     ▼
Filters + Sort
     │
     ▼
Review List
     │
     ▼
Add Review Form
```

---

# 2. Data Model

```js
{
  id: "u123",
  user: "Sudhir",
  rating: 5,
  comment: "Excellent product",
  helpful: 12,
  notHelpful: 1,
  createdAt: "2026-07-01"
}
```

---

# 3. Component Structure

```txt
App
│
├── ProductInfo
├── RatingSummary
│   ├── AverageRating
│   └── RatingBreakdown
│
├── ReviewFilters
│
├── ReviewList
│   └── ReviewCard
│
├── ReviewForm
│
└── Pagination
```

---

# 4. Project Structure

```txt
src/
│
├── App.jsx
│
├── product/
│   ├── ProductInfo.jsx
│   ├── RatingSummary.jsx
│   ├── ReviewFilters.jsx
│   ├── ReviewList.jsx
│   ├── ReviewCard.jsx
│   ├── ReviewForm.jsx
│   └── StarRating.jsx
│
└── styles.css
```

---

# 5. StarRating Component

Reusable rating widget:

```jsx
import { useState } from "react";

export default function StarRating({
  value,
  onChange,
  size = 22,
  readOnly = false,
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: size,
            cursor: readOnly ? "default" : "pointer",
            color: (hover || value) >= star ? "#facc15" : "#e5e7eb",
          }}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
```

---

# 6. RatingSummary Component

```jsx
import StarRating from "./StarRating";

export default function RatingSummary({ reviews }) {
  const total = reviews.length;

  const avg =
    total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="rating-summary">
      <div className="avg">
        <h1>{avg.toFixed(1)}</h1>

        <StarRating value={Math.round(avg)} readOnly />

        <p>{total} reviews</p>
      </div>

      <div className="breakdown">
        {breakdown.map(({ star, count }) => (
          <div key={star} className="row">
            <span>{star}★</span>

            <div className="bar">
              <div
                className="fill"
                style={{
                  width: total ? `${(count / total) * 100}%` : "0%",
                }}
              />
            </div>

            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

# 7. ReviewFilters Component

```jsx
export default function ReviewFilters({
  ratingFilter,
  setRatingFilter,
  sortOption,
  setSortOption,
}) {
  return (
    <div className="filters">
      <select
        value={ratingFilter}
        onChange={(e) => setRatingFilter(Number(e.target.value))}
      >
        <option value={0}>All Ratings</option>

        {[5, 4, 3, 2, 1].map((star) => (
          <option key={star} value={star}>
            {star} Stars
          </option>
        ))}
      </select>

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="newest">Newest</option>

        <option value="oldest">Oldest</option>

        <option value="highest">Highest Rating</option>

        <option value="lowest">Lowest Rating</option>
      </select>
    </div>
  );
}
```

---

# 8. ReviewCard Component

```jsx
import StarRating from "./StarRating";

export default function ReviewCard({ review, onVote }) {
  return (
    <div className="review-card">
      <div className="review-head">
        <strong>{review.user}</strong>

        <StarRating value={review.rating} readOnly size={14} />
      </div>

      <p>{review.comment}</p>

      <p className="date">{new Date(review.createdAt).toDateString()}</p>

      <div className="votes">
        <button onClick={() => onVote(review.id, "helpful")}>
          👍 {review.helpful}
        </button>

        <button onClick={() => onVote(review.id, "notHelpful")}>
          👎 {review.notHelpful}
        </button>
      </div>
    </div>
  );
}
```

---

# 9. ReviewList Component

```jsx
import ReviewCard from "./ReviewCard";

export default function ReviewList({ reviews, onVote }) {
  if (reviews.length === 0) return <p className="no-review">No reviews yet.</p>;

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onVote={onVote} />
      ))}
    </div>
  );
}
```

---

# 10. ReviewForm Component

```jsx
import { useState } from "react";

import StarRating from "./StarRating";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  function handleSubmit() {
    if (!rating || !comment.trim()) {
      alert("Please provide rating and comment");

      return;
    }

    onSubmit({
      id: Date.now().toString(),
      user: "Current User",
      rating,
      comment,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date().toISOString(),
    });

    setRating(0);
    setComment("");
  }

  return (
    <div className="review-form">
      <h3>Write a Review</h3>

      <StarRating value={rating} onChange={setRating} />

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

---

# 11. Main App.jsx

```jsx
import {
  useState,
  useMemo
} from "react";

import ProductInfo
from "./product/ProductInfo";

import RatingSummary
from "./product/RatingSummary";

import ReviewFilters
from "./product/ReviewFilters";

import ReviewList
from "./product/ReviewList";

import ReviewForm
from "./product/ReviewForm";

import "./styles.css";

const initialReviews = [
  {
    id: "1",
    user: "Amit",
    rating: 5,
    comment: "Great product",
    helpful: 5,
    notHelpful: 0,
    createdAt: "2026-06-01"
  },
  {
    id: "2",
    user: "Priya",
    rating: 3,
    comment: "Good, but pricey.",
    helpful: 1,
    notHelpful: 1,
    createdAt: "2026-06-05"
  }
];

export default function App() {

  const [reviews, setReviews] =
    useState(
      initialReviews
    );

  const [ratingFilter,
    setRatingFilter] =
    useState(0);

  const [sortOption,
    setSortOption] =
    useState("newest");

  function addReview(
    review
  ) {
    setReviews(prev => [
      review,
      ...prev
    ]);
  }

  function voteReview(
    id,
    type
  ) {
    setReviews(prev =>
      prev.map(review =>
        review.id === id
          ? {
              ...review,
              review[type] + 1
            }
          : review
      )
    );
  }

  const filtered =
    useMemo(() => {

      let list =
        ratingFilter
          ? reviews.filter(
              r =>
                r.rating ===
                ratingFilter
            )
          : [...reviews];

      switch (sortOption) {

        case "newest":
          return list.sort(
            (a, b) =>
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
          );

        case "oldest":
          return list.sort(
            (a, b) =>
              new Date(
                a.createdAt
              ) -
              new Date(
                b.createdAt
              )
          );

        case "highest":
          return list.sort(
            (a, b) =>
              b.rating -
              a.rating
          );

        case "lowest":
          return list.sort(
            (a, b) =>
              a.rating -
              b.rating
          );

        default:
          return list;
      }

    }, [
      reviews,
      ratingFilter,
      sortOption
    ]);

  return (
    <div className="container">

      <ProductInfo />

      <RatingSummary
        reviews={reviews}
      />

      <ReviewFilters
        ratingFilter={
          ratingFilter
        }
        setRatingFilter={
          setRatingFilter
        }
        sortOption={
          sortOption
        }
        setSortOption={
          setSortOption
        }
      />

      <ReviewList
        reviews={filtered}
        onVote={voteReview}
      />

      <ReviewForm
        onSubmit={addReview}
      />

    </div>
  );
}
```

---

# 12. ProductInfo Component

```jsx
export default function ProductInfo() {
  return (
    <div className="product-info">
      <h1>iPhone 17 Pro</h1>

      <p>The most powerful iPhone ever built with A20 chip.</p>

      <p className="price">₹1,29,900</p>
    </div>
  );
}
```

---

# 13. CSS

```css
.container {
  width: 700px;
  margin: 30px auto;

  background: white;
  padding: 20px;

  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.rating-summary {
  display: flex;
  gap: 20px;

  border-bottom: 1px solid #eee;

  padding: 12px 0;
}

.avg {
  flex: 1;
  text-align: center;
}

.breakdown {
  flex: 2;
}

.row {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 4px;
}

.bar {
  flex: 1;
  height: 8px;
  background: #f3f4f6;

  border-radius: 6px;
  overflow: hidden;
}

.fill {
  background: #facc15;
  height: 100%;
}

.filters {
  display: flex;
  gap: 8px;

  margin: 10px 0;
}

.review-card {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.date {
  color: gray;
  font-size: 12px;
}

.review-form {
  border-top: 1px solid #ddd;
  padding-top: 12px;
}

.review-form textarea {
  width: 100%;
  padding: 8px;
  min-height: 80px;
}

.review-form button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;

  margin-top: 8px;

  border-radius: 6px;
  cursor: pointer;
}
```

---

# 14. Extensions for Senior React Roles

## ✅ Persistence

Save reviews in `localStorage` or backend API.

## ✅ Async Fetch

Use React Query for fetching reviews.

## ✅ Pagination / Infinite Scroll

Show 10 reviews at a time.

## ✅ Verified Buyer Badge

Add “Verified Purchase” tag.

## ✅ Report / Abuse Reporting

Add report button.

## ✅ Sorting by Helpfulness

Add sort option “Most Helpful”.

## ✅ Rating Filter Chips

Instead of dropdown.

## ✅ Product Image Gallery

For visual UX.

## ✅ Comment Threads

Reply to a review.

---

# Senior React Interview Answer

> A product review page is composed of the product summary, average rating breakdown, review list, filters, sort options, and a review form. The rating summary calculates the average and distribution using pure functions. Reviews are filtered and sorted dynamically using `useMemo` to avoid unnecessary calculations. Each review card supports helpful/not-helpful voting and shows metadata like username and date. The form allows adding a new review through a controlled star rating and a comment box. For production, the design can be extended with API-based fetching, pagination, localStorage persistence, verified buyer badges, threaded replies, and virtualized rendering for large review lists — the pattern used by Amazon, Flipkart, and Google Play.

# Product Review Page – Advanced Features

### LocalStorage Persistence + Pagination + Star Breakdown

These three features are common **Senior React interview follow-ups** for building a production-grade review page (like Amazon, Flipkart, or Nykaa).

---

# 1. LocalStorage Persistence for Reviews

Reviews must survive:

```txt
Page Refresh
Tab Close
Browser Restart
```

---

## Load Reviews on Mount

```jsx
const [reviews, setReviews] = useState(() => {
  try {
    const saved = localStorage.getItem("product-reviews");

    return saved ? JSON.parse(saved) : initialReviews;
  } catch (error) {
    console.warn("Failed to load reviews", error);

    return initialReviews;
  }
});
```

---

## Save Reviews on Change

```jsx
useEffect(() => {
  try {
    localStorage.setItem("product-reviews", JSON.stringify(reviews));
  } catch (error) {
    console.warn("Failed to save reviews", error);
  }
}, [reviews]);
```

---

## Reset Reviews

```jsx
function resetReviews() {
  setReviews([]);

  localStorage.removeItem("product-reviews");
}
```

---

## Flow

```txt
User Adds Review
      ↓
State Updates
      ↓
useEffect Runs
      ↓
LocalStorage Updated

Page Refresh
      ↓
Load From LocalStorage
      ↓
Reviews Restored
```

---

## Improvements

Store metadata:

```js
{
  version: 1,
  updatedAt: Date.now(),
  data: reviews
}
```

Useful when schema changes.

Example:

```js
const parsed = JSON.parse(saved);

if (parsed.version === 1) {
  setReviews(parsed.data);
}
```

---

# 2. Pagination for Review List

Suppose there are 1000 reviews.

Rendering all at once:

```txt
❌ Slow rendering
❌ Bad UX
❌ Memory heavy
❌ Long scroll
```

Load in chunks:

```txt
Page 1 → 10 reviews
Page 2 → 10 reviews
Page 3 → 10 reviews
```

---

## State

```jsx
const REVIEWS_PER_PAGE = 5;

const [currentPage, setCurrentPage] = useState(1);
```

---

## Calculate Total Pages

```jsx
const totalPages = Math.ceil(filtered.length / REVIEWS_PER_PAGE);
```

---

## Paginated Reviews

```jsx
const paginated = filtered.slice(
  (currentPage - 1) * REVIEWS_PER_PAGE,
  currentPage * REVIEWS_PER_PAGE,
);
```

---

## Reset Page on Filter/Sort Change

```jsx
useEffect(() => {
  setCurrentPage(1);
}, [ratingFilter, sortOption]);
```

---

## Pagination Component

```jsx
function Pagination({ totalPages, currentPage, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Prev
      </button>

      {Array.from(
        {
          length: totalPages,
        },
        (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ),
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Next
      </button>
    </div>
  );
}
```

---

## Use Paginated Reviews

```jsx
<ReviewList
  reviews={paginated}
  onVote={voteReview}
/>

<Pagination
  totalPages={totalPages}
  currentPage={
    currentPage
  }
  setCurrentPage={
    setCurrentPage
  }
/>
```

---

## Bonus: Infinite Scroll Version

Replace pagination with:

```txt
IntersectionObserver
```

Loads next page as user scrolls.

Similar to LinkedIn / Instagram feeds.

---

# 3. Average Rating + Star Breakdown

Already partially built.

Let's harden the implementation.

---

## Calculate Average

```jsx
const total = reviews.length;

const avg =
  total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;
```

Example:

```txt
Ratings:
5, 4, 3, 5, 4

Total = 21
Avg = 4.2
```

---

## Round for Display

```jsx
<StarRating value={Math.round(avg)} readOnly />
```

For decimal precision:

```jsx
{
  avg.toFixed(1);
}
```

Example:

```txt
4.2 ★★★★☆
```

---

## Star Breakdown

```jsx
const breakdown = [5, 4, 3, 2, 1].map((star) => ({
  star,
  count: reviews.filter((r) => r.rating === star).length,
}));
```

Sample:

```txt
5★  ██████████  35
4★  ██████       20
3★  ████         10
2★  ██            5
1★  █             2
```

---

## Rating Bar Component

```jsx
{
  breakdown.map(({ star, count }) => {
    const percent = total ? (count / total) * 100 : 0;

    return (
      <div key={star} className="row">
        <span>{star}★</span>

        <div className="bar">
          <div
            className="fill"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        <span>{count}</span>
      </div>
    );
  });
}
```

---

## Improvements

### Percent Label

```txt
5★  █████ 55%
```

---

### Color Coded Fills

```txt
5★ Green
4★ Light Green
3★ Yellow
2★ Orange
1★ Red
```

Example:

```jsx
const colors = {
  5: "#22c55e",
  4: "#84cc16",
  3: "#facc15",
  2: "#f97316",
  1: "#ef4444"
};

style={{
  background:
    colors[star]
}}
```

---

# Complete Flow

```txt
User Adds Review
       │
       ▼
State Update
       │
       ▼
Persisted in LocalStorage
       │
       ▼
Filter + Sort
       │
       ▼
Paginate
       │
       ▼
Render Reviews
       │
       ▼
Average Rating
Star Breakdown
```

---

# Senior React Interview Answer

> For persistence, I hydrate the reviews from `localStorage` during initial state creation and save them on every update using `useEffect`. This ensures reviews survive refreshes and browser restarts. For pagination, I calculate `totalPages` from the filtered review length and slice the reviews array based on `currentPage`. Filter/sort changes reset the page to 1 for consistency. The average rating is computed using a simple `reduce`, and the star breakdown is calculated by counting reviews per star. Each rating row is shown as a progress bar to visualise distribution. These optimizations mirror how large e-commerce platforms like Amazon, Flipkart, and Nykaa architect their review sections while remaining fast, scalable, and production-ready.
