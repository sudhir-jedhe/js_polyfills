# SOLID Principles in JavaScript

The **SOLID** principles are a set of five design principles that help developers create software that is easy to maintain, understand, and extend. These principles were originally defined for object-oriented programming (OOP), but they can be applied to JavaScript as well.

---

## 1. **Single Responsibility Principle (SRP)**

**A class should have only one reason to change**, meaning it should have one job or responsibility. When a class has more than one responsibility, it becomes harder to maintain and extend.

### Example:

```javascript
// Bad Example - Violates SRP
class User {
  constructor(name) {
    this.name = name;
  }

  saveUser() {
    console.log('Saving user to the database...');
  }

  logUserAction() {
    console.log('Logging user action...');
  }
}

// Good Example - Follows SRP
class User {
  constructor(name) {
    this.name = name;
  }
}

class UserRepository {
  saveUser(user) {
    console.log('Saving user to the database...');
  }
}

class UserLogger {
  logUserAction(user) {
    console.log('Logging user action...');
  }
}
```

**Bad Example:** The User class is doing too much: saving the user and logging actions.
**Good Example:** We separate responsibilities into different classes (UserRepository for saving, UserLogger for logging).


## 2. **Open/Closed Principle (OCP)**
Software entities (classes, modules, functions) should be open for extension, but closed for modification. This principle allows you to add new functionality to a class without modifying its existing code.

Example:
```js
// Bad Example - Violates OCP
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

class AreaCalculator {
  calculateArea(shape) {
    if (shape instanceof Rectangle) {
      return shape.width * shape.height;
    }
  }
}

// Good Example - Follows OCP
class Shape {
  calculateArea() {
    throw new Error("Method 'calculateArea' should be implemented.");
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  calculateArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  calculateArea() {
    return Math.PI * this.radius * this.radius;
  }
}

class AreaCalculator {
  calculateArea(shape) {
    return shape.calculateArea();
  }
}

```
**Bad Example:** The AreaCalculator needs to be modified every time a new shape is added.
**Good Example:** Each shape class implements calculateArea, and AreaCalculator doesn't need to change when new shapes are added.


## 3. Liskov Substitution Principle (LSP)
Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.

Example:
```js
// Bad Example - Violates LSP
class Bird {
  fly() {
    console.log('Flying...');
  }
}

class Ostrich extends Bird {
  fly() {
    throw new Error('Ostriches can\'t fly!');
  }
}

// Good Example - Follows LSP
class Bird {
  move() {
    console.log('Moving...');
  }
}

class Sparrow extends Bird {
  move() {
    console.log('Flying...');
  }
}

class Ostrich extends Bird {
  move() {
    console.log('Running...');
  }
}
```
**Bad Example:** Ostrich violates LSP because it can't fly but inherits from Bird.
**Good Example:** Both Sparrow and Ostrich extend Bird, but override move according to their behavior.

## 4. Interface Segregation Principle (ISP)
Clients should not be forced to depend on interfaces they do not use. This principle suggests that large, unwieldy interfaces should be split into smaller, more specific ones.

Example:
```js
// Bad Example - Violates ISP
class Printer {
  print() {
    console.log('Printing...');
  }
  
  scan() {
    console.log('Scanning...');
  }
  
  fax() {
    console.log('Faxing...');
  }
}

class MultiFunctionPrinter extends Printer {
  print() {
    console.log('Printing...');
  }

  scan() {
    console.log('Scanning...');
  }

  fax() {
    console.log('Faxing...');
  }
}

class OldPrinter extends Printer {
  print() {
    console.log('Printing...');
  }

  scan() {
    throw new Error('OldPrinter does not support scanning');
  }

  fax() {
    throw new Error('OldPrinter does not support faxing');
  }
}

// Good Example - Follows ISP
class Printer {
  print() {
    console.log('Printing...');
  }
}

class Scanner {
  scan() {
    console.log('Scanning...');
  }
}

class FaxMachine {
  fax() {
    console.log('Faxing...');
  }
}

class MultiFunctionPrinter extends Printer {
  constructor() {
    super();
    this.scanner = new Scanner();
    this.faxMachine = new FaxMachine();
  }
}

class OldPrinter extends Printer {
  print() {
    console.log('Printing...');
  }
}
.
```
**Bad Example:** The OldPrinter class is forced to implement methods it doesn't need (like scan() and fax()).
**Good Example:** We split the responsibilities into separate classes (Printer, Scanner, FaxMachine).

## 5. Dependency Inversion Principle (DIP)
High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions. This principle aims to reduce the coupling between high-level and low-level modules.

Example:
```js
// Bad Example - Violates DIP
class FileReader {
  readFile() {
    // Reads file directly
  }
}

class FileProcessor {
  constructor() {
    this.fileReader = new FileReader(); // High-level class depends directly on low-level class
  }

  process() {
    this.fileReader.readFile();
  }
}

// Good Example - Follows DIP
class FileReader {
  readFile() {
    throw new Error('Not implemented');
  }
}

class TextFileReader extends FileReader {
  readFile() {
    console.log('Reading text file...');
  }
}

class PDFFileReader extends FileReader {
  readFile() {
    console.log('Reading PDF file...');
  }
}

class FileProcessor {
  constructor(fileReader) {
    this.fileReader = fileReader; // Now the high-level class depends on abstraction
  }

  process() {
    this.fileReader.readFile();
  }
}

const textFileReader = new TextFileReader();
const fileProcessor = new FileProcessor(textFileReader);
fileProcessor.process();  // Output: Reading text file...

```
**Bad Example:** FileProcessor directly depends on FileReader, a low-level class.
**Good Example:** FileProcessor depends on the abstraction FileReader, and specific file readers (TextFileReader, PDFFileReader) are passed to it.

**Conclusion**
The SOLID principles help developers write clean, maintainable, and flexible code. Here's a quick recap:

`SRP (Single Responsibility Principle):` A class should have one reason to change.
`OCP (Open/Closed Principle):` A class should be open for extension but closed for modification.
`LSP (Liskov Substitution Principle):` Subtypes must be substitutable for their base types without affecting correctness.
`ISP (Interface Segregation Principle):` Clients should not be forced to depend on methods they do not use.
`DIP (Dependency Inversion Principle):` High-level modules should depend on abstractions, not low-level modules.