### **Cross-Site Request Forgery (CSRF) in Detail**

**Cross-Site Request Forgery (CSRF)**, also known as **one-click attack** or **session riding**, is a type of **malicious exploit** where an attacker tricks a user into performing an unwanted action on a web application where they are authenticated. This can lead to **data theft**, **data manipulation**, or even **unauthorized actions** being performed on behalf of the user, without their consent.

CSRF attacks exploit the **trust that a web application has in the user's browser**. Essentially, if the user is authenticated and has an active session with a web application, the attacker can trick the browser into making requests that appear legitimate to the server, using the user’s credentials.

### **How CSRF Works**

Here's how a typical CSRF attack works:

1. **User Authentication**: The user logs into a web application (e.g., a banking app or social media site), and the server creates a session cookie to authenticate the user. This cookie is stored in the user's browser.

2. **Attacker's Malicious Site**: The attacker creates a malicious website or email that includes a **hidden request** (e.g., a form submission or an AJAX request) that targets the web application the user is authenticated with.

3. **User Visits the Malicious Site**: While the user is still logged into the legitimate web application (in the background), they unknowingly visit the malicious site controlled by the attacker.

4. **The Attack Request is Sent**: The malicious site sends a request (e.g., a POST request, typically with the user's credentials, using the session cookie) to the legitimate application, leveraging the user's active session and authentication cookies.

5. **Action is Executed**: Since the browser sends the authenticated request with the **session cookie**, the server processes the request as if it were made by the legitimate user, and the requested action is executed (e.g., transferring funds, changing an email address, etc.).

---

### **Example of a CSRF Attack**

Imagine you are logged into your online banking application and your session is still active. You visit a malicious website that contains a hidden form like this:

```html
<form action="https://yourbank.com/transfer" method="POST" style="display:none">
  <input type="text" name="account" value="attacker_account">
  <input type="text" name="amount" value="1000">
  <input type="submit">
</form>
<script>
  document.forms[0].submit();
</script>
```

- The form is submitted to the bank's website, and the attacker has embedded it in a script that automatically submits the form without the user's knowledge.
- Since you are still logged into your bank’s website, the server processes the request with your session cookie, transferring $1000 to the attacker’s account.

---

### **How to Prevent CSRF**

There are several effective strategies to prevent CSRF attacks. Below are the most widely used methods:

### **1. Use Anti-CSRF Tokens**

One of the most common and effective techniques to prevent CSRF attacks is the use of **anti-CSRF tokens**.

- **Anti-CSRF Token**: A unique token is generated on the server side and added to each request made by the client (usually in the form of a hidden field or HTTP header). This token is tied to the user’s session and must be sent back with every state-changing request (like POST, PUT, DELETE).
- If the token is missing or incorrect, the request is rejected because it’s considered to be potentially a CSRF attack.

#### How Anti-CSRF Token Works:
1. The server generates a unique token for the user session and embeds it in the form or the HTTP request (e.g., as a hidden input field or in headers).
2. The browser submits the token along with the form or request.
3. The server compares the token in the request with the token stored in the session.
4. If they match, the request is processed. If not, the server rejects it.

Example:
- Server generates a CSRF token for the user: `csrfToken = "abc123"`.
- When sending a request (such as submitting a form), the token is included:

```html
<form method="POST" action="/update-profile">
  <input type="hidden" name="csrfToken" value="abc123">
  <!-- other form fields -->
  <input type="submit">
</form>
```

On the server, the request would be checked to ensure that `csrfToken` matches the one stored in the session.

### **2. SameSite Cookies**

The `SameSite` cookie attribute is another preventive measure that helps to prevent CSRF attacks by restricting how cookies are sent in cross-origin requests.

- **SameSite=Lax**: The cookie is sent with top-level navigations (i.e., links or form submissions) but not with third-party requests.
- **SameSite=Strict**: The cookie is only sent in same-origin requests, meaning that the cookie won’t be sent if the user is navigating to a different site.
- **SameSite=None**: The cookie is sent with all requests, including cross-origin ones, but requires the `Secure` flag (only transmitted over HTTPS).

```http
Set-Cookie: sessionId=abcd1234; SameSite=Strict;
```

Setting `SameSite` to `Strict` or `Lax` ensures that cookies are not sent with cross-origin requests, which are often the vector for CSRF attacks.

### **3. Require Authentication for Sensitive Actions (e.g., Re-authentication)**

Another strategy to prevent CSRF attacks is to **require re-authentication** or **additional confirmation** for sensitive actions (such as transferring money, changing passwords, etc.).

For example:
- For highly sensitive actions like changing the email or transferring funds, require the user to input their password or use multi-factor authentication (MFA).
- This ensures that even if the CSRF token or session is hijacked, the attacker cannot perform critical operations without the user’s credentials.

### **4. Use HTTP Headers (CORS)**

Cross-Origin Resource Sharing (CORS) allows you to specify which domains are allowed to make requests to your server. By restricting the allowed origins, you can mitigate the risk of CSRF.

- **CORS Headers**: Make sure that the server only accepts requests from trusted origins by using the `Access-Control-Allow-Origin` header.
- This prevents malicious sites from sending requests using the user’s credentials.

```http
Access-Control-Allow-Origin: https://yourtrusteddomain.com
```

### **5. Use HTTP Method Security**

- **Ensure GET Requests are Safe**: CSRF attacks typically target **state-changing operations** (POST, PUT, DELETE), so ensure that all GET requests are **idempotent** (i.e., they should not change data).
- For actions like form submissions or database updates, use **POST**, **PUT**, or **DELETE**, and make sure that these methods are protected by anti-CSRF tokens.

### **6. CAPTCHA for Form Submissions**

Adding **CAPTCHA** or **reCAPTCHA** to sensitive forms can help prevent CSRF attacks by ensuring that the request is coming from a legitimate human user rather than a malicious script.

- This step is especially useful in preventing automated attacks that attempt to exploit CSRF vulnerabilities.

### **7. Implement Content Security Policy (CSP)**

A **Content Security Policy (CSP)** is a browser feature that can be used to mitigate certain types of attacks, including CSRF. It allows a web application to specify which domains are allowed to load resources, preventing malicious scripts from running on your site.

Example:
```http
Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self';
```

This helps prevent external domains from injecting scripts or malicious code that can perform CSRF attacks.

---

### **Conclusion: How to Prevent CSRF Attacks**

1. **Anti-CSRF Tokens**: Use unique tokens for each request that require state-changing actions. Validate these tokens on the server side.
2. **SameSite Cookies**: Set the `SameSite` attribute on cookies to restrict cross-origin requests.
3. **Re-authentication**: For critical operations, require the user to re-authenticate or perform additional actions (e.g., CAPTCHA, MFA).
4. **CORS Headers**: Restrict which origins are allowed to send requests to your server using CORS headers.
5. **Method Security**: Ensure that GET requests are safe and do not modify state.
6. **CAPTCHA**: Use CAPTCHA or reCAPTCHA for form submissions to prevent automated attacks.
7. **Content Security Policy (CSP)**: Implement CSP to restrict external scripts and resources.

By using a combination of these methods, you can significantly reduce the risk of CSRF attacks and protect your users from malicious exploits.