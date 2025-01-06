**Do you know why React components need to start with capital letters?**

It's because a React component is written in JSX, which internally translates to a react.createElement API. This createElement function is then transformed into a plain JavaScript object, a fundamental data structure which is known as React Fiber. This entire process occurs due to Babel.

React takes the component and converts it into a Fiber object (javascript object). When React encounters a name starting with a capital letter, it recognizes it as a reference rather than a string (a Dom node for instance like div are treated as HTML elements React will converts Dom nodes into string) if its something like <User/> react will not convert into string it see first letter is capital meaning its a reference it will call that component and component is internally a function and then the recursion goes on and on...