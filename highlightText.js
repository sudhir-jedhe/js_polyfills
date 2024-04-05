highlightText;

function highlightText(text, searchTerm) {
  // Handle case-insensitive search
  const regex = new RegExp(searchTerm, "gi");

  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}



<div id="content">Some text content with a search word in it.</div>
<input type="text" id="searchInput">
<button id="searchButton">Search</button> 


const contentElement = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value;
  if (searchTerm) {
    const newText = highlightText(contentElement.textContent, searchTerm);
    contentElement.innerHTML = newText;
  }
});