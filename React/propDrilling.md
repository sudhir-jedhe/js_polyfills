Prop Drilling is a React problem where data is passed from a parent component to a deeply nested child component through multiple intermediate components that don't actually use the data.

A recent React masterclass internally described prop drilling as happening because React data flows one way (parent → child) and excessive prop passing becomes difficult to manage. It also highlighted Context API and Redux as common solutions.

What is Prop Drilling?
Problem

Imagine the following component hierarchy:

App
└── Dashboard
└── UserProfile
└── UserDetails

Suppose UserDetails needs user data.

App.js
function App() {
const user = {
name: "Sudhir"
};

return (
<Dashboard user={user} />
);
}

Dashboard.js
function Dashboard({ user }) {
return (
<UserProfile user={user} />
);
}

UserProfile.js
function UserProfile({ user }) {
return (
<UserDetails user={user} />
);
}

UserDetails.js
function UserDetails({ user }) {
return (

<h1>{user.name}</h1>
);
}

Problem
App
↓
Dashboard
↓
UserProfile
↓
UserDetails

Dashboard and UserProfile don't need user, but they must pass it down.

This is Prop Drilling.

Why is Prop Drilling Bad?

1. Too Many Props
   <Dashboard
     user={user}
     theme={theme}
     permissions={permissions}
     settings={settings}
   />

As the application grows:

user
theme
permissions
settings
language
featureFlags

become difficult to manage.

2. Hard to Maintain

If user changes:

App
Dashboard
UserProfile
UserDetails

All components may require changes.

3. Unnecessary Re-renders

Every intermediate component receives props.

Dashboard
UserProfile

re-render even when they don't use the data.

How to Avoid Prop Drilling?
Solution 1: React Context API ✅

Best for:

Theme
User
Language
Auth
Settings

Create Context
import { createContext } from "react";

export const UserContext =
createContext();

Provider
function App() {

const user = {
name: "Sudhir"
};

return (
<UserContext.Provider
value={user} >
<Dashboard />
</UserContext.Provider>
);
}

Consume Anywhere
import {
useContext
} from "react";

function UserDetails() {

const user =
useContext(UserContext);

return (

<h1>{user.name}</h1>
);
}

No prop passing required.

A React interview example internally recommends moving app-wide data such as themes into Context and consuming it with useContext rather than passing props through every component.

Solution 2: Redux / Zustand / Global State

Best for large applications.

Authentication
Cart
Dashboard Data
Notifications
Permissions

Redux Example
const user =
useSelector(
state => state.user
);

Access data directly:

Any Component

without prop drilling.

Internal React discussions cite Redux as a common way to avoid excessive prop drilling when state is shared widely.

Solution 3: Component Composition

Instead of:

<Page user={user} />

Pass components.

Before
function Page({ user }) {
return (
<Profile user={user} />
);
}

After
function App() {
return (
<Page>
<Profile />
</Page>
);
}

Reduces unnecessary prop passing.

Solution 4: Custom Hooks

Create a reusable hook.

function useAuth() {
return useContext(AuthContext);
}

Usage:

const user = useAuth();

Cleaner than passing props everywhere.

When to Use What?
Scenario RecommendedData used by Parent & Child only Props
Theme Context API
Authentication Context API / Redux
Shopping Cart Redux / Zustand
App-wide Settings Context API
Complex Enterprise App Redux Toolkit / Zustand
Frequently Updating Global State Redux / Zustand
React Interview Answer

Prop drilling is the process of passing data from a parent component to deeply nested child components through intermediate components that don't use the data themselves. It makes code harder to maintain and can cause unnecessary re-renders. The common solutions are React Context API for shared app-wide data and Redux/Zustand for complex global state management. Context is ideal for themes, authentication, and settings, while Redux is better for large-scale applications with frequent state updates.

Internal React discussions and interview material mention using Context API, Redux, and custom hooks to avoid prop drilling when state is needed across many components. Context is commonly used for themes and shared app state, while Redux is preferred for larger applications with complex state management.

1. React Context API Example
   Problem (Prop Drilling)
   App
   └── Dashboard
   └── UserProfile
   └── UserDetails

Passing props through every level:

<App user={user}>

<Dashboard user={user}>

<UserProfile user={user}>

<UserDetails user={user}>

Solution Using Context
UserContext.js
import { createContext } from "react";

export const UserContext =
createContext(null);

App.js
import { UserContext } from "./UserContext";

function App() {

const user = {
id: 1,
name: "Sudhir"
};

return (
<UserContext.Provider
value={user} >
<Dashboard />
</UserContext.Provider>
);
}

