CORS (Cross-Origin Resource Sharing) is a mechanism that enables secure interaction between web resources from different origins. Here's a detailed breakdown of the CORS mechanism, including its requests, responses, and headers:

---

## **CORS Overview**

### **Same-Origin Policy (SOP)**
- Browsers enforce the **Same-Origin Policy** to restrict how resources from different origins interact. 
- Same-origin is determined by matching the protocol, hostname, and port.

### **Cross-Origin Resource Sharing (CORS)**
- CORS is a server-driven feature that relaxes the SOP by specifying which origins are permitted to access the server's resources.

---

## **CORS Request Types**

### **1. Simple Requests**
A request is considered "simple" if:
- It uses one of these methods:
  - `GET`
  - `POST`
  - `HEAD`
- It uses only these headers:
  - `Accept`
  - `Accept-Language`
  - `Content-Language`
  - `Content-Type` (limited to `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`)

### **2. Preflight Requests**
A preflight request is sent before the actual request if:
- The method is not `GET`, `POST`, or `HEAD`.
- It uses custom headers not included in the "simple" category.
- It uses the `Content-Type` header with a value other than `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`.

The browser sends an `OPTIONS` request to the server to determine if the actual request is safe to send.

### **3. Actual Requests**
The actual request is sent after the server allows the origin (if applicable).

---

## **CORS Headers**

### **Request Headers**
1. **Origin**
   - Specifies the origin of the request.
   - Example:
     ```
     Origin: https://example.com
     ```

2. **Access-Control-Request-Method** *(Preflight only)*
   - Specifies the HTTP method of the actual request.
   - Example:
     ```
     Access-Control-Request-Method: POST
     ```

3. **Access-Control-Request-Headers** *(Preflight only)*
   - Specifies the headers in the actual request.
   - Example:
     ```
     Access-Control-Request-Headers: X-Custom-Header
     ```

### **Response Headers**
1. **Access-Control-Allow-Origin**
   - Specifies which origins are allowed to access the resource.
   - Example:
     ```
     Access-Control-Allow-Origin: https://example.com
     ```

2. **Access-Control-Allow-Methods**
   - Lists the HTTP methods permitted for the resource.
   - Example:
     ```
     Access-Control-Allow-Methods: GET, POST, PUT, DELETE
     ```

3. **Access-Control-Allow-Headers**
   - Lists the headers the client is allowed to include in its requests.
   - Example:
     ```
     Access-Control-Allow-Headers: X-Custom-Header, Authorization
     ```

4. **Access-Control-Allow-Credentials**
   - Indicates whether credentials (cookies, HTTP authentication) are allowed.
   - Example:
     ```
     Access-Control-Allow-Credentials: true
     ```

5. **Access-Control-Expose-Headers**
   - Lists headers exposed to the client (not included by default).
   - Example:
     ```
     Access-Control-Expose-Headers: X-Total-Count, Content-Length
     ```

6. **Access-Control-Max-Age**
   - Indicates how long the results of a preflight request can be cached.
   - Example:
     ```
     Access-Control-Max-Age: 86400
     ```

### **Other Headers**
1. **Vary**
   - Indicates which request headers the response depends on.
   - Example:
     ```
     Vary: Origin
     ```

---

## **CORS Example**

### Simple Request
#### Request
```http
GET /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com
```

#### Response
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://frontend.example.com
```

---

### Preflight Request
#### Preflight Request
```http
OPTIONS /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, X-Custom-Header
```

#### Preflight Response
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, X-Custom-Header
Access-Control-Max-Age: 3600
```

---

### Actual Request
#### Request
```http
POST /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com
Content-Type: application/json
X-Custom-Header: custom-value
```

#### Response
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: X-RateLimit-Limit
```

---

## **Summary**

CORS allows servers to specify:
- **Origins**: Which origins can access their resources.
- **Methods**: Which HTTP methods are permitted.
- **Headers**: Which request/response headers can be used.
- **Credentials**: Whether cookies or authentication are allowed.

By configuring these headers, developers can control cross-origin communication securely and flexibly.