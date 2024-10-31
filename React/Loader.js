const Loader = ({ numberOfDots }) => {
    const renderDots = (dots) => {
      const arrayOfDots = new Array(dots).fill(' ');
      return arrayOfDots.map((dot, index) => (
        <div
          className="dot"
          style={{ animationDelay: `${index * 100}ms`}}
        />
      ))
    }
  
    return(
      <div className="loader">
        {renderDots(numberOfDots)}
      </div>
    );
  };
  
  export default Loader;
  

  * {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  display: flex;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #414141;
  border-radius: 50%;
  animation: bounce 0.5s infinite alternate;
}

@keyframes bounce {
  100% {
    translate: 0 -10px;
  }
}