export default App;

UserDetails.js
import { useContext } from "react";
import { UserContext } from "./UserContext";

function UserDetails() {

const user =
useContext(UserContext);

return (

<h2>
Welcome {user.name}
</h2>
);
}

export default UserDetails;

No intermediate prop passing required.

This pattern is similar to the internally discussed theme/context approach where shared state is provided once and consumed with useContext.

2. Redux for Avoiding Prop Drilling

Redux stores data in a single global store.

React Components
↓
Redux Store
↓
React Components

Components access state directly.

Redux Toolkit Example
Store
import {
configureStore
} from "@reduxjs/toolkit";

import authReducer
from "./authSlice";

export const store =
configureStore({
reducer: {
auth: authReducer
}
});

Slice
import {
createSlice
} from "@reduxjs/toolkit";

const authSlice =
createSlice({
name: "auth",

    initialState: {
      user: null
    },

    reducers: {
      setUser: (
        state,
        action
      ) => {
        state.user =
          action.payload;
      }
    }

});

export const {
setUser
} = authSlice.actions;

export default authSlice.reducer;

App
import {
Provider
} from "react-redux";

<Provider store={store}>
  <Dashboard />
</Provider>

Any Component
import {
useSelector
} from "react-redux";

function Profile() {

const user =
useSelector(
state => state.auth.user
);

return (

<h2>{user?.name}</h2>
);
}

No props needed.

Redux is commonly referenced internally as a solution for broader state sharing and avoiding excessive prop drilling in larger applications.

3. Custom Hook Example for Shared State

A custom hook hides Context implementation details.

AuthContext.js
import {
createContext,
useState
} from "react";

export const AuthContext =
createContext();

export function AuthProvider({
children
}) {

const [user, setUser] =
useState(null);

const login = (user) => {
setUser(user);
};

const logout = () => {
setUser(null);
};

return (
<AuthContext.Provider
value={{
        user,
        login,
        logout
      }} >
{children}
</AuthContext.Provider>
);
}

useAuth.js
import {
useContext
} from "react";

import {
AuthContext
} from "./AuthContext";

export function useAuth() {

return useContext(
AuthContext
);
}

Use Anywhere
import { useAuth }
from "./useAuth";

function Navbar() {

const {
user,
logout
} = useAuth();

return (
<>
<span>
{user?.name}
</span>

      <button
        onClick={logout}
      >
        Logout
      </button>
    </>

);
}

Real-World Example (Theme Context)
App
├── Header
├── Sidebar
├── Dashboard
└── Footer

All components need:

Dark / Light Theme

Instead of:

<Header theme={theme}/>
<Sidebar theme={theme}/>
<Dashboard theme={theme}/>

Use:

<ThemeProvider>
  <App />
</ThemeProvider>

and consume:

const theme = useTheme();

This theme scenario is very similar to the internal example where Context is used for application-wide theme values.

When to Use Context vs Redux
Use Context API

✅ Theme

✅ Auth User

✅ Language

✅ Feature Flags

✅ App Settings

Use Redux Toolkit

✅ Shopping Cart

✅ Dashboard Data

✅ Notifications

✅ Real-time Data

✅ Large Enterprise Apps

✅ Complex State Updates

Senior React Interview Answer

Prop drilling occurs when data is passed through intermediate components that don't use it. To avoid it, use Context API for lightweight shared state such as themes, authentication, and settings. For large applications with complex state, use Redux Toolkit so components can access a central store directly via useSelector. For better reusability and cleaner APIs, expose shared state through custom hooks such as useAuth() and useTheme().

Since you're preparing for Senior React interviews, here's a production-ready example.

Internal React discussions highlight using Context API, Redux, and custom hooks to avoid prop drilling and share state across components.

1. Custom Hook with Context API
   Folder Structure
   src/
   ├── context/
   │ ├── AuthContext.js
   │ └── useAuth.js
   ├── components/
   │ ├── Login.js
   │ └── Navbar.js
   └── App.js

AuthContext.js
import {
createContext,
useState
} from "react";

export const AuthContext =
createContext(null);

export function AuthProvider({
children
}) {

const [user, setUser] =
useState(null);

const login = (userData) => {
setUser(userData);
};

const logout = () => {
setUser(null);
};

return (
<AuthContext.Provider
value={{
        user,
        login,
        logout
      }} >
{children}
</AuthContext.Provider>
);
}

useAuth.js (Custom Hook)
import {
useContext
} from "react";

import {
AuthContext
} from "./AuthContext";

export function useAuth() {

const context =
useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth must be used inside AuthProvider"
);
}

