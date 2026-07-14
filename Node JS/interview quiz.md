These topics align well with your experience using **Node.js, Express, MongoDB, Git, and AWS** in projects described in your resumes. [\[Sudhir_Jed..._Optimized \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B6D62BFD5-1C8F-43D9-B7DD-A310E3955486%7D&file=Sudhir_Jedhe_3Page_Recruiter_Optimized.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Sudhir Jedhe 2 \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7BF58C5747-96DD-4F3E-BB6A-900C2EBA385C%7D&file=Sudhir%20Jedhe%202.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

# JavaScript / Node.js

### 1. What is the primary function of Node.js?

Node.js is a JavaScript runtime built on the V8 engine that allows JavaScript to run on servers and build backend applications.

***

### 2. What does bcrypt hash function do?

Used for:

```text
Password Hashing
Password Verification
```

Example:

```javascript
bcrypt.hash(password, 10);
bcrypt.compare(password, hash);
```

***

### 3. What is Object.freeze()?

Prevents modification of an object.

```javascript
const user = { name: "Sudhir" };

Object.freeze(user);

user.name = "John";

console.log(user.name);
```

Output:

```javascript
Sudhir
```

***

### 4. Purpose of Symbol?

Creates unique values.

```javascript
const id1 = Symbol();
const id2 = Symbol();

console.log(id1 === id2);
```

Output:

```javascript
false
```

Used for unique object keys.

***

### 5. Output of typeof null?

```javascript
typeof null
```

Output:

```javascript
"object"
```

This is a historical JavaScript bug.

***

### 6. What does npm install do?

```bash
npm install
```

Installs dependencies listed in:

```json
package.json
```

***

### 7. What is a callback function?

A function passed as an argument to another function.

```javascript
function greet(cb) {
  cb();
}

greet(() =>
  console.log("Hello")
);
```

***

### 8. What does NaN === NaN return?

```javascript
NaN === NaN
```

Output:

```javascript
false
```

Correct check:

```javascript
Number.isNaN(value)
```

***

### 9. Purpose of WeakMap?

Stores object keys weakly.

Benefits:

```text
Memory Efficient
Garbage Collection Friendly
```

```javascript
const wm = new WeakMap();
```

***

### 10. What does Express.js provide?

```text
Routing
Middleware
REST APIs
Request Handling
```

***

### 11. Purpose of Middleware?

Processes requests before reaching routes.

Examples:

```text
Auth
Logging
Validation
Error Handling
```

***

### 12. How do you protect routes in Express?

Authentication middleware.

```javascript
app.get(
  "/admin",
  authMiddleware,
  controller
);
```

***

### 13. Module used for JWT authentication?

Popular libraries:

```bash
jsonwebtoken
passport-jwt
```

***

### 14. What is JWT?

JWT (JSON Web Token) is a signed token used for stateless authentication.

Structure:

```text
Header.Payload.Signature
```

***

### 15. What does JWT Payload contain?

Contains claims.

Example:

```json
{
  "userId": 101,
  "role": "ADMIN",
  "exp": 123456789
}
```

***

# MongoDB

### 16. Which strategies combine documents?

Common approaches:

```text
$lookup
$unionWith
```

***

### 17. What does $unwind do?

Converts array elements into separate documents.

Example:

```javascript
{
 tags: ["A","B"]
}
```

Becomes:

```javascript
{ tags:"A" }
{ tags:"B" }
```

***

### 18. Purpose of $merge and $out?

### $merge

Writes output into existing collection.

### $out

Creates/replaces a collection.

***

### 19. Advantage of WiredTiger?

```text
Compression
Better Concurrency
Improved Performance
```

***

### 20. What does $size do?

Returns array length.

```javascript
{
 tags: {
   $size: 3
 }
}
```

***

### 21. Purpose of $facet?

Runs multiple pipelines simultaneously.

```javascript
{
  $facet: {
    products: [...],
    categories: [...]
  }
}
```

***

### 22. What does $bucket do?

Groups documents into ranges.

Example:

```javascript
0-100
101-500
501-1000
```

Useful for analytics.

***

### 23. Difference between $in and $nin?

### $in

```javascript
{
 status: {
   $in: ["A","B"]
 }
}
```

Match included values.

***

### $nin

```javascript
{
 status: {
   $nin: ["A","B"]
 }
}
```

Match excluded values.

***

### 24. Which operator matches values in array?

```javascript
$in
```

Example:

```javascript
{
 tags: {
   $in: ["React"]
 }
}
```

***

# SQL

### 25. Which clause filters records?

```sql
WHERE
```

Example:

```sql
SELECT *
FROM users
WHERE age > 18;
```

***

# Git

### 26. What does .gitignore do?

Specifies files Git should ignore.

Example:

```text
node_modules

.env

dist
```

***

### 27. Change latest commit message?

```bash
git commit --amend -m "New Message"
```

***

### 28. Primary purpose of Git?

```text
Version Control
Source Code Tracking
Collaboration
```

***

# AWS

### 29. Primary function of Elastic Beanstalk?

PaaS service that automatically deploys and manages applications.

Supports:

```text
Node.js
Java
Python
.NET
PHP
```

***

### 30. Benefits of Elastic Beanstalk?

```text
Auto Scaling
Load Balancing
Easy Deployment
Monitoring
Infrastructure Management
```

***

### 31. Purpose of S3 Versioning?

Keeps multiple versions of objects.

Benefits:

```text
Recovery
Accidental Delete Protection
Rollback Support
```

***

### 32. Purpose of Lifecycle Policies?

Automatically move or delete objects.

Example:

```text
30 Days → Glacier

365 Days → Delete
```

***

### 33. How does Intelligent-Tiering reduce cost?

Automatically moves objects between access tiers based on usage patterns.

```text
Frequently Accessed

Infrequently Accessed

Archive
```

No manual intervention.

***

### 34. Difference Between Storage Classes

| Storage              | Retrieval Speed  | Cost    |
| -------------------- | ---------------- | ------- |
| S3 Standard          | Milliseconds     | Highest |
| Glacier              | Minutes to Hours | Lower   |
| Glacier Deep Archive | Up to 12 hours   | Lowest  |

Use cases:

```text
Standard → Active Files

Glacier → Backups

Deep Archive → Compliance Data
```

***

### 35. What is AWS KMS?

AWS Key Management Service.

Used for:

```text
Encryption Keys
Data Encryption
Secrets Protection
Key Rotation
```

Example Services:

```text
S3
RDS
EBS
Lambda
Secrets Manager
```

### Interview Answer

> AWS KMS is a managed encryption service used to create, rotate, and manage cryptographic keys. It integrates with AWS services such as S3, RDS, and EBS to encrypt data at rest and helps organizations meet security and compliance requirements.

## Most Important Interview Questions From This List

```text
✅ JWT & Authentication

✅ bcrypt

✅ Middleware

✅ WeakMap

✅ Object.freeze()

✅ MongoDB Aggregation ($lookup, $facet, $unwind)

✅ Git (.gitignore, amend)

✅ Elastic Beanstalk

✅ S3 Storage Classes

✅ KMS

✅ npm

✅ Callback Functions
```

These are the questions most frequently asked in Senior Full Stack (React + Node.js + MongoDB + AWS) interviews.
