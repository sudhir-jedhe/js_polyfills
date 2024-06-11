// What could be a developer's worst nightmare than having their app's source code exposed? If you are a front-end developer, you should be more concerned, as there are various ways your app’s source code will be exposed and one of the most overlooked ways is “source mapping."

// What is a source map?
// A source map is a file that maps a file’s original source code (such as a JavaScript file) to its generated version (such as code that has been compiled and minified).

// The source map file has the names of the files, the line numbers, and a map of the code that has been compiled from the original source code. By displaying the original source code, the source map assists developers in troubleshooting built programs.

// Web developers use source mapping to translate, shrink, and bundle JavaScript code to make websites run faster, but this makes it harder to find bugs. Source mapping can help debug and create CSS, graphics, and other programs.

// Is a source map necessary?
// Source maps are important because they let developers troubleshoot their original source code while working with the generated version. This makes the code easier to read and understand.

// Source maps let you connect the original source code to the code that was made, which solves the problem. When a developer is debugging compiled code, they can use the source map to view the original source code, which makes it easier to identify and resolve errors.

// Source maps also let developers debug code on a live website or app. They can use the browser's developer tools to look at the original source code and set breakpoints, just like they would when developing locally.

// Source map and security implications
// A source map is obviously helpful for debugging, but it also raises security concerns. It can expose a program’s or website’s original source code, which may reveal things like passwords or private data.

// The information included in a file’s source code, such as passwords or other secrets, could be exposed if a source map were to be used to read the file.

// An attacker who is hunting for vulnerabilities may find source maps helpful because they show the structure and organization of the software.

// A misconfigured source map could expose the original source code to attackers or harmful third parties.

// When an attacker obtains a source map, they can use it to reconstruct the original programs, which could lead to the discovery of security flaws or other private details.

// With the help of source maps, attackers can insert malicious code into legitimate files, potentially granting them execution privileges on the victim’s computer.

// Thanks for reading Zero To Architect! Subscribe for free to receive new posts and support my work.

// Type your email...
// Subscribe
// How to not generate a source map in production?
// The process for avoiding the creation of a source map during the building and compiling of your code will vary depending on the tool or framework you employ. Some instances are as follows:

// // Webpack
// module.exports = {
//   devtool: 'none',
//   // ...
// };
// // Babel
// babel --sourceMaps false script.js
// //typescript
// {
//     "compilerOptions": {
//         "sourceMap": false,
//         //...
//     },
//     //...
// }
// //Rollup
// export default {
//   input: 'src/index.js',
//   output: {
//     file: 'dist/bundle.js',
//     format: 'cjs',
//     sourcemap: false
//   }
// };
// How to generate a source map for a React application?
// Set “GENERATE SOURCEMAP=false” in your .env file in the root of your project directory.

// 2. Change the React scripts command

// // package.json
// "build": "GENERATE_SOURCEMAP=false react-scripts build"
// 3. You can use the webpack configuration as discussed above.

// Is there a way to save source maps securely and access them?
// Source maps can be protected against unauthorized access and disclosure of important data by being stored in external, password-protected files.

// Following these instructions will allow you to securely store your source maps in external files:

// Take advantage of a build tool that gives you control over where the source map file is written. The dev tool option in Webpack, for instance, lets you set where the source map file is written.

// Protect the original map file by uploading it to a file hosting service that offers encryption. The source map file, for instance, can have its rights restricted using AWS S3 so that only certain people can access it.

// Use an authorization tool to limit who can access the source map file, such as JSON Web Tokens (JWT).

// Utilize Content Security Policy (CSP): CSP is a security feature that aids in detecting and mitigating specific attacks, such as Cross-Site Scripting (XSS) and data injection attacks. It can be used to restrict who can access the source map file by specifying which sources are authorized to load content in the browser.

// It’s worth noting that these measures can aid in securing the source map file, but cannot ensure the entire security of the source code. Reviewing the codebase and expunging private details is a recommended best practice.

// How to debug your code without a source map?
// Pretty-print the code: Some minifiers and transpilers include white spaces and comments to make the code more legible. This simplifies code comprehension and debugging.

// Set breakpoints and step through code with a debugger: Many recent browsers feature built-in developer tools. The debugger can help you comprehend the code flow and find bugs even if it’s not as readable as the original source code.

// Use a decompiler: A decompiler can turn compiled code into readable code. The resulting code may be simpler to comprehend and troubleshoot.

// Knowing the code structure may help you understand it without a source map. Even if the code is minified, you may be able to discover and debug a method that handles a feature.

// Logging: Use console.log commands to output variable values to understand the code flow and discover faults.