return context;
}

Login.js
import { useAuth }
from "../context/useAuth";

function Login() {

const { login } =
useAuth();

const handleLogin = () => {
login({
id: 1,
name: "Sudhir"
});
};

return (
<button
      onClick={handleLogin}
    >
Login
</button>
);
}

export default Login;

Navbar.js
import { useAuth }
from "../context/useAuth";

function Navbar() {

const {
user,
logout
} = useAuth();

return (

<div>
{user
? (
<>
<span>
{user.name}
</span>

            <button
              onClick={logout}
            >
              Logout
            </button>
          </>
        )
        : (
          <span>
            Guest
          </span>
        )}
    </div>

);
}

export default Navbar;

App.js
import {
AuthProvider
} from "./context/AuthContext";

function App() {

return (
<AuthProvider>
<Navbar />
<Login />
</AuthProvider>
);
}

2. Context API vs Redux

This is a very common interview question.

Use Context API When

Small to medium applications.

Examples:

Theme
Language
Current User
Authentication
Feature Flags
Settings

Example
const theme =
useContext(ThemeContext);

Pros

✅ Built into React

✅ No extra dependencies

✅ Easy to learn

✅ Less boilerplate

Cons

❌ Frequent updates may trigger many re-renders

❌ Difficult to manage complex state

Use Redux Toolkit When

Large applications with complex state.

Examples:

Shopping Cart
Product Catalog
Dashboard Data
Notifications
Real-Time Updates
Multi-Step Forms

Pros

✅ Predictable state

✅ Excellent DevTools

✅ Middleware support

✅ RTK Query

✅ Better scalability

Cons

❌ More setup

❌ Additional learning curve

Interview Answer
Context API
→ Shared UI State

Redux Toolkit
→ Complex Application State

Example:

Theme → Context

Shopping Cart → Redux

Internal React discussions mention Context for themes/shared app state and Redux for larger applications with broader state sharing.

3. Redux Toolkit Setup Example
   Install
   npm install
   @reduxjs/toolkit
   react-redux

store.js
import {
configureStore
} from "@reduxjs/toolkit";

import authReducer
from "./features/authSlice";

export const store =
configureStore({
reducer: {
auth: authReducer
}
});

authSlice.js
import {
createSlice
} from "@reduxjs/toolkit";

const initialState = {
user: null
};

const authSlice =
createSlice({
name: "auth",

    initialState,

    reducers: {

      loginSuccess: (
        state,
        action
      ) => {

        state.user =
          action.payload;
      },

      logout: (
        state
      ) => {

        state.user =
          null;
      }
    }

});

export const {
loginSuccess,
logout
} = authSlice.actions;

export default authSlice.reducer;

main.jsx
import ReactDOM
from "react-dom/client";

import {
Provider
} from "react-redux";

import { store }
from "./store";

ReactDOM.createRoot(
document.getElementById("root")
).render(

<Provider
store={store}

>

    <App />

  </Provider>
);

Login Component
import {
useDispatch
} from "react-redux";

import {
loginSuccess
} from "./authSlice";

function Login() {

const dispatch =
useDispatch();

const handleLogin =
() => {

      dispatch(
        loginSuccess({
          id: 1,
          name: "Sudhir"
        })
      );
    };

return (
<button
      onClick={handleLogin}
    >
Login
</button>
);
}

Profile Component
import {
useSelector
} from "react-redux";

function Profile() {

const user =
useSelector(
state => state.auth.user
);

return (

<h2>
{user?.name}
</h2>
);
}

Architecture Comparison
Context API

App
↓
Provider
↓
useContext()
↓
Components

Redux Toolkit

App
↓
Redux Store
↓
useSelector()
↓
Any Component

Senior React Interview Answer (2 Minutes)

Prop drilling can be avoided using Context API, Redux Toolkit, or custom hooks. I typically use Context API for UI-wide state such as themes, authenticated users, language preferences, and feature flags. For complex business state such as shopping carts, dashboard data, notifications, and real-time updates, I prefer Redux Toolkit because it offers a centralised store, predictable updates, middleware support, DevTools integration, and RTK Query for API caching. To improve reusability and encapsulation, I expose context through custom hooks such as useAuth() and useTheme().

For a Senior React / React Lead interview, interviewers often ask:

Why use custom hooks with Context?
When should I choose Context vs Redux?
How do you handle async APIs in Redux Toolkit?

Let's cover all three with production-grade examples.

1. Benefits of Custom Hooks with Context API

Instead of directly using useContext() everywhere, wrap it inside a custom hook.

