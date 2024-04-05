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