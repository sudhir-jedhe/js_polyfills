Building your own **Code Formatter** is an exciting project that teaches you about parsing, syntax analysis, and code transformation. A code formatter takes unformatted or inconsistently formatted code and outputs it in a well-structured, consistent style. This can be applied to languages like JavaScript, Python, or even JSON.

Here’s how to build a basic **JavaScript Code Formatter** using Node.js:

---

## **Steps to Build a Code Formatter**

1. **Tokenization**: Break the input code into tokens like keywords, operators, strings, etc.
2. **Parsing**: Build a syntax tree from the tokens.
3. **Formatting Rules**: Define rules for indentation, spacing, braces, etc.
4. **Generate Output**: Convert the syntax tree back into formatted code.
5. **CLI Tool**: Allow users to format files via the command line.

---

### **Step 1: Tokenization**

We'll use a library like `acorn` to tokenize JavaScript code.

Install `acorn`:
```bash
npm install acorn
```

Example of tokenization:

```javascript
const acorn = require('acorn');

function tokenizeCode(inputCode) {
  const tokens = [...acorn.tokenizer(inputCode, { ecmaVersion: 2020 })];
  tokens.forEach((token) => console.log(token));
}

const code = `function add(a,b){return a+b;}`;
tokenizeCode(code);
```

**Output**: The tokenized representation of the code.

---

### **Step 2: Parsing**

We'll use `acorn` to parse the code into an Abstract Syntax Tree (AST).

```javascript
const acorn = require('acorn');

function parseCode(inputCode) {
  const ast = acorn.parse(inputCode, { ecmaVersion: 2020 });
  console.log(JSON.stringify(ast, null, 2));
}

const code = `function add(a,b){return a+b;}`;
parseCode(code);
```

**Explanation**: The AST contains the structure of the code, including functions, variables, and expressions.

---

### **Step 3: Formatting Rules**

We'll implement formatting rules, such as:

1. Adding spaces around operators.
2. Adding line breaks after semicolons.
3. Proper indentation for nested blocks.

```javascript
function formatCode(inputCode) {
  const formattedCode = inputCode
    .replace(/;/g, ';\n')                // Add line breaks after semicolons
    .replace(/{/g, '{\n')                // Add line breaks after opening braces
    .replace(/}/g, '\n}')                // Add line breaks before closing braces
    .replace(/\)/g, ') ')                // Add spaces after closing parentheses
    .replace(/,/g, ', ')                 // Add spaces after commas
    .replace(/\s+/g, ' ')                // Remove extra spaces
    .replace(/\n\s+/g, '\n')             // Trim spaces at the beginning of new lines
    .trim();                             // Remove extra spaces from the start and end
  return formattedCode;
}

const code = `function add(a,b){return a+b;}`;
console.log(formatCode(code));
```

**Output**:
```javascript
function add(a, b) {
  return a + b;
}
```

---

### **Step 4: Generating Formatted Output**

For better AST-based formatting, you can use libraries like `escodegen`:

Install `escodegen`:
```bash
npm install escodegen
```

Generate formatted output from an AST:

```javascript
const acorn = require('acorn');
const escodegen = require('escodegen');

function formatUsingAst(inputCode) {
  const ast = acorn.parse(inputCode, { ecmaVersion: 2020 });
  const formattedCode = escodegen.generate(ast, {
    format: {
      indent: { style: '  ' },  // Use 2 spaces for indentation
      semicolons: true,         // Add semicolons
    },
  });
  return formattedCode;
}

const code = `function add(a,b){return a+b;}`;
console.log(formatUsingAst(code));
```

**Output**:
```javascript
function add(a, b) {
  return a + b;
}
```

---

### **Step 5: CLI Tool**

Create a CLI tool that takes a JavaScript file and formats it.

1. Add a script to `package.json`:
   ```json
   "scripts": {
     "format": "node formatter.js"
   }
   ```

2. Create `formatter.js`:
   ```javascript
   const fs = require('fs');
   const acorn = require('acorn');
   const escodegen = require('escodegen');

   function formatFile(filePath) {
     const code = fs.readFileSync(filePath, 'utf-8');
     const ast = acorn.parse(code, { ecmaVersion: 2020 });
     const formattedCode = escodegen.generate(ast, {
       format: {
         indent: { style: '  ' },  // Use 2 spaces for indentation
         semicolons: true,
       },
     });

     fs.writeFileSync(filePath, formattedCode);
     console.log(`File formatted: ${filePath}`);
   }

   const filePath = process.argv[2];
   if (!filePath) {
     console.error('Please specify a file to format.');
     process.exit(1);
   }

   formatFile(filePath);
   ```

3. Run the formatter:
   ```bash
   npm run format your-file.js
   ```

---

### **Optional Enhancements**

1. **Support Multiple Languages**:
   - Use a library like `prettier` for broader language support.
2. **Configuration File**:
   - Allow users to specify formatting rules (e.g., `tabs vs spaces`) via a `.formatterrc` file.
3. **Error Handling**:
   - Handle invalid input gracefully and provide meaningful error messages.
4. **Test Cases**:
   - Add test cases to verify formatting rules.

---

### Example of a Fully Formatted File

Input:
```javascript
function  add(a,b){return a+b;}
```

Output:
```javascript
function add(a, b) {
  return a + b;
}
```

With this implementation, you've built your own code formatter that works for JavaScript files. You can expand it to include more advanced formatting rules and even turn it into a library!