Without Custom Hook
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function Profile() {
const auth = useContext(AuthContext);

return <div>{auth.user.name}</div>;
}

Problems:

❌ Repeated imports

❌ Context implementation exposed

❌ No validation

❌ Harder to refactor

With Custom Hook
AuthContext.js
import {
createContext,
useState
} from "react";

export const AuthContext =
createContext();

export function AuthProvider({
children
}) {

const [user, setUser] =
useState(null);

const login = (userData) => {
setUser(userData);
};

const logout = () => {
setUser(null);
};

return (
<AuthContext.Provider
value={{
        user,
        login,
        logout
      }} >
{children}
</AuthContext.Provider>
);
}

useAuth.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {

const context =
useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth must be used inside AuthProvider"
);
}

return context;
}

Usage
import { useAuth }
from "./useAuth";

function Navbar() {

const {
user,
logout
} = useAuth();

return (
<>
<span>
{user?.name}
</span>

      <button onClick={logout}>
        Logout
      </button>
    </>

);
}

Benefits
Encapsulation

Hide Context implementation.

const { user } = useAuth();

instead of:

const user =
useContext(AuthContext);

Reusability
useAuth()
useTheme()
useLanguage()
usePermissions()

Validation
if (!context)
throw Error(...)

Prevents misuse.

Easy Refactoring

Today:

Context API

Tomorrow:

Redux
Zustand
Jotai

Only hook changes.

2. Redux Toolkit Async Action Example

Most modern applications use:

createAsyncThunk

Redux Toolkit is widely used for scalable state management in enterprise React applications.

API Layer
import axios from "axios";

export const fetchUsersApi =
() =>
axios.get(
"https://jsonplaceholder.typicode.com/users"
);

usersSlice.js
import {
createSlice,
createAsyncThunk
} from "@reduxjs/toolkit";

import {
fetchUsersApi
} from "./api";

Async Action
export const fetchUsers =
createAsyncThunk(
"users/fetchUsers",

    async () => {

      const response =
        await fetchUsersApi();

      return response.data;
    }

);

Slice
const usersSlice =
createSlice({

name: "users",

initialState: {
data: [],
loading: false,
error: null
},

reducers: {},

extraReducers: (builder) => {

    builder

      .addCase(
        fetchUsers.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchUsers.fulfilled,
        (state, action) => {

          state.loading = false;

          state.data =
            action.payload;
        }
      )

      .addCase(
        fetchUsers.rejected,
        (state, action) => {

          state.loading =
            false;

          state.error =
            action.error.message;
        }
      );

}
});

export default
usersSlice.reducer;

Component
import {
useDispatch,
useSelector
} from "react-redux";

import {
useEffect
} from "react";

import {
fetchUsers
} from "./usersSlice";

function Users() {

const dispatch =
useDispatch();

const {
data,
loading,
error
} = useSelector(
state => state.users
);

useEffect(() => {
dispatch(fetchUsers());
}, [dispatch]);

if (loading)
return <p>Loading...</p>;

if (error)
return <p>{error}</p>;

return (
<>
{data.map(user => (

<div key={user.id}>
{user.name}
</div>
))}
</>
);
}

3. Context API vs Redux Performance

This is a favourite Staff/Senior interview question.

Context API
Small Apps
Shared UI State

Examples:

Theme
Language
Authenticated User
Feature Flags

Problem

When Context value changes:

Provider
↓
ALL Consumers Re-render

Example:

<AuthProvider>

Navbar
Sidebar
Dashboard

</AuthProvider>

User changes:

Navbar re-render
Sidebar re-render
Dashboard re-render

even if only Navbar uses the user.

This can become a performance concern in large applications. Internal discussions note Context works well for smaller shared state use cases.

Redux Toolkit

Redux uses subscriptions.

Store
↓
Component Selector

Each component subscribes only to required state.

const user =
useSelector(
state => state.auth.user
);

Only components using:

auth.user

re-render.

This is more scalable for larger applications. Internal interview material discusses useSelector, feature slices, and modular reducers for maintainability and performance.

Performance Comparison
Feature Context API Redux ToolkitSetup Easy Moderate
Bundle Size Smaller Slightly Larger
Re-render Control Limited Excellent
DevTools No Yes
Async APIs Manual createAsyncThunk / RTK Query
Scalability Medium High
Performance Large Apps Medium Excellent
Best Use Case Theme/Auth Dashboard/Enterprise Apps
Real-world Architecture
Context API
Theme
Auth User
Language
Permissions

<ThemeProvider>
<AuthProvider>
<App />
</AuthProvider>
</ThemeProvider>

