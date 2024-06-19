const data = getDataFromMyAPI();

// Without optional chaining
const userName = data && data.user && data.user.name;
const userType = data && data.user && data.user.type;
data && data.showNotifications && data.showNotifications();

// With optional chaining
const userName = data?.user?.name;
const userType = data?.user?.type;
data.showNotifications?.();