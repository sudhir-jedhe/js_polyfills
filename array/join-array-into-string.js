Array.prototype.join() is the tool most developers would reach in order to join an array into a string. However, it has some limitations, such as the inability to use different separators for the last item. Luckily, there's a new kid on the block - Intl.ListFormat - which can help us with that.

Using the Intl.ListFormat() constructor, we can create more versatile formatters, allowing us to specify the grouping type (e.g. conjunction or disjunction) and the style of the list (e.g. long, short or narrow). The format() method of the formatter can then be used to join an array into a string, with the appropriate separators.

const formatList = (arr, locale, type, style) =>
  new Intl.ListFormat(locale, { type, style }).format(arr);

formatList(['foo', 'bar', 'baz'], 'en-US', 'conjunction', 'short');
// 'foo, bar, & baz'
formatList(['foo', 'bar', 'baz'], 'en-US', 'conjunction', 'long');
// 'foo, bar, and baz'
formatList(['foo', 'bar', 'baz'], 'en-GB', 'conjunction', 'long');
// 'foo, bar and baz'
formatList(['foo', 'bar', 'baz'], 'en-US', 'disjunction', 'long');
// 'foo, bar, or baz'
💬  Note
As shown in the examples, the 'en-US' locale uses the Oxford comma, while the 'en-GB' locale doesn't.