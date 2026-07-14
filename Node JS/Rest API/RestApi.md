1. What is a RESTful API?

REST (Representational State Transfer) is an architectural style for designing web services that use HTTP protocols to perform operations on resources.

A RESTful API follows REST principles and exposes resources through URLs.

Resource Example

Consider a User resource:

GET /users
GET /users/101
POST /users
PUT /users/101
DELETE /users/101

Example

Request:

GET /users/101

Response:

{
"id": 101,
"name": "Sudhir",
"email": "sudhir@test.com"
}

REST APIs typically model resources through URLs and use standard HTTP methods for CRUD operations.

2. What are the Constraints of REST?

REST has 6 architectural constraints.

1. Client-Server

Client and server are independent.

React UI <---> Node.js API

Benefits:

Independent deployment
Better scalability 2. Stateless

Server does not store client session state.

Every request contains all required information.

GET /orders

Authorization: Bearer JWT

Server should not remember previous requests.

3. Cacheable

Responses can be cached.

Cache-Control: max-age=3600

Benefits:

Reduces latency
Improves performance 4. Uniform Interface

All resources follow consistent conventions.

GET /users
POST /users
PUT /users/101
DELETE /users/101

Uniform interfaces and resource modelling are core REST principles.

5. Layered System

Multiple layers may exist.

Client
↓
API Gateway
↓
Authentication Service
↓
Business Service
↓
Database

Client doesn't need to know which layer serves the request.

6. Code on Demand (Optional)

Server can send executable code.

Example:

app.jsscript>

Rarely used in modern APIs.

3. Difference Between REST and SOAP
   Feature REST SOAPArchitecture Architectural Style Protocol
   Data Format JSON, XML XML Only
   Performance Faster Slower
   Learning Curve Easy Complex
   State Stateless Can be Stateful
   Transport HTTP Mostly HTTP, SMTP, TCP
   Mobile Friendly Yes Less
   Payload Size Small Large
   REST Example
   GET /users/101

{
"id": 101
}

SOAP Example
<soap:Envelope>
<soap:Body>
<GetUser>
<Id>101</Id>
</GetUser>
</soap:Body>
</soap:Envelope>

Enterprise API platforms commonly support both REST and SOAP protocols.

4. What are HTTP Methods?

HTTP methods define actions to perform on resources.

GET

Read data.

GET /users/101

POST

Create data.

POST /users

{
"name": "Sudhir"
}

PUT

Replace existing resource.

PUT /users/101

PATCH

Partially update resource.

PATCH /users/101

DELETE

Delete resource.

DELETE /users/101

REST conventions commonly map GET, POST, PUT, PATCH and DELETE to resource operations.

5. Difference Between PUT and PATCH
   PUT = Full Update

Existing User:

{
"id": 101,
"name": "Sudhir",
"email": "old@test.com"
}

Request:

PUT /users/101

{
"id": 101,
"name": "Sudhir",
"email": "new@test.com"
}

Entire resource is replaced.

PATCH = Partial Update
PATCH /users/101

{
"email": "new@test.com"
}

Only specified fields change.

Internal REST guidelines explicitly distinguish PUT as full replacement and PATCH as partial update.

6. Difference Between POST and PUT
   POST

Used to create a new resource.

POST /users

Server generates ID:

{
"id": 101,
"name": "Sudhir"
}

PUT

Used to replace an existing resource.

PUT /users/101

{
"id": 101,
"name": "Sudhir"
}

Key Difference
POST PUTCreate Update/Replace
Not Idempotent Idempotent
Server creates ID Client provides resource identifier

REST API conventions commonly use POST for creation and PUT for replacement updates.

7. When Should You Use DELETE?

Use DELETE when removing a resource.

Example:

DELETE /users/101

Response:

204 No Content

Use cases:

Delete user
Delete order
Delete product
Remove comment

REST conventions recommend DELETE operations returning 204 No Content upon success.

8. What are Idempotent APIs?

An operation is idempotent if executing it multiple times produces the same result.

Example
DELETE /users/101

Call once:

User deleted

Call again:

Still deleted

Same final outcome.

Idempotent Methods

✅ GET

✅ PUT

✅ DELETE

✅ HEAD

✅ OPTIONS

Non-Idempotent

❌ POST

Example:

POST /orders

Each call creates a new order.

Internal interview material highlights idempotency as important to prevent duplicate processing during retries.

