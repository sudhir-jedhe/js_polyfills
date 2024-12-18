### `font-variant` in CSS

The `font-variant` property in CSS is used to control the rendering of text with respect to specific features in a font. It enables you to apply variations to the text depending on the font that you are using, such as small caps, ligatures, and other advanced typographic features.

This property is particularly useful when working with fonts that include multiple stylistic options, such as OpenType or TrueType fonts, which support different typographic features.

---

### Syntax:

```css
font-variant: normal | small-caps | [font-feature-settings];
```

- **normal**: This is the default value. It uses the regular or default variant of the font.
- **small-caps**: This transforms lowercase text into uppercase letters that are smaller than the typical uppercase letters. The lowercase letters become "small caps" (i.e., they look like capitals, but smaller).
- **font-feature-settings**: This allows more advanced and granular control over font features (like ligatures, old-style figures, etc.) by specifying specific OpenType or TrueType font features.

### Possible Values for `font-variant`:

1. **normal**: 
   - This is the default setting, where no font variants are applied.
   
   ```css
   p {
     font-variant: normal;
   }
   ```

2. **small-caps**:
   - Transforms lowercase letters into "small capitals". This is especially useful for typographic design and can give text a more formal or emphasized look.
   
   ```css
   p {
     font-variant: small-caps;
   }
   ```

3. **[font-feature-settings]**:
   - The `font-feature-settings` property is an advanced feature of CSS that allows you to enable or disable specific OpenType or TrueType font features. This allows greater control over typographic features like ligatures, stylistic sets, and other advanced properties.
   
   ```css
   p {
     font-feature-settings: "liga" 1;  /* Enable standard ligatures */
   }
   ```

---

### Advanced Typographic Features (`font-feature-settings`)

For more complex fonts (like OpenType fonts), `font-variant` can also enable certain typographic features, such as:

- **Ligatures** (`liga`, `dlig`, etc.): Ligatures are special combinations of letters that are rendered as a single glyph. For example, "fi" or "fl" may be rendered as a single connected character.
- **Old-Style Figures** (`onum`): These are numbers with varying heights, as opposed to the default "lining" numbers that align with the height of capital letters.
- **Contextual Alternates** (`calt`): This enables alternate glyphs depending on the context, such as replacing a character with a ligature if it's followed by certain characters.
- **Stylistic Sets** (`ss01`, `ss02`, etc.): These allow the application of different sets of glyphs that are designed for a specific style, such as a different set of swash characters, or a completely different variant of a typeface.

#### Example: Enabling Ligatures and Old-Style Figures

```css
p {
  font-feature-settings: "liga" 1, "onum" 1;
}
```

- **liga**: Enables the standard ligatures in the font.
- **onum**: Enables old-style figures for numbers.

#### Example: Using Stylistic Sets

```css
p {
  font-feature-settings: "ss01" 1, "ss02" 1;
}
```

- **ss01**: Applies the first stylistic set, which may provide an alternative design for certain characters.
- **ss02**: Applies a second stylistic set, possibly providing a different alternative.

### Related Properties

While `font-variant` can control some basic text transformations like small caps, CSS provides other properties to fine-tune typography:

1. **`font-variant-caps`**: Controls the display of capital letters in more specific ways (like small-caps).
2. **`font-variant-ligatures`**: Controls whether or not ligatures are used.
3. **`font-feature-settings`**: Provides more granular control over OpenType font features.

---

### Example: Using `font-variant` in a Real-world Scenario

```css
/* Using small caps for headings */
h1 {
  font-family: 'Times New Roman', serif;
  font-variant: small-caps;
  font-weight: bold;
}

/* Using ligatures and old-style figures */
p {
  font-family: 'Open Sans', sans-serif;
  font-feature-settings: "liga" 1, "onum" 1;
}
```

In the above example:
- The **`h1`** element uses small caps for the text, which makes lowercase letters look like uppercase but smaller in size.
- The **`p`** element uses Open Sans with the `"liga"` feature (ligatures) and `"onum"` (old-style figures), giving the text a more sophisticated typographic appearance.

---

### Conclusion

The `font-variant` property is a useful tool for fine-tuning the appearance of text in web design. By using `small-caps`, or more advanced options through `font-feature-settings`, you can take full advantage of OpenType and TrueType font capabilities to create visually rich and readable text. This becomes especially important when building professional-looking websites or applications that require high-quality typography.