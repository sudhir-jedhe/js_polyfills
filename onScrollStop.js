const onScrollStop = callback => {
    let isScrolling;
    window.addEventListener(
      'scroll',
      e => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          callback();
        }, 150);
      },
      false
    );
  };
  
  onScrollStop(() => {
    console.log('The user has stopped scrolling');
  }); // Logs when the user has stopped scrolling