9. What is Statelessness in REST?

Stateless means:

The server stores no client session between requests.

Every request must contain all necessary information.

Stateless Example

Request 1

GET /orders

Authorization: Bearer JWT

Request 2

GET /payments

Authorization: Bearer JWT

Each request is independent.

Stateful Example (Not REST)
Login
↓
Server Session Created
↓
Subsequent Requests Depend On Session

Advantages
Easy scaling
Better reliability
Load balancing friendly
Simpler architecture 10. What is HATEOAS?

HATEOAS stands for:

Hypermedia As The Engine Of Application State

A REST client should discover available actions from links provided by the server.

HATEOAS is often cited as part of the REST uniform interface principle.

Without HATEOAS

Response:

{
"id": 101,
"name": "Sudhir"
}

Client must know all endpoints.

With HATEOAS

Response:

{
"id": 101,
"name": "Sudhir",

"\_links": {
"self": {
"href": "/users/101"
},
"orders": {
"href": "/users/101/orders"
},
"update": {
"href": "/users/101"
}
}
}

Client can discover next actions dynamically.

Senior Interview Quick Answers
What is REST?

REST is an architectural style that exposes resources via URLs and uses standard HTTP methods for CRUD operations.

What is Statelessness?

Every request contains all information needed by the server; no client session is stored on the server.

What is Idempotency?

Multiple identical requests produce the same final result.

PUT vs PATCH?

PUT replaces the entire resource; PATCH updates only specific fields.

POST vs PUT?

POST creates a new resource; PUT replaces or updates an existing resource and is idempotent.

What is HATEOAS?

A REST principle where APIs provide hyperlinks so clients can discover available actions dynamically.

These are some of the most frequently asked REST API interview questions for Senior React, Node.js, Java Spring Boot, and Microservices roles.

Based on internal REST API guidance, RESTful conventions commonly use:

GET /resources
GET /resources/{id}
POST /resources
PUT /resources/{id} (full replacement)
PATCH /resources/{id} (partial update)
DELETE /resources/{id} (delete resource)

1. REST Constraints (Interview Summary)

REST defines architectural constraints that make APIs scalable, maintainable, and loosely coupled.

1. Client-Server

Client and server are independent.

React Frontend
↓
Node.js API
↓
Database

Example

Frontend:

axios.get("/api/users");

Backend:

app.get("/users");

Benefits:

Independent deployment
Better maintainability 2. Stateless

Each request contains everything needed to process it.

Good
GET /orders

Authorization: Bearer JWT

Request has all required information.

Bad
Server remembers user session

Benefits:

✅ Scalability

✅ Easy load balancing

✅ Fault tolerance

3. Cacheable

Responses may be cached.

Example
Cache-Control: max-age=3600

Benefits:

✅ Faster response

✅ Reduced database load

✅ Reduced server cost

4. Uniform Interface

Resources follow consistent naming conventions.

Example
GET /users
POST /users

GET /users/101
PUT /users/101
DELETE /users/101

Not:

/getUsers
/createUser
/removeUser

Internal REST conventions follow resource-based URI design.

5. Layered System

A client should not know how many layers exist.

Client
↓
API Gateway
↓
Auth Service
↓
Order Service
↓
Database

Benefits:

✅ Security

✅ Scalability

✅ Service abstraction

6. Code On Demand (Optional)

Server can provide executable code.

Example:

app.jsscript>

Rarely used in REST APIs today.

REST Constraints Interview Answer

REST is based on Client-Server, Statelessness, Cacheability, Uniform Interface, Layered Architecture, and optional Code-on-Demand. These constraints improve scalability, reliability, and maintainability.

2. Idempotent HTTP Methods Explained
   What is Idempotency?

An operation is idempotent if:

Performing it multiple times produces the same final result.

GET is Idempotent
Request
GET /users/101

Call it:

1 time
10 times
100 times

User data remains unchanged.

Result:

Always same state

PUT is Idempotent
Request
PUT /users/101

{
"name": "Sudhir"
}

First call:

name = Sudhir

Second call:

name = Sudhir

Resource state does not change further.

Internal API conventions define PUT as full replacement updates.

DELETE is Idempotent
Request
DELETE /users/101

Call #1

User deleted

Call #2

Still deleted

Same final state.

PATCH Can Be Idempotent
Example
PATCH /users/101

{
"status": "ACTIVE"
}

