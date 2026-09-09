const fs = require('fs');
const path = require('path');

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const header = `***  ${entry.name} ***\n\n`;
      const originalContent = fs.readFileSync(fullPath, 'utf8');
      
      fs.writeFileSync(fullPath, header + originalContent, 'utf8');
      console.log(`Updated: ${fullPath}`);
    }
  }
}

// Run from current directory
processDirectory(process.cwd());