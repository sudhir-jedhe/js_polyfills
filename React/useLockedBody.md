import { useEffect } from "react";

const useLockedBody = (locked) => {
    useEffect(() => {
        if (locked) {
            // Save the current scroll position
            const scrollY = window.scrollY;

            // Set body styles
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';

            // Cleanup function to unlock the body
            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [locked]);
};

export default useLockedBody;

// Implement the useLockedBody() hook in React that will lock the body from further scrolling.

// The useLockedBody() hook will take the reference of the parent and return the lock state and the method that will toggle the lock state.

// To lock the body, we will have to remove the overflow from the body so that everything inside it is prevented from scrolling and hide the scrollbar.

// To hide the scroll bar, get the scrollWidth of the referenced element and add same size right padding to the body to cover the gap.

// This complete processing will take inside useLayoutEffect() hook as the side effect is with the DOM.

// Use a state to monitor the toggling and depending upon the toggle state, lock or unlock the body.



const useLockedBody = (ref, initiallyLocked = false) => {
    const [locked, setLocked] = useState(initiallyLocked);
  
    // handle side effects before render
    useLayoutEffect(() => {
      if (!locked) {
        return;
      }
  
      // save original body style
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
  
      // lock body scroll
      document.body.style.overflow = "hidden";
  
      // get the scrollBar width
      const root = ref.current; // or root
      const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;
  
      // prevent width reflow
      if (scrollBarWidth) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
  
      // clean up
      return () => {
        document.body.style.overflow = originalOverflow;
  
        if (scrollBarWidth) {
          document.body.style.paddingRight = originalPaddingRight;
        }
      };
    }, [locked]);
  
    // update state when dependecy changes
    useEffect(() => {
      if (locked !== initiallyLocked) {
        setLocked(initiallyLocked);
      }
    }, [initiallyLocked]);
  
    return [locked, setLocked];
  };


  Input:
const Example = () => {
  const ref = useRef();

  // call the hook which returns, current value and the toggler function
  const [locked, setLocked] = useLockedBody(ref);

  return (
    <div style={{ height: "200vh" }} id="abc" ref={ref}>
      <button onClick={() => setLocked(!locked)}>{locked ? "unlock scroll" : "lock scroll"}</button>
    </div>
  );
};

// click on the button to lock and unlock body locking 