Redux Toolkit
Products
Orders
Cart
Notifications
Dashboard Stats
API Cache

Redux Store
├── auth
├── cart
├── products
├── notifications
└── dashboard

Senior React Interview Answer

Use Context API + Custom Hooks for lightweight shared application state such as authentication, themes, language, and feature flags. Custom hooks encapsulate context access, improve reusability, and simplify refactoring. For larger applications with complex business state, frequent updates, and async API interactions, prefer Redux Toolkit because it provides predictable state management, createAsyncThunk, DevTools support, selective re-rendering through useSelector, and better scalability. Context is simpler, while Redux generally delivers better performance as application state grows.

Internal React interview materials and profiles in your enterprise data reference Context API, Redux Toolkit, Redux hooks (useSelector, useDispatch), performance optimisation, and using Context for shared application state such as themes.

1. Custom Hook Example for Theme Context

A common real-world use case for Context is managing application themes (dark/light mode).

ThemeContext.js
import {
createContext,
useState
} from "react";

export const ThemeContext =
createContext(null);

export function ThemeProvider({
children
}) {

const [theme, setTheme] =
useState("light");

const toggleTheme = () => {

    setTheme(prev =>
      prev === "light"
        ? "dark"
        : "light"
    );

};

return (
<ThemeContext.Provider
value={{
        theme,
        toggleTheme
      }} >
{children}
</ThemeContext.Provider>
);
}

useTheme.js (Custom Hook)
import {
useContext
} from "react";

import {
ThemeContext
} from "./ThemeContext";

export function useTheme() {

const context =
useContext(
ThemeContext
);

if (!context) {

    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );

}

return context;
}

ThemeToggle.jsx
import { useTheme }
from "./useTheme";

function ThemeToggle() {

const {
theme,
toggleTheme
} = useTheme();

return (
<>

<p>
Current Theme:
{theme}
</p>

      <button
        onClick={toggleTheme}
      >
        Toggle Theme
      </button>
    </>

);
}

App.jsx
import {
ThemeProvider
} from "./ThemeContext";

function App() {

return (
<ThemeProvider>
<ThemeToggle />
</ThemeProvider>
);
}

2. Redux Toolkit Middleware Benefits

Internal Redux discussions mention async operations, middleware, Redux Thunk, modular reducers, and Redux Toolkit usage.

What is Middleware?

Middleware sits between:

Dispatch
↓
Middleware
↓
Reducer

It intercepts actions before they reach reducers.

Benefits

1. Handle Async API Calls

Without middleware:

dispatch(fetchUsers());

Redux reducers must remain synchronous.

Solution:

createAsyncThunk()

or

Redux Thunk

2. API Request Lifecycle
   Pending
   ↓
   Success
   ↓
   Failure

Redux Toolkit automatically generates:

fetchUsers.pending
fetchUsers.fulfilled
fetchUsers.rejected

3. Logging

Custom middleware:

const logger =
store =>
next =>
action => {

    console.log(action);

    return next(action);

};

Useful for debugging.

4. Authentication

Middleware can:

Attach JWT
Refresh Token
Handle Expiry

before API calls.

5. Analytics

Track:

Button Clicks
Page Views
User Events

centrally.

6. Error Handling

Centralise:

401
403
500

handling in one place.

Example: createAsyncThunk
import {
createAsyncThunk
} from "@reduxjs/toolkit";

export const fetchUsers =
createAsyncThunk(
"users/fetch",

    async () => {

      const response =
        await fetch(
          "/api/users"
        );

      return response.json();
    }

);

3. Context API vs Redux – Use Cases Summary

Internal React interview material recommends Context for smaller/shared state and Redux for larger applications with more complex global state.

Use Context API When
Authentication
Current User
Login State
Logout

Theme
Dark Mode
Light Mode

Language
English
French
German

Feature Flags
Enable Chatbot
Enable Beta UI

Application Settings
Timezone
Currency
Region

Use Redux Toolkit When
E-commerce
Cart
Products
Orders
Checkout

Dashboard
Charts
Reports
Widgets
Metrics

Real-time Data
Notifications
WebSockets
Chat

Enterprise Applications
Permissions
Users
Roles
Menus
Global Search

API-heavy Applications
Caching
Pagination
Filtering
Server State

Performance Comparison
Area Context API Redux ToolkitSetup Simple Moderate
Learning Curve Easy Medium
Bundle Size Small Larger
Async APIs Manual Built-in (createAsyncThunk)
DevTools No Excellent
Large App Performance Medium Better
Re-render Optimisation Limited Better with useSelector
Best For Theme/Auth Enterprise State

