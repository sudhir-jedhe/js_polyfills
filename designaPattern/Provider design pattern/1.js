const FeatureContext = React.createContext()
 
function App() {
  const features = { ... };
 
  return (
    <div>
      <FeatureContext.Provider value={features}>
        <Main />
        <SideBar />
      </FeatureContext.Provider>
    </div>
  )
}


const FeatureContext = React.createContext();
const Main = () => {
  const { features } = React.useContext(FeatureContext);
  return features.isGooglePayEnabled ? <GooglePay /> : <ApplePay />;
}




import React, { useEffect, useState } from "react";

export const FeatureFlag = React.createContext({});

export const FeatureFlagProvider = ({ children }) => {
  const [features, setFeatures] = useState({
    darkMode: true,
    chatEnabled: false
  });

  useEffect(() => {
    // make api call to get features list
    // and update the state on mount
  }, []);

  return (
    <FeatureFlag.Provider value={{ features }}>{children}</FeatureFlag.Provider>
  );
};

const ChatWrapper = () => {
  const { features } = React.useContext(FeatureFlag);
  return features.isChatEnabled ? <Chat /> : null;
};

const App = () => {
  return (
    <FeatureFlagProvider>
      <ChatWrapper />
    </FeatureFlagProvider>
  );
};


/********************************************* */

// To implement a FeatureFlag class for managing feature flags in an application, you can store feature flags as key-value pairs and provide methods to enable, disable, and check the status of features. Here's a basic implementation:

class FeatureFlag {
  constructor() {
      this.flags = new Map();
  }

  enableFeature(feature) {
      this.flags.set(feature, true);
  }

  disableFeature(feature) {
      this.flags.set(feature, false);
  }

  isFeatureEnabled(feature) {
      return this.flags.get(feature) || false;
  }
}

// Example usage:
const featureFlag = new FeatureFlag();

// Enable a feature
featureFlag.enableFeature('newFeature');

// Check if a feature is enabled
console.log('Is newFeature enabled?', featureFlag.isFeatureEnabled('newFeature')); // Output: true

// Disable a feature
featureFlag.disableFeature('newFeature');

// Check if a feature is enabled after disabling it
console.log('Is newFeature enabled?', featureFlag.isFeatureEnabled('newFeature')); // Output: false
