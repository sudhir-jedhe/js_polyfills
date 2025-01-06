const onClickOutside = (element, callback) => {
    document.addEventListener('click', e => {
      if (!element.contains(e.target)) callback();
    });
  };
  
  onClickOutside('#my-element', () => console.log('Hello'));
  // Will log 'Hello' whenever the user clicks outside of #my-element