const getTop3Links = () => {
  const result = [];

  const featured = getFeaturedLinks();
  if (featured) result.push(featured);

  const multipleLinksResults = document.querySelectorAll(
    "#rso [data-header-feature='0'] a"
  );

  for (let link of multipleLinksResults) {
    const href = link.getAttribute("href");
    if (href) result.push(href);
  }

  return result.slice(0, 3);
};

const getFeaturedLinks = () => {
  const h2s = document.getElementsByTagName("h2");
  for (let h2 of h2s) {
    if (h2.innerText === "Featured snippet from the web") {
      const parent = h2.closest(".MjjYud");
      return parent.querySelector(".yuRUbf  a").getAttribute("href");
    }
  }

  return undefined;
};
