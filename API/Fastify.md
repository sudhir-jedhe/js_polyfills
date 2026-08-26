*** copy Fastify.md ***

**1. Schema-Driven Fastify Server Setup**

* **Prompt:** Create a high-performance Fastify server with built-in JSON schema validation, serialized responses, and Pino logging.
* **Example:**

```javascript
const fastify = require('fastify')({ logger: true });

const getUserSchema = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' }
      },
      required: ['id']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' }
        }
      }
    }
  }
};

fastify.get('/api/users/:id', getUserSchema, async (request, reply) => {
  const { id } = request.params;
  return { id, name: 'Alice Smith', email: 'alice@example.com' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

```

---

**2. Fastify Modular Plugin & Route Encapsulation**

* **Prompt:** Implement an encapsulated Fastify route module using `fastify-plugin` (fp) so shared decorators, hooks, and services can be registered cleanly.
* **Example:**

```javascript
const fp = require('fastify-plugin');

// Database/Service Plugin
async function dbPlugin(fastify, options) {
  const db = {
    users: new Map([['1', { id: '1', name: 'John Doe' }]]),
    findUser: (id) => db.users.get(id)
  };

  // Decorate fastify instance
  fastify.decorate('db', db);
}

// User Routes Plugin
async function userRoutes(fastify, options) {
  fastify.get('/users/:id', async (request, reply) => {
    const user = fastify.db.findUser(request.params.id);
    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }
    return user;
  });
}

// Main App Registration
// fastify.register(fp(dbPlugin));
// fastify.register(userRoutes, { prefix: '/api/v1' });

```

---

**3. Custom Authentication Hook (`onRequest` / `preHandler`)**

* **Prompt:** Implement an authentication hook in Fastify using `@fastify/jwt` to protect routes and attach the decoded user context to the request.
* **Example:**

```javascript
const fastify = require('fastify')();
const fastifyJwt = require('@fastify/jwt');

fastify.register(fastifyJwt, { secret: 'super-secret-key' });

fastify.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Protected Route using preHandler
fastify.get('/api/profile', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  return { user: request.user };
});

// Login Route generating token
fastify.post('/api/login', async (request, reply) => {
  const token = fastify.jwt.sign({ userId: '123', role: 'admin' });
  return { token };
});

```

---

**4. Global Error Handling & Custom Not Found Handler**

* **Prompt:** Implement a central error handler in Fastify to format error payloads consistently and intercept validation failures.
* **Example:**

```javascript
fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      details: error.validation
    });
  }

  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    statusCode,
    error: error.name || 'Internal Server Error',
    message: error.message || 'Something went wrong'
  });
});

fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    statusCode: 404,
    error: 'Not Found',
    message: `Route ${request.method}:${request.url} not found`
  });
});

```

---

**5. High-Throughput Request Rate Limiting**

* **Prompt:** Integrate `@fastify/rate-limit` with Redis or in-memory storage to throttle endpoints dynamically based on route paths or headers.
* **Example:**

```javascript
const fastify = require('fastify')();
const rateLimit = require('@fastify/rate-limit');

async function build() {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Retry in ${context.after}`
    })
  });

  // Override limit per route
  fastify.post('/api/sensitive-action', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute'
      }
    }
  }, async () => ({ status: 'success' }));
}

```

---

**6. Swagger / OpenAPI Auto-Documentation**

* **Prompt:** Setup `@fastify/swagger` and `@fastify/swagger-ui` to auto-generate an interactive API docs page directly from Fastify JSON schemas.
* **Example:**

```javascript
const fastify = require('fastify')();

async function setupDocs() {
  await fastify.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'Fastify Microservice API',
        description: 'Auto-generated API documentation',
        version: '1.0.0'
      }
    }
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });

  fastify.get('/ping', {
    schema: {
      description: 'Healthcheck endpoint',
      tags: ['System'],
      response: {
        200: {
          type: 'object',
          properties: { pong: { type: 'string' } }
        }
      }
    }
  }, async () => ({ pong: 'it works!' }));
}

```
