const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace console.error('Message', err) with console.error('Message', err?.message || 'Error occurred')
      let newContent = content.replace(/console\.error\((['"`][^'"`]+['"`]),\s*([a-zA-Z0-9_]+)\)/g, "console.error($1, $2?.message || 'Error occurred')");
      
      // Also replace console.error(err) with console.error(err?.message || 'Error occurred')
      newContent = newContent.replace(/console\.error\(([a-zA-Z0-9_]+)\)/g, "console.error($1?.message || 'Error occurred')");
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDir('e:/SaaS Project/Software/DesktopApp/src/renderer/src');
console.log('Done replacing console.error');
