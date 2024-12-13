// In large web applications that offers different tiers of services based on the plans chosen by the end user. We have to dynamically enable UI features and for that, we will be consuming an API that will give us the features list that will help to decide what has to be enabled or not.

// Now these features have to be centralized as this will be used across the application codebase and it will be wise to have logic abstracted to a single place so that we have a single source of truth that will consume the API and return the features set.

// In React to implement this feature set, we are going to use the context API that will cache the features and then using useContext hook we can access it anywhere in the components.


//FeatureFlag.js
import React, { useState } from "react";

export const FeatureFlag = React.createContext({});

export const FeatureFlagProvider = ({ children }) => {
  const [features, setFeatures] = useState({
    darkMode: true,
    chatEnabled: false
  });

  return (
    <FeatureFlag.Provider value={{ features }}>{children}</FeatureFlag.Provider>
  );
};


// Here we have created a new context FeatureFlag and then a component FeatureFlagProvider that will help us to use the FeatureFlag within the components given that they are wrapped under FeatureFlagProvider.

// You can make the API call in the FeatureFlagProvider and store the result in the state and it will be accessible to all the child components.

// Also, you cache the result in the local storage to improve the performance.


import { FeatureFlagProvider, FeatureFlag } from "./FeatureFlag";

export default function App() {
  return (
    <FeatureFlagProvider>
      <Example />
    </FeatureFlagProvider>
  );
}


const Example = () => {
    const { features } = React.useContext(FeatureFlag);
  
    return (
      <>
        {features.darkMode ? " in Dark Mode " : " in Light Mode"}
      </>
    );
  };

  const Feature = ({ feature, children, value }) => {
    const { features } = React.useContext(FeatureFlag);
    return features[feature] === value ? children : null;
  };
  
  const Example = () => {
    return (
      <>
        <Feature feature="darkMode" value={true}>
          in Dark Mode
        </Feature>
        <Feature feature="chatEnabled" value={true}>
          <Chat />
        </Feature>
      </>
    );
  };