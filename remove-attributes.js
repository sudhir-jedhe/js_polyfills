document.querySelector('img').removeAttribute('src');
// Removes the 'src' attribute from the <img> element

const removeAttributes = element =>
    Object.values(element.attributes).forEach(({ name }) =>
      element.removeAttribute(name)
    );
  
  removeAttributes(document.querySelector('p.special'));
  // The paragraph will not have the 'special' class anymore,
  //  and all other attributes will be removed