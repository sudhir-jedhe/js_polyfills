function generateTableOfContents() {
  var headings = document.querySelectorAll("h1, h2, h3");
  var toc = document.createElement("ul");

  for (var i = 0; i < headings.length; i++) {
    var heading = headings[i];
    var link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;

    var li = document.createElement("li");
    li.appendChild(link);
    toc.appendChild(li);
  }

  document.body.appendChild(toc);
}

generateTableOfContents();
