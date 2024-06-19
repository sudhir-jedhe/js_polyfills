// To check if an HTML element has a class, you can use the Element.classList property and the DOMTokenList.contains() method.

const hasClass = (el, className) => el.classList.contains(className);

hasClass(document.querySelector('p.special'), 'special'); // true

// To add a class to an HTML element, you can use the Element.classList property and the DOMTokenList.add() method.

const addClass = (el, className) => el.classList.add(className);

addClass(document.querySelector('p'), 'special');
// The paragraph will now have the 'special' class

// removing a class from an HTML element can be done the same way, but using the DOMTokenList.remove() method, instead.

const removeClass = (el, className) => el.classList.remove(className);

removeClass(document.querySelector('p.special'), 'special');
// The paragraph will not have the 'special' class anymore

// if you only need to switch a class on and off, you can use the DOMTokenList.toggle() method.

const toggleClass = (el, className) => el.classList.toggle(className);

toggleClass(document.querySelector('p.special'), 'special');
// The paragraph will not have the 'special' class anymore