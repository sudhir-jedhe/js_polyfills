function highlightText(searchTerm) {
  // Get all elements on the page that are not scripts.
  const elements = document.querySelectorAll("*:not(script)");

  // Loop through each element.
  elements.forEach((element) => {
    // Extract the element's text content.
    const text = element.textContent;

    // Create a regular expression to match the search term.
    const regex = new RegExp(searchTerm, "gi");

    // Check if the text contains the search term.
    if (regex.test(text)) {
      // Highlight all occurrences of the search term.
      element.innerHTML = text.replace(
        regex,
        `<mark class="highlight">$&</mark>`
      );
    }
  });
}

/******************************************* */

const TextHighlighter = ({ text = "", highlight = "" }) => {
  if (!highlight.trim()) return <span>{text}</span>;

  const parts = text.split(highlight);
  return (
    <span>
      {parts.map((text, index) => (
        <>
          <span>{text}</span>
          {index !== parts.length - 1 && <b>{highlight}</b>}
        </>
      ))}
    </span>
  );
};