Internal discussions specifically reference useSelector, useDispatch, feature-based Redux organisation, and performance optimisation techniques for larger state management scenarios.

Senior React Interview Answer

Context API is ideal for lightweight shared state such as themes, authentication, language, and application settings. I usually wrap Context inside custom hooks like useTheme() or useAuth() to improve encapsulation and reusability. Redux Toolkit is my preferred choice for large-scale applications because it provides a centralised store, middleware support, async handling with createAsyncThunk, DevTools integration, and selective updates through useSelector, which scales better as application complexity grows.

Internal React interview discussions mention Context consumption through hooks (useContext), Redux hooks (useDispatch, useSelector), Redux Toolkit, and performance optimisation using memoisation and selective subscriptions.

1. Custom Redux Toolkit Middleware Example

Middleware sits between:

dispatch(action)
↓
middleware
↓
reducer

Logging Middleware
// middleware/logger.js

export const loggerMiddleware =
(store) => (next) => (action) => {

    console.log(
      "Dispatching:",
      action.type
    );

    console.log(
      "Previous State:",
      store.getState()
    );

    const result = next(action);

    console.log(
      "Next State:",
      store.getState()
    );

    return result;

};

Authentication Middleware

Useful for:

JWT Validation
Refresh Token
Session Expiry

export const authMiddleware =
(store) => (next) => (action) => {

    const token =
      localStorage.getItem("token");

    if (
      !token &&
      action.type !== "auth/login"
    ) {

      console.warn(
        "User not authenticated"
      );
    }

    return next(action);

};

Register Middleware
import {
configureStore
} from "@reduxjs/toolkit";

import authReducer
from "./authSlice";

import {
loggerMiddleware
} from "./middleware/logger";

export const store =
configureStore({

    reducer: {
      auth: authReducer
    },

    middleware: (
      getDefaultMiddleware
    ) =>
      getDefaultMiddleware()
        .concat(
          loggerMiddleware
        )

});

Redux middleware is commonly used for async operations, logging, authentication, analytics, and centralised side-effect handling.

2. How to Optimise Context API Performance

One limitation of Context is that when a provider value changes, all consumers may re-render. Context is often recommended for smaller/shared application state such as themes or authentication.

❌ Common Problem
<AuthProvider>

  <Navbar />
  <Sidebar />
  <Dashboard />

</AuthProvider>

When:

user.name changes

all consumers can re-render.

✅ Split Contexts
Bad
<AppContext>

Contains:

Theme
User
Language
Permissions
Settings

Better
<ThemeProvider>
<AuthProvider>
<LanguageProvider>

Each concern has its own context.

Theme changes
↓
Only Theme Consumers

✅ Memoise Context Value
Bad
<AuthContext.Provider
value={{
   user,
   login,
   logout
 }}

>

New object on every render.

Better
const value = useMemo(
() => ({
user,
login,
logout
}),
[user]
);

return (
<AuthContext.Provider
value={value}

>

    {children}

</AuthContext.Provider>
);

✅ Memoise Expensive Consumers
const Dashboard =
React.memo(
function Dashboard() {
return (...)
}
);

Internal Redux/React discussions reference using React.memo, useMemo, and useCallback for performance optimisation.

✅ Memoise Callbacks
const login =
useCallback(
(user) => {
setUser(user);
},
[]
);

✅ Use Custom Hooks

Instead of:

useContext(AuthContext)

everywhere.

const { user } = useAuth();

Cleaner and easier to optimise.

3. Best Practices for Custom Hooks + Context
   ✅ Hide Context Implementation
   Avoid
   const auth =
   useContext(
   AuthContext
   );

Prefer
const {
user,
login
} = useAuth();

Encapsulation improves maintainability.

✅ Validate Provider Usage
export function useAuth() {

const context =
useContext(AuthContext);

if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

}

return context;
}

✅ Return Business API
Good
const {
login,
logout,
user
} = useAuth();

Bad
const authContext =
useAuth();

Keep the API focused.

✅ Use One Hook Per Domain
useAuth()
useTheme()
usePermissions()
useLanguage()
useCart()

✅ Keep Provider Logic Together
AuthContext
├── user
├── login()
└── logout()

Don't mix:

Theme
Auth
Permissions

in a single context.

✅ Use TypeScript (Recommended)
interface AuthContextType {
user: User | null;
login: (
user: User
) => void;
logout: () => void;
}

Context API vs Redux Performance Summary
Feature Context API Redux ToolkitSetup Easy Medium
Best For Theme, Auth, Settings Enterprise State
Re-renders Broader More Selective
DevTools No Yes
Async Handling Manual createAsyncThunk, RTK Query
Scalability Medium High
Large App Performance Good Better