Multiple calls:

ACTIVE
ACTIVE
ACTIVE

Same result.

Non-Idempotent PATCH
PATCH /counter

{
"increment": 1
}

Call 3 times:

count = 1
count = 2
count = 3

Not idempotent.

POST is NOT Idempotent
Example
POST /orders

Call 3 times:

Order 1
Order 2
Order 3

Creates new resources each time.

Idempotent Methods Cheat Sheet
Method IdempotentGET ✅
PUT ✅
DELETE ✅
PATCH Depends
POST ❌ 3. PUT vs PATCH vs POST

This is one of the most common senior API interview questions.

POST = Create Resource
Example
POST /users

Request:

{
"name": "Sudhir",
"email": "sudhir@test.com"
}

Response:

{
"id": 101,
"name": "Sudhir"
}

Server generates resource.

PUT = Full Replacement

Existing:

{
"id": 101,
"name": "Sudhir",
"email": "old@test.com"
}

Request:

PUT /users/101

{
"id": 101,
"name": "Sudhir",
"email": "new@test.com"
}

Entire resource replaced.

Internal REST conventions explicitly define PUT as a full replacement update.

PATCH = Partial Update

Request:

PATCH /users/101

{
"email": "new@test.com"
}

Result:

{
"id": 101,
"name": "Sudhir",
"email": "new@test.com"
}

Only modified fields change.

Internal REST conventions explicitly define PATCH as a partial update.

Real-World Use Cases
User Registration
POST /users

Reason:

Creating new user

Update Complete Profile
PUT /users/101

Reason:

Replace entire profile

Change Email Only
PATCH /users/101

Reason:

Only one field changes

Create Order
POST /orders

Reason:

New order each request

Update Order Status
PATCH /orders/123

{
"status": "SHIPPED"
}

Delete User
DELETE /users/101

Response:

204 No Content

Internal REST guidance recommends 204 No Content for successful deletes.

Senior Interview 30-Second Answer

POST is used to create a new resource and is not idempotent. PUT replaces the entire resource and is idempotent. PATCH updates only specified fields and is generally preferred when updating a subset of attributes. Idempotent methods such as GET, PUT, and DELETE ensure that repeating the same request produces the same final state, which is especially important for retries in distributed systems. Internal REST conventions also distinguish PUT as full replacement and PATCH as partial update.

1. Cacheable Constraint in REST

The Cacheable constraint means that a server response should indicate whether it can be cached so that clients, browsers, CDNs, or proxy servers can reuse the response instead of repeatedly calling the server. This reduces latency, improves performance, and decreases server load.

Example 1: Product Catalogue API
GET /products

Response:

200 OK
Cache-Control: public, max-age=3600

[
{
"id": 1,
"name": "Laptop"
}
]

What Happens?
Client Request
↓
Server Response
↓
Browser Cache (1 Hour)
↓
Future Requests Served From Cache

Benefits:

✅ Faster response times

✅ Reduced database load

✅ Lower infrastructure cost

Example 2: CDN Cache
User
↓
CDN
↓
API Server

First Request:

GET /images/logo.png

CDN stores response.

Future requests:

Served directly from CDN

No API server call required.

Example 3: ETag Caching

Initial Request:

GET /users/101

Response:

ETag: "v1-user-101"

Next Request:

GET /users/101

If-None-Match: "v1-user-101"

Response:

304 Not Modified

No response body sent.

Benefits:

Saves bandwidth
Improves performance
Data That Should Not Be Cached
Bank Balance
Payment Status
One-Time Passwords
JWT Tokens

Example:

Cache-Control: no-store

2. Idempotent vs Non-Idempotent API Calls
   What is Idempotency?

A request is idempotent if making the same request multiple times results in the same final state.

Idempotent Example 1: GET
GET /users/101

Call 1:

{
"name": "Sudhir"
}

Call 100:

{
"name": "Sudhir"
}

Database unchanged.

✅ Idempotent

Idempotent Example 2: PUT

Initial User:

{
"name": "John"
}

Request:

PUT /users/101

{
"name": "Sudhir"
}

Call multiple times:

Call 1 → Sudhir
Call 2 → Sudhir
Call 3 → Sudhir

Final state remains the same.

✅ Idempotent

Idempotent Example 3: DELETE
DELETE /users/101

Call 1:

User deleted

Call 2:

User already deleted

