const fs = require('fs');
const path = require('path');

// Get the list of all files in the current directory
const files = fs.readdirSync(__dirname);

// Loop through all files
files.forEach(file => {
    // Check if the file has a .js extension
    if (path.extname(file) === '.js') {
        // Construct the new filename with .md extension
        const newFileName = path.join(__dirname, path.basename(file, '.js') + '.md');

        // Rename the file
        fs.renameSync(path.join(__dirname, file), newFileName);

        console.log(`Renamed: ${file} -> ${newFileName}`);
    }
});