Context is generally ideal for theme, authentication, language, and settings, while Redux Toolkit is typically preferred for large applications, dashboard state, notifications, shopping carts, and complex async workflows.

Senior React Interview Answer

Use custom hooks with Context to encapsulate shared state and expose a clean API (useAuth, useTheme). Optimise Context by splitting providers, memoising values with useMemo, memoising callbacks with useCallback, and using React.memo where appropriate. For large applications with frequent state updates and complex async flows, Redux Toolkit generally provides better scalability because components subscribe only to the state they need through useSelector.

1. Example: Using Multiple Context Providers

A common optimisation is to split Contexts by responsibility (Theme, Auth, Language, Permissions) rather than putting everything into one large Context. This reduces unnecessary re-renders and keeps state management cleaner.

Theme Context
// ThemeContext.js

import {
createContext,
useState
} from "react";

export const ThemeContext =
createContext();

export function ThemeProvider({
children
}) {

const [theme, setTheme] =
useState("light");

const toggleTheme = () => {
setTheme(current =>
current === "light"
? "dark"
: "light"
);
};

return (
<ThemeContext.Provider
value={{
        theme,
        toggleTheme
      }} >
{children}
</ThemeContext.Provider>
);
}

Auth Context
// AuthContext.js

import {
createContext,
useState
} from "react";

export const AuthContext =
createContext();

export function AuthProvider({
children
}) {

const [user, setUser] =
useState(null);

return (
<AuthContext.Provider
value={{
        user,
        setUser
      }} >
{children}
</AuthContext.Provider>
);
}

Language Context
// LanguageContext.js

import {
createContext,
useState
} from "react";

export const LanguageContext =
createContext();

export function LanguageProvider({
children
}) {

const [language, setLanguage] =
useState("en");

return (
<LanguageContext.Provider
value={{
        language,
        setLanguage
      }} >
{children}
</LanguageContext.Provider>
);
}

Combine Providers
function App() {

return (

    <AuthProvider>

      <ThemeProvider>

        <LanguageProvider>

          <Dashboard />

        </LanguageProvider>

      </ThemeProvider>

    </AuthProvider>

);
}

Custom Hooks
export const useAuth =
() => useContext(AuthContext);

export const useTheme =
() => useContext(ThemeContext);

export const useLanguage =
() => useContext(LanguageContext);

Usage:

function Header() {

const { user } = useAuth();
const { theme } = useTheme();

return (
<div>
{user?.name}
{theme}
</div>
);
}

2. Ways to Debug Redux Middleware

Redux Toolkit applications commonly use middleware for logging, async actions, authentication, analytics, and side-effect handling.

Method 1: Add Logger Middleware
const loggerMiddleware =
(store) =>
(next) =>
(action) => {

    console.group(action.type);

    console.log(
      "Previous State",
      store.getState()
    );

    console.log(
      "Action",
      action
    );

    const result =
      next(action);

    console.log(
      "Next State",
      store.getState()
    );

    console.groupEnd();

    return result;

};

Method 2: Log Action Flow
const middleware =
() =>
(next) =>
(action) => {

    console.log(
      "Before",
      action.type
    );

    const result =
      next(action);

    console.log(
      "After",
      action.type
    );

    return result;

};

Helpful for determining:

Action Received?
Middleware Executed?
Reducer Called?

Method 3: Redux DevTools

Use:

Redux DevTools Extension

Inspect:

Dispatched Actions
Action Payloads
Reducer Updates
State Changes
Execution Timeline

Redux Toolkit integrates very well with DevTools.

Method 4: Debug Async Thunks
export const fetchUsers =
createAsyncThunk(
"users/fetch",

    async () => {

      console.log(
        "API Started"
      );

      const response =
        await api.getUsers();

      console.log(
        "API Success"
      );

      return response.data;
    }

);

Watch:

pending
fulfilled
rejected

states.

Method 5: Breakpoints

Inside middleware:

const middleware =
() =>
(next) =>
(action) => {

    debugger;

    return next(action);

};

Use Chrome DevTools:

Sources
↓
Pause on Breakpoint
↓
Inspect Action

Method 6: Track Timing

Useful for performance debugging.

const perfMiddleware =
() =>
(next) =>
(action) => {

    const start =
      performance.now();

    const result =
      next(action);

    const end =
      performance.now();

    console.log(
      action.type,
      end - start,
      "ms"
    );

    return result;

};

Senior Interview Answer

