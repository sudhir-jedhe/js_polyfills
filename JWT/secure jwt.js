// Secure your JWTs on client-side
// JWTs are often used for authentication, stored on the client side, and sent with server-side calls. In this post, we will discuss how to secure those as a pr

// In this blog, we will discuss why you should never save JWTs via client-side code.

// If you have implemented JWT on your app, then you need to protect and store it safely on the client side.

// If JWTs are not saved securely, they might be exposed to malicious actors.

// Let's secure the JWTs and other sensitive data.

// You need to send a cookie from the server-side header response instead of saving it on the client side with the following attributes:

// Set-Cookie: accessToken=; Domain=abc.xyz.com; Path=/api/gateway; Secure; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict


// 1. HTTP-only cookie: Always send JWTs via response cookies with an HTTP-only property. It prevents JS scripts from accessing the token, hence XSS attacks.

// 2. secure: It will ensure that cookies are sent over HTTPS only.

// 3. domain: by specifying the domain, you can ensure that the cookie can only be sent to that server.

// 4. SameSite: strict: A cookie that has this property set will prevent browsers from sending it in cross-site requests. Put simply, this implies that the request will not contain the cookie if the target site does not match the one that is now displayed in the browser's address bar.

// 5. path: To further restrict access to the JWT cookie within a server, the path can be specified.

// 6. expires: You can explicitly provide an expiration time, and the cookie will expire by then.

// By implementing these measures, most of the client-side attacks will be mitigated, and your JWTs and other protected data to be stored on the client side will be protected.

// Having said that, if there are other vulnerabilities on sibling servers or domains, handle cookies in an unsecured way.