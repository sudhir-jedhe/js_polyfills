const fs = require('fs');

for (let i = 7; i <= 135; i++) {
  fs.writeFileSync(`${i}.md`, `# File ${i}\n`);
}
console.log('✅ Created files 7.md through 135.md');