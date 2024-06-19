// nullish coalescing operator (??) is a logical operator that allows us to check for nullish (null or undefined) values, returning the right-hand side operand when the value is non-nullish, otherwise returning the left-hand side operand.

const config = getServerConfig();

// Without nullish coalescing
const port = config.server.port || 8888;
// Oops! This will be true even if we pass it false
const wrongkeepAlive = config.server.keepAlive || true;
// We'll have to explicitly check for nullish values
const keepAlive =
  (config.server.keepAlive !== null & config.server.keepAlive !== undefined)
  ? config.server.keepAlive : true;

// With nullish coalescing
const port = config.server.port ?? 8888;
// This works correctly
const keepAlive = config.server.keepAlive ?? true;