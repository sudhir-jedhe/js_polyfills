// Share data between multiple browser windows with JavaScript
// Posted on February 10, 2023 | by Prashant Yadav

// Posted in Interview, Javascript | Tagged SystemDesign

// We have already seen how we can share data between two browser windows (tabs) that are on the same domain with JavaScript. In this article, we will see how we can share data between multiple browser windows.

// Unlike sharing data between two windows, where we pass data to the windows using the Window.postMessage(), for multiple windows, we cannot determine who has opened which windows, thus rather than passing the data in chain, we will use a centralized solution.

// We will store the data in the localstorage and use the Window.onStorage() to listen to the event.

// The Window.onStorage() event is fired whenever there is modification on the localStorage and the event will be triggered in each window, except for the window that does the modification.

// Using this we can pass data around multiple windows. Let us see an example of it.

// Create three HTML files with the scripts.

// home
// login
// about
// home.html will have a button that will open login.html and login.html will have a button that will open about.html.

// Inside about.html we will store data in localStorage and check after the action, if the event is fired on the home.html and about.html.


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <h1>Hello, this is the Home page.</h1>
    <button onclick="openLogin()">Open Login</button>
    <script>
      let loginWindow;
      const openLogin = () => {
        loginWindow = window.open("login.html", "_blank");
      };

      window.addEventListener("storage", (event) => {
        console.log("Got storage data in home");
      });
    </script>
  </body>
</html>





<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
  </head>
  <body>
    <h1>Hello, this is the login page.</h1>
    <button onclick="openAbout()">open About</button>
    <script>
      let aboutWindow;

      const openAbout = () => {
        aboutWindow = window.open("about.html", "_blank");
      };

      window.addEventListener("storage", (event) => {
        console.log("Got storage data in login");
      });
    </script>
  </body>
</html>



<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <h1>Hello, this is the About page.</h1>
    <button onclick="sendMsgToAll()">Send message to All</button>
    <script>
      const sendMsgToAll = () => {
        localStorage.removeItem("data");
        localStorage.setItem("data", "Hello From About");
      };

      window.addEventListener("storage", (event) => {
        console.log("I won't log");
      });
    </script>
  </body>
</html>


Now open the home page in any browser and click on the button and open the login as well as about page.

On the about page, click the button Send Message to All and you will see the messaged logged in the console of the home and login page.