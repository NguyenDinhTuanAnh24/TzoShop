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

  // Replace imports
  if (content.includes('getServerUser')) {
    content = content.replace(
      /import \{ getServerUser \} from "@\/lib\/auth-helper";/g,
      `import { requireCurrentUser, requireAdminUser } from "@/lib/server/current-user";`
    );
  }

  // Admin APIs
  if (filePath.includes('admin')) {
    content = content.replace(/const user = await getServerUser\(\);[\s\S]*?(if \(!user \|\| user\.role !== "ADMIN"\) \{[\s\S]*?return NextResponse\.json\([\s\S]*?\{ status: 403 \}\s*\);?\s*\})/g, 'const user = await requireAdminUser();');
    
    // Some admin APIs might have slightly different checks
    content = content.replace(/const user = await getServerUser\(\);[\s\S]*?if \(!user \|\| user\.role !== 'ADMIN'\) \{[\s\S]*?\}/g, 'const user = await requireAdminUser();');
  } else {
    // User APIs
    content = content.replace(/const user = await getServerUser\(\);[\s\S]*?(if \(!user\) \{[\s\S]*?return NextResponse\.json\([\s\S]*?\{ status: 401 \}\s*\);?\s*\})/g, 'const user = await requireCurrentUser();');
  }

  // Add a try-catch error handler at the top of catch blocks to handle UNAUTHORIZED / FORBIDDEN
  content = content.replace(/catch \((error|e|err)\) \{/g, `catch ($1) {
    if ($1 instanceof Error) {
      if ($1.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: { message: "Vui lòng đăng nhập để tiếp tục." } }, { status: 401 });
      }
      if ($1.message === "FORBIDDEN") {
        return NextResponse.json({ error: { message: "Không có quyền truy cập." } }, { status: 403 });
      }
    }`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated:', filePath);
  }
});