For Context API, I typically split providers by domain such as AuthProvider, ThemeProvider, and LanguageProvider, then expose them through custom hooks like useAuth() and useTheme(). For Redux middleware debugging, I use Redux DevTools, logger middleware, action tracing, async thunk lifecycle logging (pending, fulfilled, rejected), browser breakpoints, and performance timing metrics to diagnose issues and monitor state transitions.

Redux Toolkit allows you to chain multiple middleware together. Middleware is commonly used for:

Logging
Authentication
API error handling
Analytics
Performance monitoring
Async actions (Thunk)

Enterprise React interview discussions reference Redux Toolkit, middleware, useDispatch, useSelector, async operations, and scalable Redux architecture.

Redux Middleware Execution Flow
dispatch(action)
↓
Logger Middleware
↓
Auth Middleware
↓
Analytics Middleware
↓
Redux Reducer
↓
Updated State

Middleware executes in the order it is registered.

1. Logger Middleware
   // middleware/loggerMiddleware.js

export const loggerMiddleware =
(store) =>
(next) =>
(action) => {

    console.group(action.type);

    console.log(
      "Previous State",
      store.getState()
    );

    console.log(
      "Action",
      action
    );

    const result =
      next(action);

    console.log(
      "Next State",
      store.getState()
    );

    console.groupEnd();

    return result;

};

2. Authentication Middleware
   // middleware/authMiddleware.js

export const authMiddleware =
(store) =>
(next) =>
(action) => {

    const token =
      localStorage.getItem("token");

    if (
      action.type.startsWith("admin/")
      && !token
    ) {

      console.warn(
        "Authentication required"
      );

      return;
    }

    return next(action);

};

3. Analytics Middleware
   // middleware/analyticsMiddleware.js

export const analyticsMiddleware =
() =>
(next) =>
(action) => {

    if (
      action.type ===
      "cart/addItem"
    ) {

      console.log(
        "Analytics Event:",
        action.type
      );
    }

    return next(action);

};

4. Performance Middleware
   // middleware/performanceMiddleware.js

export const performanceMiddleware =
() =>
(next) =>
(action) => {

    const start =
      performance.now();

    const result =
      next(action);

    const end =
      performance.now();

    console.log(
      `${action.type}
      took
      ${(end - start).toFixed(2)} ms`
    );

    return result;

};

5. Register Multiple Middleware
   import {
   configureStore
   } from "@reduxjs/toolkit";

import authReducer
from "./features/authSlice";

import {
loggerMiddleware
} from "./middleware/loggerMiddleware";

import {
authMiddleware
} from "./middleware/authMiddleware";

import {
analyticsMiddleware
} from "./middleware/analyticsMiddleware";

import {
performanceMiddleware
} from "./middleware/performanceMiddleware";

export const store =
configureStore({

    reducer: {
      auth: authReducer
    },

    middleware:
      (getDefaultMiddleware) =>

        getDefaultMiddleware()

          .concat(
            loggerMiddleware
          )

          .concat(
            authMiddleware
          )

          .concat(
            analyticsMiddleware
          )

          .concat(
            performanceMiddleware
          )

});

Using prepend() for Priority Middleware

Some middleware should execute before Redux Thunk.

middleware:
(getDefaultMiddleware) =>

getDefaultMiddleware()

    .prepend(
      authMiddleware
    )

    .concat(
      loggerMiddleware
    );

Execution:

Auth Middleware
↓
Redux Thunk
↓
Logger Middleware
↓
Reducer

Real-World Enterprise Setup
middleware:
(getDefaultMiddleware) =>

getDefaultMiddleware()

.prepend(
authMiddleware
)

.concat(
loggerMiddleware
)

.concat(
analyticsMiddleware
)

.concat(
performanceMiddleware
);

Purpose:

Auth Middleware
→ Token Validation

Logger Middleware
→ Debugging

Analytics Middleware
→ User Tracking

Performance Middleware
→ Slow Action Detection

Redux Thunk
→ API Calls

Example Dispatch
dispatch({
type: "cart/addItem",
payload: {
id: 1,
name: "Laptop"
}
});

Middleware execution:

1. Auth Middleware
2. Logger Middleware
3. Analytics Middleware
4. Performance Middleware
5. Reducer
6. Store Updated

Senior React Interview Answer

In Redux Toolkit, I typically combine multiple middleware using getDefaultMiddleware().concat() or prepend(). Common middleware include authentication, logging, analytics, performance monitoring, and async middleware such as Redux Thunk. Splitting responsibilities across middleware keeps reducers pure, improves maintainability, and makes debugging and observability easier in large enterprise applications.
