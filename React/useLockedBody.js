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