Call 3:

Still deleted

Final state unchanged.

✅ Idempotent

Non-Idempotent Example 1: POST
POST /orders

Request:

{
"productId": 1
}

Call multiple times:

Order #1001 Created
Order #1002 Created
Order #1003 Created

Each call creates a new resource.

❌ Non-Idempotent

Non-Idempotent Example 2: Counter Increment
POST /counter/increment

Call 1:

Counter = 1

Call 2:

Counter = 2

Call 3:

Counter = 3

❌ Non-Idempotent

PATCH: Depends On Implementation
Idempotent PATCH
PATCH /users/101

{
"status": "ACTIVE"
}

Multiple calls:

ACTIVE
ACTIVE
ACTIVE

✅ Idempotent

Non-Idempotent PATCH
PATCH /wallet

{
"addAmount": 100
}

Calls:

Balance = 100
Balance = 200
Balance = 300

❌ Not Idempotent

Interview Cheat Sheet
Method IdempotentGET ✅
PUT ✅
DELETE ✅
PATCH Depends
POST ❌ 3. Common Use Cases for POST, PUT and PATCH
POST – Create New Resource
Use Cases
User Registration
POST /users

{
"name": "Sudhir",
"email": "sudhir@test.com"
}

Create Order
POST /orders

Payment Request
POST /payments

File Upload
POST /upload

POST is typically used when the server creates the resource identifier or when you're creating a new entity. REST conventions commonly use POST /resources for creation.

PUT – Full Replacement Update
Use Cases
Update Complete User Profile
PUT /users/101

{
"id": 101,
"name": "Sudhir",
"email": "new@test.com",
"mobile": "9876543210"
}

Entire object sent.

Replace Address
PUT /users/101/address

{
"street": "Main Road",
"city": "Pune",
"country": "India"
}

Complete Configuration Update
PUT /settings/tenant001

Internal REST conventions define PUT as a full replacement update.

PATCH – Partial Update
Use Cases
Change Email
PATCH /users/101

{
"email": "sudhir@company.com"
}

Change Password
PATCH /users/101/password

{
"password": "\*\*\*\*"
}

Update Order Status
PATCH /orders/123

{
"status": "SHIPPED"
}

Update Feature Flag
PATCH /features/featureA

{
"enabled": true
}

Internal REST conventions define PATCH as a partial update.

Senior Interview Answer

POST is used to create new resources and is generally non-idempotent. PUT replaces an entire resource and is idempotent. PATCH updates only specific fields and is typically used when partial updates are required. The cacheable constraint allows responses to be reused by clients or intermediaries, improving performance and reducing load, while idempotent methods ensure safe retries in distributed systems.

Internal REST API guidelines recommend proper RESTful resource handling (POST for create, PUT for full replacement, PATCH for partial updates) and resource-based URI conventions.

1. Code Examples for Caching Headers in REST APIs
   Cache Static Data (Product Catalogue)
   app.get("/api/products", async (req, res) => {

const products = await productService.getAll();

res.set({
"Cache-Control": "public, max-age=3600"
});

res.status(200).json(products);
});

Meaning
public → anyone can cache
max-age=3600 → cache for 1 hour

Prevent Caching for Sensitive Data

Example: Account Balance

app.get("/api/account/balance", async (req, res) => {

const balance = await accountService.getBalance();

res.set({
"Cache-Control": "no-store"
});

res.json(balance);
});

Use for:

Banking
Payment Data
JWT Tokens
User Sessions

ETag Caching
Server
const crypto = require("crypto");

app.get("/api/users/:id", async (req, res) => {

const user = await userService.getById(
req.params.id
);

const etag = crypto
.createHash("md5")
.update(JSON.stringify(user))
.digest("hex");

if (
req.headers["if-none-match"] === etag
) {
return res.status(304).end();
}

res.set("ETag", etag);

res.json(user);
});

First Request
GET /api/users/101

ETag: abcd1234

Second Request
GET /api/users/101

If-None-Match: abcd1234

Response:

304 Not Modified

Benefit:

No payload transfer
Less bandwidth
Faster response

Last-Modified Header
res.set(
"Last-Modified",
user.updatedAt.toUTCString()
);

Client:

If-Modified-Since:
Mon, 14 Jul 2026 10:00:00 GMT

Response:

304 Not Modified

2. Best Practices for Designing Idempotent APIs
   What is Idempotency?

