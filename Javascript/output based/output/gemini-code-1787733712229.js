const fs = require('fs');

const codeBlock = '\n```js\n\n```\n';

for (let i = 12; i <= 123; i++) {
  const filePath = `${i}.md`;
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, codeBlock);
    console.log(`Updated: ${filePath}`);
  }
}
console.log('✅ Done!');