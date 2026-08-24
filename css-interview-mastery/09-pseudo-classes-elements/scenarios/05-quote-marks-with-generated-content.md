# Scenario: Locale-Aware Quote Marks Around `<blockquote>`

**Situation:** A blog renders `<blockquote>` elements for pull-quotes, and the design calls for large decorative quotation marks before and after the quoted text. The site is also translated into multiple locales, and different languages use different quotation-mark glyphs (`“ ”` in English, `« »` in French).

**Approach:** Use `::before`/`::after` generated content, driven by the `quotes` property so the correct glyphs are chosen per language automatically.

```html
<html lang="en">
  <blockquote>Simplicity is the ultimate sophistication.</blockquote>
</html>
```

```css
blockquote {
  quotes: "\201C" "\201D" "\2018" "\2019"; /* “ ” ‘ ’ — outer pair, then inner pair for nesting */
  font-style: italic;
  padding: 0 1.5rem;
  position: relative;
}

blockquote::before {
  content: open-quote;
  font-size: 2em;
  position: absolute;
  left: 0;
  top: 0;
  color: #999;
}

blockquote::after {
  content: close-quote;
  font-size: 2em;
  color: #999;
}
```

```css
/* French locale override — quotes property can vary per lang() */
:lang(fr) blockquote {
  quotes: "\00AB" "\00BB"; /* « » */
}
```

**Why this works:** `content: open-quote` / `close-quote` reads the current `quotes` property instead of a hardcoded string, so switching `quotes` per language (via a `:lang()` selector or a locale-scoped stylesheet) automatically changes the rendered glyphs without touching the `::before`/`::after` rules themselves. This is preferable to hardcoding `content: "“"` directly in `::before`, which would require duplicating the entire rule per locale instead of overriding a single property.

**Limitation to flag:** generated quote characters are decorative and not reliably exposed to assistive technology as meaningful punctuation — for content where the quotation marks carry real semantic weight (e.g. legal citation text), don't rely on generated content alone; consider real markup or ARIA where appropriate.