The same request executed multiple times produces the same final result.

✅ Use PUT for Full Updates
PUT /users/101

{
"name": "Sudhir"
}

Call it:

1 time
10 times
100 times

Final state:

name = Sudhir

Same result.

✅ Idempotent

✅ Use DELETE for Deletes
DELETE /users/101

Call repeatedly:

Deleted
Still deleted
Still deleted

Same final state.

✅ Idempotent

✅ Use Idempotency Keys for Payments
Problem

Client timeout:

POST /payments

Client retries.

Without protection:

Payment #1
Payment #2
Payment #3

Duplicate charges.

Solution
POST /payments

Idempotency-Key:
payment_123456

Server stores:

Idempotency Key
Response
Status

Future retries:

Same response returned

No duplicate payment.

This is one of the most common real-world idempotency patterns discussed in senior API interviews.

✅ Design Retry-Safe APIs

Example:

PUT /subscriptions/1001

{
"status": "ACTIVE"
}

Network failure?

Retry safely.

Same outcome.

✅ Avoid Side Effects in GET

Bad:

GET /download

increments counter.

Downloads = 1
Downloads = 2
Downloads = 3

GET should not modify data.

Idempotency Checklist
✅ PUT replaces state
✅ DELETE removes state
✅ GET reads only
✅ Use idempotency keys for payments
✅ Make retries safe
✅ Avoid duplicate processing

3. When to Use PATCH vs PUT

This is one of the most frequently asked senior API interview questions.

PUT = Full Resource Replacement
Scenario 1: Employee Profile Management

Current User

{
"id": 101,
"name": "Sudhir",
"email": "old@test.com",
"phone": "12345"
}

Request:

PUT /users/101

{
"id": 101,
"name": "Sudhir",
"email": "new@test.com",
"phone": "98765"
}

Entire profile replaced.

Use PUT when:

✅ Complete object known

✅ Full resource update

✅ Synchronising entire state

Internal REST guidance defines PUT as a full replacement update.

PATCH = Partial Update
Scenario 2: Change Email Only
PATCH /users/101

{
"email": "new@test.com"
}

Only one field updated.

Use PATCH when:

✅ Few properties changing

✅ Large resources

✅ Mobile/low-bandwidth optimisation

Internal REST guidance defines PATCH as a partial update.

Real-World Scenarios
User Profile Update
Full Form Save
PUT /users/101

Entire form submitted.

Change Single Preference
PATCH /users/101

{
"theme": "dark"
}

E-commerce Order
Replace Order
PUT /orders/1001

Entire order rewritten.

Rare.

Update Order Status
PATCH /orders/1001

{
"status": "SHIPPED"
}

Most common.

Feature Flag System

Enable Feature:

PATCH /features/chatbot

{
"enabled": true
}

Perfect PATCH use case.

Banking Profile
Update Everything
PUT /customer/101

Update Address Only
PATCH /customer/101

{
"address": "Pune"
}

Senior Interview Answer

PUT should be used when replacing the entire resource and the client knows the complete target state. PATCH should be used when only specific fields need modification. POST is primarily for resource creation and is typically non-idempotent. For critical operations such as payments, use idempotency keys so retries do not create duplicate transactions. REST APIs should also leverage caching headers such as Cache-Control, ETag, and Last-Modified to improve performance while preventing caching of sensitive data.

Internal REST API guidelines distinguish PUT as full replacement and PATCH as partial update, and interview materials highlight idempotency as critical for retries and distributed systems.

1. Cache-Control + ETag Example

Combining Cache-Control and ETag provides both cache duration and cache validation.

Node.js Express Example
const crypto = require("crypto");

app.get("/api/products/:id", async (req, res) => {

const product = await productService.getById(
req.params.id
);

const etag = crypto
.createHash("md5")
.update(JSON.stringify(product))
.digest("hex");

if (
req.headers["if-none-match"] === etag
) {
return res.status(304).end();
}

res.set({
"Cache-Control": "public, max-age=3600",
"ETag": etag
});

res.status(200).json(product);
});

First Request
GET /api/products/1

Response:

200 OK

Cache-Control: public, max-age=3600
ETag: abc123

{
"id": 1,
"name": "MacBook Pro"
}

Second Request

Browser sends:

GET /api/products/1

If-None-Match: abc123

Server response:

304 Not Modified

Benefits:

