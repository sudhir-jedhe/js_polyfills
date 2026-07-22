Since you're preparing for **Senior/Lead React interviews**, "React Microservices" usually means **how React applications interact with a microservices backend** and often extends to **Micro-Frontend architecture**. Enterprise materials in your organisation also reference React-based micro-frontends, API gateways, distributed tracing, correlation IDs, and observability as common patterns. [[TD_API_Eng...ring_Final | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4F6C3508-6380-4200-9858-3BD259717E3B%7D&file=TD_API_Engineering_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[Persistent...y response | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BB8DC8BD6-2E26-4528-8827-3F3E032A1303%7D&file=Persistent%20Metamo%20API%20gateway%20response.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[Rashmi_FullStack_7.1 | PDF]](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/Rashmi_FullStack_7.1.pdf?web=1)

# React + Microservices Architecture

                React App

                     │

              API Gateway / BFF

                     │

┌──────────────┬─────────────┬──────────────┐

│              │             │              │

User Service  Order Service Payment Service Notification

│              │             │              │

DB            DB            DB            DB

Microservices communicate through APIs, while React consumes those services through a gateway or Backend-for-Frontend (BFF) layer. [[code-b.dev]](https://code-b.dev/blog/microservices-with-nodejs-and-react), [[Persistent...P_20260306 | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Common Interview Question 1

### Why shouldn't React call 20 microservices directly?

### Bad

React

├── User Service

├── Product Service

├── Order Service

├── Payment Service

└── Notification Service

Problems:

- Too many network calls
- Security exposure
- Complex frontend
- Versioning issues

### Better

React

   │

   ▼

BFF/API Gateway

   │

   ├── User Service

   ├── Product Service

   ├── Order Service

   └── Payment Service

API Gateway patterns are widely used in enterprise microservice architectures. [[TD_API_Eng...ring_Final | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4F6C3508-6380-4200-9858-3BD259717E3B%7D&file=TD_API_Engineering_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[Persistent...P_20260306 | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

### Interview Answer

> React should ideally communicate with an API Gateway or BFF layer instead of directly calling every microservice because it reduces network chatter, centralises security, simplifies API evolution, and enables response aggregation.

---

# Common Interview Question 2

### How do you manage state when data comes from multiple microservices?

### Solution

Use:

Redux Toolkit

RTK Query

React Query

Context API

Example:

const {

  data:user

} = useQuery({

  queryKey: ['user'],

  queryFn: fetchUser

});

Benefits:

Caching

Retry

Background Refresh

Deduplication

---

# Common Interview Question 3

### How do you handle failures?

User Service  ✅

Order Service ✅

Payment Service ❌

Return:

Show available widgets

Display fallback for failed widget

Use:

<ErrorBoundary>

  <PaymentWidget />

</ErrorBoundary>

Never fail the entire dashboard.

---

# Micro-Frontend Architecture

Many React organisations now use **Micro Frontends**, which extend microservice principles to the UI. React applications are split into independently deployable frontend modules. [[bing.com]](https://bing.com/search?q=React+microservices+architecture), [[dev.to]](https://dev.to/devsmitra/the-complete-guide-to-micro-frontend-with-reactjs-for-2022-36b2)

Example:

Shell App

   │

   ├── Product MFE

   ├── Cart MFE

   ├── Checkout MFE

   └── Profile MFE

Your organisation contains multiple references to React Micro-Frontend experience and migrations from legacy applications to micro-frontend architectures. [[Devendra_Resume 1 | PDF]](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/Devendra_Resume%201.pdf?web=1), [[Legacy .NE...Migration | PowerPoint]](https://persistentsystems.sharepoint.com/sites/intranet/SASVA/_layouts/15/Doc.aspx?sourcedoc=%7B7E7FF325-D333-4CD9-B693-0A5BA6DE5B40%7D&file=Legacy%20.NET%20Migration.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

---

# Module Federation (Most Asked Topic)

new ModuleFederationPlugin({

  name: "productApp",

  exposes: {

    "./Product":

      "./src/Product"

  }

});

Host application:

const Product =

  React.lazy(

    () => import("productApp/Product")

  );

Webpack Module Federation is one of the most common implementations of React micro-frontends. [[bing.com]](https://bing.com/search?q=React+microservices+architecture), [[dev.to]](https://dev.to/devsmitra/the-complete-guide-to-micro-frontend-with-reactjs-for-2022-36b2)

---

# Communication Between MFEs

## Event Bus Pattern

window.dispatchEvent(

  new CustomEvent(

    'cart-updated',

    {

      detail: cart

    }

  )

);

Listening:

window.addEventListener(

  'cart-updated',

  handler

);

Benefits:

Loose Coupling

Framework Agnostic

Independent Deployment

---

# Observability in React Microservices

Enterprise architectures increasingly emphasize:

Correlation IDs

Distributed Tracing

OpenTelemetry

Datadog

Application Insights

for tracing requests across React, gateways, APIs, and databases. [[We are loo...ty for a m | Viva Engage]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMzQ5MTAxMjUxMTc4NDk2MCJ9), [[Persistent...y response | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BB8DC8BD6-2E26-4528-8827-3F3E032A1303%7D&file=Persistent%20Metamo%20API%20gateway%20response.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[OpenTeleme...or buildin | Viva Engage]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMzI3MjU2MDU4MTc1NDg4MCJ9), [[Netskope-P...e_Jan 2025 | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B8DD4B758-3F20-4049-98C5-0D940FA15C88%7D&file=Netskope-Persistent_Work%20Stream-360%20Degree_Jan%202025.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

Request flow:

React

↓

Gateway

↓

Order Service

↓

Payment Service

↓

Database

Every request carries:

X-Correlation-ID

allowing end-to-end debugging. [[Persistent...y response | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BB8DC8BD6-2E26-4528-8827-3F3E032A1303%7D&file=Persistent%20Metamo%20API%20gateway%20response.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[TD_API_Eng...ring_Final | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4F6C3508-6380-4200-9858-3BD259717E3B%7D&file=TD_API_Engineering_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

---

# Tricky Staff Engineer Interview Question

### "Two Micro Frontends use different React versions. How would you handle it?"

Expected discussion:

Module Federation

Shared Dependencies

Singleton React

Version Strategy

Independent Deployments

Example:

shared: {

  react: {

    singleton: true

  },

  "react-dom": {

    singleton: true

  }

}

---

# 2-Minute Interview Answer

> React itself is not a microservice; it serves as the presentation layer over a microservices ecosystem. In large-scale systems, React communicates with backend microservices through an API Gateway or BFF layer. For frontend scalability, I prefer Micro-Frontend architecture using Module Federation, allowing independent teams to build and deploy features separately. State management is handled through React Query or Redux Toolkit, while observability relies on correlation IDs, distributed tracing, and monitoring platforms such as Application Insights or Datadog. This approach improves team autonomy, scalability, deployment independence, and system reliability. [[bing.com]](https://bing.com/search?q=React+microservices+architecture), [[TD_API_Eng...ring_Final | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4F6C3508-6380-4200-9858-3BD259717E3B%7D&file=TD_API_Engineering_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[Persistent...y response | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BB8DC8BD6-2E26-4528-8827-3F3E032A1303%7D&file=Persistent%20Metamo%20API%20gateway%20response.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[OpenTeleme...or buildin | Viva Engage]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMzI3MjU2MDU4MTc1NDg4MCJ9)

# Senior-Level Follow-up Questions

1.  How would you share authentication across Micro Frontends?
2.  How do you avoid duplicate React bundles in Module Federation?
3.  How do you implement distributed tracing from React → API Gateway → Microservices?
4.  How would you migrate a monolithic React application to Micro Frontends?
5.  How do you manage state across independently deployed MFEs?
6.  # Interview Question:

### **How would you share authentication across Micro Frontends?**

This is a very common **Senior/Staff React Architect** question because authentication is one of the hardest problems in Micro-Frontend (MFE) architectures.

---

# Recommended Architecture

                Identity Provider

              (Azure AD / Auth0 / Okta)

                         │

                         ▼

                  Shell / Host App

                         │

          ┌──────────────┼──────────────┐

          ▼              ▼              ▼

     Product MFE    Cart MFE     Profile MFE

The **Shell Application** is responsible for authentication, and child MFEs consume the authenticated state rather than implementing login independently. This aligns with common micro-frontend approaches where a host/container application coordinates shared concerns while independently deployed frontend modules focus on business features. [[learncodew...urgesh.com]](https://learncodewithdurgesh.com/tutorials/react-handbook/react-api-integration-top-interview-questions-answers)

---

# Approach 1: Shared Authentication in Shell (Recommended)

### Login Flow

User Login

   ↓

Shell Authenticates

   ↓

Receives Access Token

   ↓

Stores Token Securely

   ↓

MFEs Consume Auth State

React MFEs never perform separate logins.

Benefits:

✅ Single Sign-On (SSO)

✅ Centralised security

✅ Consistent user experience

✅ Easier token refresh

---

# Approach 2: Shared Auth Context

Shell exposes:

<AuthProvider>

   <ProductMFE />

   <CartMFE />

</AuthProvider>

Example:

const AuthContext =

  createContext();

export const useAuth =

  () => useContext(AuthContext);

MFE:

const { user } = useAuth();

---

# Approach 3: Module Federation Shared Auth Library

Expose:

shared: {

  react: {

    singleton: true

  },

  auth: {

    singleton: true

  }

}

Shared package:

@company/auth

Contains:

- Login logic
- Token handling
- Refresh token logic
- User roles

This avoids duplicating authentication code across MFEs and fits well with Module Federation-based micro-frontends. [[learncodew...urgesh.com]](https://learncodewithdurgesh.com/tutorials/react-handbook/react-api-integration-top-interview-questions-answers), [[crsinfosolutions.com]](https://crsinfosolutions.com/react-js-apis-interview-questions/)

---

# Token Storage Best Practice

### Avoid

localStorage

Problems:

XSS risks

Token theft

### Prefer

HTTP Only Cookies

Benefits:

Not accessible via JavaScript

More secure

---

# Role-Based Access Control (RBAC)

Store claims:

{

  "userId": 123,

  "roles": [

    "Admin",

    "Manager"

  ]

}

Shell decides:

<ProtectedRoute

  role="Admin"

/>

``

MFE should not independently determine authorisation rules.

---

# Handling Token Refresh

Only Shell manages:

Access Token

Refresh Token

When token expires:

Shell

  ↓

Refresh Token

  ↓

Update Auth Context

  ↓

MFEs Receive New State

Child MFEs remain unaware of refresh mechanics.

---

# Communication Between MFEs

Instead of every MFE storing auth data:

window.dispatchEvent(

  new CustomEvent(

    "auth-changed",

    {

      detail: user

    }

  )

);

or use a shared event bus.

This maintains loose coupling between independently deployed MFEs. [[learncodew...urgesh.com]](https://learncodewithdurgesh.com/tutorials/react-handbook/react-api-integration-top-interview-questions-answers)

---

# Enterprise SSO Flow

React Shell

    ↓

Azure AD / Okta

    ↓

JWT Token

    ↓

API Gateway

    ↓

Microservices

Backend services:

Validate JWT

Check Claims

Authorize Request

Enterprise architectures commonly place authentication and authorisation at gateway and service boundaries rather than within individual frontend modules.

---

# Tricky Follow-up Question

### What if Product MFE is developed by Team A and Cart MFE by Team B?

**Answer:**

- Shared Identity Provider
- Shared Auth SDK
- Shared Token Validation
- Independent deployment
- No duplicate login screens

Each team owns business functionality, but authentication remains centralised.

---

# Staff Engineer / Architect Answer

> In a Micro-Frontend architecture, I centralise authentication in the Shell application and integrate with an enterprise Identity Provider such as Azure AD, Auth0, or Okta. The Shell handles login, token refresh, role management, and session state. Authentication information is shared with individual MFEs through a shared Auth Provider, Module Federation shared libraries, or an event bus. Tokens are stored securely using HTTP-only cookies, and backend services validate JWTs through the API Gateway. This approach provides true SSO, avoids duplicated authentication logic, and keeps MFEs independently deployable while maintaining a consistent security model. [[learncodew...urgesh.com]](https://learncodewithdurgesh.com/tutorials/react-handbook/react-api-integration-top-interview-questions-answers), [[crsinfosolutions.com]](https://crsinfosolutions.com/react-js-apis-interview-questions/)

### Interviewer's Favourite Follow-up

**"How would you implement authentication when some MFEs are React and others are Angular?"**

Expected topics:

- Identity Provider (Azure AD/Okta)
- OAuth2/OIDC
- Shared cookies
- JWT propagation
- Framework-agnostic auth SDK
- Event-driven auth state synchronisation

# Interview Question:

### **How do you avoid duplicate React bundles in Module Federation?**

This is one of the **most common Micro-Frontend interview questions** because duplicate React instances can cause:

Invalid Hook Call Errors

Context Issues

Increased Bundle Size

Memory Overhead

Performance Problems

Enterprise interview evaluations within your organisation specifically mention runtime failures caused by multiple React versions being loaded between the host and micro-frontend, and the solution was to configure shared dependencies correctly and ensure a single React version across modules. [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

# Why Duplicate React Happens

Consider:

Host App

  └── React 18

Product MFE

  └── React 18

Cart MFE

  └── React 18

Without sharing:

Host Bundle

- React

Product Bundle

- React

Cart Bundle

- React

The browser loads React multiple times.

Result:

3 React Instances

This often leads to:

Invalid Hook Call

Context Not Shared

useState Errors

The Module Federation documentation explains that without singleton sharing, each application can load its own dependency version. [[module-federation.io]](https://module-federation.io/configure/shared), [[webpack.js.org]](https://webpack.js.org/plugins/module-federation-plugin/)

---

# Solution 1: Share React as a Singleton

Host:

new ModuleFederationPlugin({

  shared: {

    react: {

      singleton: true

    },

    "react-dom": {

      singleton: true

    }

  }

});

Remote:

new ModuleFederationPlugin({

  shared: {

    react: {

      singleton: true

    },

    "react-dom": {

      singleton: true

    }

  }

});

`singleton: true` ensures that only one runtime instance of React is used across all micro-frontends. [[module-federation.io]](https://module-federation.io/configure/shared), [[micro-fron...ecture.com]](https://www.micro-frontend-architecture.com/webpack-vite-module-federation-implementation/managing-shared-dependencies-at-runtime/sharing-singletons-across-webpack-and-vite-remotes/)

---

# Solution 2: Enforce Version Compatibility

const deps =

require("./package.json")

   .dependencies;

shared: {

  react: {

    singleton: true,

    requiredVersion:

      deps.react

  },

  "react-dom": {

    singleton: true,

    requiredVersion:

      deps["react-dom"]

  }

}

Benefits:

Version Consistency

Reduced Runtime Conflicts

Safer Deployments

Module Federation supports `requiredVersion` to ensure compatible shared dependency versions are used. [[module-federation.io]](https://module-federation.io/configure/shared), [[micro-fron...ecture.com]](https://www.micro-frontend-architecture.com/webpack-vite-module-federation-implementation/managing-shared-dependencies-at-runtime/sharing-singletons-across-webpack-and-vite-remotes/)

---

# Solution 3: Centralise Shared Libraries

Do not only share:

React

ReactDOM

Also share:

Redux

React Router

Design System

Authentication SDK

Component Library

Example:

shared: {

  react: {

    singleton: true

  },

  "react-dom": {

    singleton: true

  },

  "react-router-dom": {

    singleton: true

  },

  "@company/ui": {

    singleton: true

  }

}

An internal micro-frontend interview record explicitly recommends careful management of shared libraries such as React versions and UI libraries to avoid duplication and conflicts. [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

# Solution 4: Runtime Verification

Open browser DevTools:

**webpack_share_scopes**

Check:

react

react-dom

Only one version should exist.

---

# Solution 5: CI/CD Dependency Checks

Add validation:

npm ls react

or

yarn why react

Pipeline should fail if unexpected versions appear.

Internal interview practices also mention dependency checks, shared configuration reviews, and CI/CD validation to catch version conflicts early. [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

# Real Production Example

### Wrong

Host App       React 18.2

Cart MFE       React 18.1

Product MFE    React 17

Outcome:

Hooks Fail

Context Breaks

Rendering Errors

### Correct

Host App       React 18.2

Cart MFE       Shared

Product MFE    Shared

Outcome:

Single React Runtime

Shared Context

Stable Hooks

Smaller Bundles

---

# Additional Optimisation

### Lazy Load Remotes

const Product =

  React.lazy(

    () => import("product/Product")

  );

Benefits:

Smaller Initial Bundle

Faster First Load

---

# Tricky Follow-Up Question

### "Why do hooks fail when multiple React versions are loaded?"

**Answer:**

React maintains an internal hook registry.

If:

Host uses React A

Remote uses React B

then:

useState()

useEffect()

useContext()

operate against different React runtimes.

Result:

Invalid Hook Call

This exact issue is described in both Module Federation guidance and internal micro-frontend debugging scenarios. [[dev.to]](https://dev.to/srinu_desetti/module-federation-shared-dependencies-singleton-guide-3167), [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

# Staff Engineer / Architect Answer

> To avoid duplicate React bundles in Module Federation, I configure React and ReactDOM as shared singleton dependencies with strict version alignment using `requiredVersion`. The host application becomes the primary provider, while remotes consume the shared instance. I also share common libraries such as React Router, Redux, authentication SDKs, and design systems. Finally, I enforce dependency consistency through CI/CD validation and regularly verify the shared scope at runtime. This prevents invalid hook call errors, reduces bundle size, and ensures a consistent React runtime across all micro-frontends. [[module-federation.io]](https://module-federation.io/configure/shared), [[micro-fron...ecture.com]](https://www.micro-frontend-architecture.com/webpack-vite-module-federation-implementation/managing-shared-dependencies-at-runtime/sharing-singletons-across-webpack-and-vite-remotes/), [[AI_Intevie...a_00003253 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

### One-Line Interview Answer

> **Use Module Federation's `shared` configuration with `singleton: true` and aligned React versions so that all micro-frontends consume a single React runtime instead of shipping their own copies.** [[module-federation.io]](https://module-federation.io/configure/shared), [[micro-fron...ecture.com]](https://www.micro-frontend-architecture.com/webpack-vite-module-federation-implementation/managing-shared-dependencies-at-runtime/sharing-singletons-across-webpack-and-vite-remotes/)
>
> These are **Staff Engineer / Architect-level Module Federation questions** that interviewers ask after basic micro-frontend discussions.

---

# 1\. Shared Library Version Management in Module Federation

## Problem

Different MFEs often use different versions of the same library.

Host App      React 18.2

Product MFE   React 18.2

Cart MFE      React 18.1

Profile MFE   React 17

Without proper sharing:

Multiple React Bundles

Context Failures

Hook Errors

Larger Downloads

Module Federation provides `singleton` and `requiredVersion` options to manage shared dependency versions. [[codeforgeek.com]](https://codeforgeek.com/react-interview-questions/), [[Questions List-React | Word]](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B503FEF1D-75E6-4647-8F2A-781DBF3278BA%7D&file=Questions%20List-React.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

## Recommended Configuration

### Host

const deps =

  require('./package.json')

     .dependencies;

shared: {

  react: {

    singleton: true,

    requiredVersion: deps.react

  },

  "react-dom": {

    singleton: true,

    requiredVersion:

      deps["react-dom"]

  }

}

### Remote

shared: {

  react: {

    singleton: true

  },

  "react-dom": {

    singleton: true

  }

}

This ensures that only one React runtime is loaded and version compatibility is checked. [[codeforgeek.com]](https://codeforgeek.com/react-interview-questions/), [[crsinfosolutions.com]](https://crsinfosolutions.com/react-js-apis-interview-questions/)

---

## Governance Strategy

In large organisations:

Shared UI Library

Shared Auth Library

Shared React Version

Shared Router Version

Maintain:

Company Dependency Matrix

Example:

{

  "react": "18.2.0",

  "react-router-dom": "6.28.0"

}

Internal micro-frontend guidance specifically mentions standardising React versions and shared libraries to avoid conflicts. [[Animesh Sh...Evaluation | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1)

---

## CI/CD Validation

Build pipeline:

npm ls react

Fail deployment if:

Multiple React Versions

are detected.

---

# 2\. How to Debug React Hook Errors in Micro-Frontends

### Common Error

Invalid Hook Call

``

Typical message:

Hooks can only be called inside

the body of a function component

One of the most common causes in Module Federation is duplicate React instances. [[React Mast...ass 14July | Meeting]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NABGAAAAAABcrsrWRWaVTK6qyZLD-eG4BwDrkFfTN2zeS6-g3xiqVga9AAAAAAENAADrkFfTN2zeS6-g3xiqVga9AAKEXXMqAAA%3d), [[Animesh Sh...Evaluation | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1)

---

## Debugging Checklist

### Step 1: Verify React Versions

Host:

npm ls react

Remote:

npm ls react

Check:

Host  → React 18.2

Remote → React 18.2

---

### Step 2: Verify Shared Scope

Open browser console:

**webpack_share_scopes**

Look for:

react

react-dom

There should ideally be one shared instance. [[React Mast...ass 14July | Meeting]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NABGAAAAAABcrsrWRWaVTK6qyZLD-eG4BwDrkFfTN2zeS6-g3xiqVga9AAAAAAENAADrkFfTN2zeS6-g3xiqVga9AAKEXXMqAAA%3d), [[codeforgeek.com]](https://codeforgeek.com/react-interview-questions/)

---

### Step 3: Check Module Federation Config

Incorrect:

shared: {

  react: {}

}

Correct:

shared: {

  react: {

    singleton: true

  }

}

---

### Step 4: Verify Context Providers

Bad:

Host Context

Remote Context

``

Two providers:

Two States

Problem:

useContext()

returns unexpected values.

Ensure:

Shared React Runtime

Shared Context Provider

---

### Step 5: Bundle Analysis

Use:

webpack-bundle-analyzer

Check whether:

react

react-dom

appear multiple times.

---

# Real Interview Scenario

### Question

> A Micro Frontend works independently but crashes when loaded into the host application.

### Likely Answer

1.  Check React versions
2.  Verify singleton sharing
3.  Verify shared dependencies
4.  Inspect Webpack share scope
5.  Run bundle analysis
6.  Check context providers

This mirrors a debugging scenario documented in internal micro-frontend interview evaluations. [[Animesh Sh...Evaluation | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1)

---

# 3\. Best Practices for Lazy Loading Micro-Frontends

## Why Lazy Load?

Without lazy loading:

Host

- Product MFE

- Cart MFE

- Profile MFE

- Reports MFE

Initial bundle becomes huge.

---

## Use React.lazy

const Product =

  React.lazy(() =>

    import("product/Product")

  );

Render:

<Suspense

  fallback={<Loader />}

>

  <Product />

</Suspense>

---

## Route-Based Lazy Loading

Good:

/checkout

   ↓

Load Checkout MFE

/orders

   ↓

Load Orders MFE

Do not load all MFEs at startup.

---

## Prefetch Critical MFEs

Example:

User viewing Cart

Preload:

Checkout MFE

before navigation.

Benefits:

Faster Route Changes

Improved UX

---

## Error Boundaries

Never trust remote applications.

<ErrorBoundary>

   <RemoteModule />

</ErrorBoundary>

If remote fails:

Host Continues Working

---

## Loading States

Avoid blank screens.

<Suspense

fallback={<Skeleton />}

>

Use:

Skeleton Loader

Progress Indicator

---

## Performance Monitoring

Measure:

Remote Load Time

Chunk Download Time

TTFB

LCP

Error Rate

Observability-first architectures commonly use distributed tracing, telemetry, dashboards, and monitoring to track frontend and backend performance. [[Questions List-React | Word]](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B503FEF1D-75E6-4647-8F2A-781DBF3278BA%7D&file=Questions%20List-React.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[Animesh Sh...Evaluation | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1), [[nodejs-interview | Excel]](https://persistentsystems-my.sharepoint.com/personal/sheetal_raikar_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B75A2E3B9-D886-4BD8-8FED-25E254D3BADC%7D&file=nodejs-interview.xlsx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Architect-Level Answer

> For Module Federation, I manage shared library versions by enforcing singleton dependencies and standardised version policies across all micro-frontends. When debugging hook errors, the first thing I check is whether multiple React runtimes are loaded by inspecting shared scopes, bundle analysis, and dependency trees. For performance, I lazy-load micro-frontends using route-based loading and React Suspense, add error boundaries around remotes, prefetch critical modules, and monitor load times through observability tooling. This approach minimises bundle size, prevents runtime conflicts, and enables independent deployment at scale. [[codeforgeek.com]](https://codeforgeek.com/react-interview-questions/), [[crsinfosolutions.com]](https://crsinfosolutions.com/react-js-apis-interview-questions/), [[Animesh Sh...Evaluation | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1), [[Questions List-React | Word]](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B503FEF1D-75E6-4647-8F2A-781DBF3278BA%7D&file=Questions%20List-React.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

### Interviewer's Favourite Follow-Up

**"How would you implement shared state between independently deployed Micro Frontends without introducing tight coupling?"**

Expected topics:

- Event Bus
- Custom Events
- Redux in Shell
- RxJS
- Shared State Service
- URL-based state synchronisation
- Module Federation shared store pattern

1. Shared State Management Across MFEs

One of the biggest mistakes in Micro Frontends is trying to share too much state.

Rule of Thumb

✅ Share only global state

User
Authentication
Theme
Language
Permissions

❌ Don't share feature state

Cart Filters
Table Sorting
Form Drafts
Local Component State

Best-practice guidance for micro-frontends emphasises maintaining loose coupling and using shared state only when necessary, often through shared state mechanisms or event-based communication.

Approach 1: Shared Redux Store (Most Common)

Shell exposes Store:

// shell/store.js

export const store =
configureStore({
reducer: {
auth: authReducer,
theme: themeReducer
}
});

Host:

new ModuleFederationPlugin({
exposes: {
"./store": "./src/store"
}
});

Remote:

import { store }
from 'shell/store';

store.dispatch(
updateTheme("dark")
);

Pros
Single Source of Truth
Redux DevTools
Predictable State

Cons
Tighter Coupling
Version Dependency
Schema Dependency

Use only for:

Authentication
User Session
Theme

Approach 2: Event Bus (Recommended)

For independent MFEs:

Product MFE
↓
Event Bus
↓
Cart MFE

No direct dependency.

Internal micro-frontend communication guidance explicitly describes event emitters and custom events as a common way for MFEs to communicate while remaining independently deployable.

Custom Event Bus Example
eventBus.js
class EventBus {
emit(event, data) {
window.dispatchEvent(
new CustomEvent(event, {
detail: data
})
);
}

on(event, callback) {
window.addEventListener(
event,
callback
);
}

off(event, callback) {
window.removeEventListener(
event,
callback
);
}
}

export default new EventBus();

Product MFE
import eventBus
from './eventBus';

const addToCart = product => {

eventBus.emit(
"cart:add",
product
);

};

Cart MFE
eventBus.on(
"cart:add",
event => {

    console.log(
      event.detail
    );

}
);

Flow
Product MFE
↓
cart:add
↓
Event Bus
↓
Cart MFE

Benefits:

Loose Coupling
Independent Deployments
Technology Agnostic

This aligns with enterprise micro-frontend communication guidance recommending event buses and custom browser events.

Approach 3: URL State

Useful for routing information.

/orders?customer=123

Shared via:

useSearchParams()

Suitable for:

Filters
Tabs
Selected Items

Internal micro-frontend guidance also highlights query-string based communication as a potential mechanism.

Approach 4: Browser Storage
localStorage.setItem(
"token",
token
);

Use only for:

Authentication
Preferences
Theme

Guidance notes that local storage, session storage, and cookies can be used when MFEs operate under the same subdomain.

2. Error Boundaries in Lazy Loaded MFEs
   Problem

Remote module fails.

Network Failure
Bundle Missing
Version Conflict
Remote Crashed

Without protection:

Whole Application Crashes

Error Boundary
class ErrorBoundary
extends React.Component {

constructor(props) {
super(props);

    this.state = {
      hasError: false
    };

}

static getDerivedStateFromError() {
return {
hasError: true
};
}

render() {

    if(this.state.hasError){
      return (
        <div>
          Widget unavailable
        </div>
      );
    }

    return this.props.children;

}
}

Error boundaries should be responsible for UI rendering failures, while API failures should be handled separately.

Lazy Loaded Remote with Error Boundary
const ProductMFE =
React.lazy(() =>
import(
"product/ProductApp"
)
);

function App() {

return (
<ErrorBoundary>

      <Suspense
        fallback={
          <Loader />
        }
      >
        <ProductMFE />
      </Suspense>

    </ErrorBoundary>

);

}

Failure Scenarios
Scenario 1
remoteEntry.js unavailable

Result:

Fallback UI

Scenario 2
Product MFE crashes

Result:

Product Widget Fails
Cart Still Works

Production-Grade MFE Wrapper
function RemoteWrapper({
children,
mfName
}) {

return (
<ErrorBoundary
fallback={
<div>
{mfName}
unavailable
</div>
} >
<Suspense
fallback={
<Skeleton />
} >
{children}
</Suspense>
</ErrorBoundary>
);
}

Usage:

<RemoteWrapper
mfName="Product"

>    <ProductMFE />
> </RemoteWrapper>

Architect Interview Answer

For shared state across Micro Frontends, I minimise coupling by sharing only global concerns such as authentication, theme, and user context. Most feature-level communication is implemented using an event bus based on Custom Events rather than a shared Redux store. For resilience, every lazy-loaded MFE is wrapped with React Suspense and an Error Boundary so failures in one remote do not crash the entire application. This preserves team autonomy, improves fault isolation, and allows independent deployment of MFEs.

Staff-Level Follow-Up Questions
How would you implement authentication and RBAC across multiple MFEs?
How would you trace a user journey across MFEs using OpenTelemetry?
How would you version shared contracts in event-driven MFE communication?
How would you migrate a Redux monolith to an event-driven micro-frontend architecture?
