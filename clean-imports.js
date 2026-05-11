const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app/api', function(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  if (content.includes('import { requireCurrentUser, requireAdminUser } from "@/lib/server/current-user"')) {
    const hasRequireAdminUser = content.includes('requireAdminUser()');
    const hasRequireCurrentUser = content.includes('requireCurrentUser()');

    if (hasRequireCurrentUser && !hasRequireAdminUser) {
        content = content.replace('import { requireCurrentUser, requireAdminUser } from "@/lib/server/current-user"', 'import { requireCurrentUser } from "@/lib/server/current-user"');
    } else if (!hasRequireCurrentUser && hasRequireAdminUser) {
        content = content.replace('import { requireCurrentUser, requireAdminUser } from "@/lib/server/current-user"', 'import { requireAdminUser } from "@/lib/server/current-user"');
    } else if (!hasRequireCurrentUser && !hasRequireAdminUser) {
        content = content.replace('import { requireCurrentUser, requireAdminUser } from "@/lib/server/current-user";\n', '');
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
  }
});