✅ Smaller payload

✅ Faster response

✅ Less network traffic

✅ Less server load

Sensitive Data Example

Never cache:

res.set({
"Cache-Control": "no-store"
});

Use for:

JWT Tokens
Bank Accounts
Payment Information
One-Time Passwords

2. Common Idempotency Pitfalls to Avoid
   Pitfall 1: Using POST for Retryable Operations

❌ Bad

POST /payments

Client timeout:

Payment created
Timeout
Retry
Another payment created

Result:

Duplicate charges

Solution

Use:

Idempotency-Key: pay_12345

app.post("/payments", async (req, res) => {

const existing =
await redis.get(
req.headers["idempotency-key"]
);

if (existing) {
return res.json(
JSON.parse(existing)
);
}

const payment =
await processPayment();

await redis.set(
req.headers["idempotency-key"],
JSON.stringify(payment)
);

res.json(payment);
});

This aligns with interview guidance that idempotency prevents duplicate processing during retries.

Pitfall 2: Side Effects in GET

❌ Bad

GET /products/1

Code:

product.viewCount++;

Each GET changes state.

GET
GET
GET

View count increases.

GET should be read-only.

Pitfall 3: Increment APIs Using PATCH

❌ Bad

PATCH /wallet

{
"increment": 100
}

Calls:

100
200
300

Not idempotent.

Pitfall 4: Duplicate Event Processing

Example:

Kafka Message Received
Retry Happens
Same Event Processed Again

Solution:

Store Event ID
Reject Duplicate Events

Pitfall 5: PUT with Partial Data

Existing user:

{
"name": "Sudhir",
"email": "old@test.com"
}

Wrong PUT:

{
"name": "Sudhir"
}

May accidentally overwrite fields.

PUT should contain the complete representation because it replaces the resource.

3. PATCH vs PUT with Code Examples
   PUT = Full Resource Replacement
   Existing Resource
   {
   "id": 101,
   "name": "Sudhir",
   "email": "old@test.com",
   "city": "Pune"
   }

Request
PUT /users/101

{
"id": 101,
"name": "Sudhir",
"email": "new@test.com",
"city": "Mumbai"
}

Express Example
app.put(
"/users/:id",
async (req, res) => {

    const updatedUser =
      await userService.replace(
        req.params.id,
        req.body
      );

    res.status(200).json(
      updatedUser
    );

}
);

Real-World Use Cases

✅ Employee profile form save

✅ Complete tenant configuration update

✅ Synchronising data from another system

✅ Updating an entire product catalogue record

PUT is intended for full replacement updates.

PATCH = Partial Update
Existing Resource
{
"id": 101,
"name": "Sudhir",
"email": "old@test.com",
"city": "Pune"
}

Request
PATCH /users/101

{
"email": "new@test.com"
}

Only email is changed.

Express Example
app.patch(
"/users/:id",
async (req, res) => {

    const updatedUser =
      await userService.partialUpdate(
        req.params.id,
        req.body
      );

    res.status(200).json(
      updatedUser
    );

}
);

Real-World Use Cases

✅ Change password

✅ Update email

✅ Change order status

✅ Enable feature flag

✅ Mark notification as read

PATCH is intended for partial updates.

Quick Comparison
Scenario MethodRegister User POST
Create Order POST
Upload File POST
Save Complete Employee Profile PUT
Replace Full Configuration PUT
Change Email PATCH
Change Order Status PATCH
Toggle Feature Flag PATCH
Senior Interview Answer

PUT replaces the entire resource and should be used when the client knows the complete target state. PATCH updates only specific fields and reduces payload size. POST creates new resources and is generally not idempotent. To make retryable operations safe, use idempotency keys, avoid side effects in GET requests, and ensure resource replacement semantics are respected when using PUT.

1. Using Last-Modified Header in REST APIs

Last-Modified allows clients to avoid downloading data if the resource hasn't changed since the last request.

Express Example
app.get("/api/users/:id", async (req, res) => {

const user = await userService.getById(
req.params.id
);

const lastModified =
new Date(user.updatedAt);

const ifModifiedSince =
req.headers["if-modified-since"];

if (
ifModifiedSince &&
new Date(ifModifiedSince) >= lastModified
) {
return res.status(304).end();
}

res.set(
"Last-Modified",
lastModified.toUTCString()
);

res.json(user);
});

First Request
GET /api/users/101

