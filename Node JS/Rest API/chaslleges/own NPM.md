Building your own `npm` (Node Package Manager) from scratch is an ambitious and rewarding project. It will allow you to learn how package management systems work, how to interact with the file system, manage dependencies, and more.

Here’s a high-level breakdown of the process to build a simple version of `npm`:

### Stages to Build Your Own NPM:

1. **Initialization**: Build a system to initialize a package.json file, similar to how `npm init` works.
2. **Install Packages**: Create the functionality to download packages from a registry and store them in a local directory.
3. **Versioning and Dependencies**: Implement a way to manage package versions and resolve dependencies.
4. **Publish Packages**: Simulate a registry for publishing and retrieving packages.
5. **Run Scripts**: Add the ability to run scripts defined in the `package.json` file.
6. **Uninstall Packages**: Allow the removal of packages from the local project.

### Let's break this down into each stage with code examples:

---

### 1. **Initialization: `init` Command (Create package.json)**

We'll start by creating the `npm init` functionality, which will create a `package.json` file.

```javascript
const fs = require('fs');
const path = require('path');

function initPackageJson() {
  const packageJson = {
    name: "my-package",
    version: "1.0.0",
    description: "",
    main: "index.js",
    scripts: {},
    dependencies: {},
    devDependencies: {},
    author: "",
    license: "ISC",
  };

  fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(packageJson, null, 2));
  console.log('package.json has been created!');
}

initPackageJson();
```

- **Explanation**: This script creates a basic `package.json` file with some predefined fields like `dependencies`, `scripts`, `version`, etc.

---

### 2. **Install Packages: Fetching Packages and Storing Locally**

We can install packages from the npm registry (using `https://registry.npmjs.org/`) and store them in a `node_modules` directory.

Here’s an example of installing a package:

```javascript
const https = require('https');
const fs = require('fs');
const path = require('path');

function installPackage(packageName) {
  const registryUrl = `https://registry.npmjs.org/${packageName}`;
  
  https.get(registryUrl, (res) => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    
    res.on('end', () => {
      const packageData = JSON.parse(data);
      const version = packageData['dist-tags'].latest;
      const tarballUrl = packageData.versions[version].dist.tarball;
      downloadPackage(tarballUrl, packageName);
    });
  });
}

function downloadPackage(url, packageName) {
  https.get(url, (res) => {
    const fileStream = fs.createWriteStream(path.join(process.cwd(), 'node_modules', packageName + '.tgz'));
    res.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log(`${packageName} has been installed.`);
    });
  });
}

installPackage('lodash');  // Example of installing lodash
```

- **Explanation**: This code fetches package metadata from the npm registry, retrieves the latest version’s tarball (package archive), and stores it in the `node_modules` folder.

---

### 3. **Versioning and Dependency Management**

Now, let’s resolve dependencies. We need to check the `package.json` for dependencies and recursively install them.

Example of resolving dependencies:

```javascript
const fs = require('fs');
const path = require('path');

function resolveDependencies() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
  
  // Install dependencies
  Object.keys(packageJson.dependencies).forEach(dep => {
    installPackage(dep); // Call installPackage from the previous section
  });
}

resolveDependencies();
```

- **Explanation**: This will loop through the `dependencies` in `package.json` and install them.

---

### 4. **Publish Packages: A Simple Registry Simulation**

To simulate the publishing of packages, let’s create a local directory (e.g., `.npm-registry`) to store packages.

```javascript
const fs = require('fs');
const path = require('path');

function publishPackage(packageName, version, packageData) {
  const registryPath = path.join(process.cwd(), '.npm-registry');
  if (!fs.existsSync(registryPath)) {
    fs.mkdirSync(registryPath);
  }

  const packagePath = path.join(registryPath, `${packageName}-${version}.json`);
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
  console.log(`${packageName}@${version} has been published!`);
}

// Example package data to publish
const packageData = {
  name: 'my-package',
  version: '1.0.0',
  description: 'A simple package',
  main: 'index.js',
  dependencies: {}
};

publishPackage('my-package', '1.0.0', packageData);
```

- **Explanation**: This simulates publishing a package to a local registry by saving the package data to a file inside the `.npm-registry` directory.

---

### 5. **Run Scripts Defined in package.json**

To run scripts (e.g., `npm run start`), you need to execute commands listed under the `scripts` section of `package.json`.

Here’s an example of running a script:

```javascript
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function runScript(scriptName) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));

  if (packageJson.scripts && packageJson.scripts[scriptName]) {
    const script = packageJson.scripts[scriptName];
    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  } else {
    console.log(`Script ${scriptName} not found`);
  }
}

// Example usage: npm run start
runScript('start');
```

- **Explanation**: This reads the `scripts` section of `package.json` and executes the associated command using `child_process.exec`.

---

### 6. **Uninstall Packages**

To uninstall packages, we can remove their files from `node_modules` and update the `package.json` dependencies.

```javascript
const fs = require('fs');
const path = require('path');

function uninstallPackage(packageName) {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules', packageName);
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  // Remove the package from node_modules
  if (fs.existsSync(nodeModulesPath)) {
    fs.rmdirSync(nodeModulesPath, { recursive: true });
    console.log(`${packageName} has been uninstalled.`);
  } else {
    console.log(`${packageName} is not installed.`);
  }

  // Remove the package from dependencies in package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
  if (packageJson.dependencies && packageJson.dependencies[packageName]) {
    delete packageJson.dependencies[packageName];
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`${packageName} has been removed from package.json.`);
  }
}

uninstallPackage('lodash');
```

- **Explanation**: This removes the package from `node_modules` and deletes its entry from `dependencies` in `package.json`.

---

### Conclusion

By following these steps, you can build a basic version of `npm` that includes:

- Package initialization (`npm init`)
- Installing and managing dependencies
- Publishing packages to a local registry
- Running scripts defined in `package.json`
- Uninstalling packages

This simple version doesn’t cover all of the advanced features and optimizations of `npm`, such as version resolution, lock files (`package-lock.json`), or working with registries, but it provides a foundational understanding of how package managers work under the hood. You can continue building upon this by adding more complex features, improving performance, and handling edge cases.