Response:

200 OK

Last-Modified:
Tue, 14 Jul 2026 10:30:00 GMT

{
"id": 101,
"name": "Sudhir"
}

Subsequent Request
GET /api/users/101

If-Modified-Since:
Tue, 14 Jul 2026 10:30:00 GMT

Response:

304 Not Modified

Benefits:

✅ Reduced bandwidth

✅ Faster response

✅ Less database load

✅ Better client performance

Last-Modified + Cache-Control Together
res.set({
"Cache-Control":
"public, max-age=3600",

"Last-Modified":
user.updatedAt.toUTCString()
});

This combines:

Time-based caching
Validation-based caching 2. Best Practices for Implementing Idempotency Keys

Internal interview material highlights idempotency as an important mechanism to avoid duplicate processing during retries and network failures.

What is an Idempotency Key?

A unique key sent by the client to identify a request.

POST /payments

Idempotency-Key:
payment_123456

Multiple retries with the same key should return the same result.

Best Practice #1: Client Generates Unique Keys

Use:

crypto.randomUUID()

Example:

3d0cf28d-24fc-4abc-97d2

Avoid:

UserID only
Timestamp only

Best Practice #2: Store Response Against Key

Database:

IdempotencyKey
Response
Status
CreatedAt

Example:

payment_123
SUCCESS
PaymentID=1001

Best Practice #3: Return Existing Response
const existing =
await redis.get(idempotencyKey);

if (existing) {
return res.json(
JSON.parse(existing)
);
}

Never execute business logic twice.

Best Practice #4: Add Expiration

Store keys for a limited period.

Example:

redis.set(
key,
response,
"EX",
86400
);

24 hours

Benefits:

Prevents unlimited storage growth

Best Practice #5: Protect Critical Operations

Ideal candidates:

Payments
Order Creation
Fund Transfers
Invoice Generation
Email Sending

Example:

POST /payments
POST /orders
POST /refunds

Best Practice #6: Validate Request Payload

Same key must use same payload.

Bad:

Idempotency-Key: pay123

Amount = 100

Later:

Idempotency-Key: pay123

Amount = 500

Reject request.

{
"code": "IDEMPOTENCY_CONFLICT"
}

Best Practice #7: Use Distributed Storage

Store keys in:

Redis
DynamoDB
PostgreSQL

Avoid:

In-memory storage

because it won't work across multiple servers.

Production Flow
Client
↓
Idempotency-Key
↓
Redis Lookup
↓
Exists?
↓ ↓
Yes No
↓ ↓
Return Process
Saved Request
Response ↓
Save Result

3. How to Avoid Side Effects in GET Requests
   Principle

GET should:

✅ Read data

❌ Change data

❌ Update records

❌ Trigger payments

❌ Modify counters

GET should remain safe and idempotent.

Bad Example #1
app.get("/products/:id",
async (req, res) => {

product.views++;

await product.save();

res.json(product);
});

Problem:

GET #1 -> views = 1
GET #2 -> views = 2
GET #3 -> views = 3

GET changes system state.

❌ Not safe

Better Alternative

Send analytics asynchronously.

app.get("/products/:id",
async (req, res) => {

analyticsQueue.publish({
productId: req.params.id
});

res.json(product);
});

Product record remains unchanged.

Bad Example #2
GET /payments/process

Processing a payment via GET.

❌ Wrong

Correct
POST /payments

Creating or processing business operations should use POST.

Bad Example #3
GET /emails/send

Sends emails.

❌ Wrong

Correct
POST /emails

Good GET Examples
Fetch User
GET /users/101

Search Products
GET /products?q=laptop

Fetch Order
GET /orders/1001

Safe vs Unsafe Methods
Method Safe IdempotentGET ✅ ✅
HEAD ✅ ✅
OPTIONS ✅ ✅
PUT ❌ ✅
DELETE ❌ ✅
PATCH ❌ Depends
POST ❌ ❌
Senior Interview Answer

Use Last-Modified together with If-Modified-Since to reduce unnecessary payload transfer. Implement idempotency keys for retryable operations such as payments and order creation by storing request results in a distributed store like Redis and returning the same response for duplicate requests. GET requests should remain read-only, never modify application state, and should not perform actions such as payments, updates, email sending, or counter increments. Internal interview guidance specifically emphasises idempotency as a key mechanism for reliable REST APIs and retry safety.
