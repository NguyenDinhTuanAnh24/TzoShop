const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const mojibakePatterns = [
    /Ä‘/g, /Ă /g, /Ă¡/g, /Ă /g, /Ă©/g, /Ă¨/g, /Ă­/g, /Ă²/g, /Ă³/g, /Ă¹/g, /Ăº/g, /Ă½/g,
    /áº¡/g, /áº£/g, /áº¥/g, /áº§/g, /áº©/g, /áº«/g, /áº­/g, /áº¯/g, /áº±/g, /áº³/g, /áºµ/g, /áº·/g,
    /á»/g, /á»/g, /á»/g, /á»/g, /á»/g, /á»/g, /á»/g, /á»/g, /á»/g, /á»¡/g, /á»£/g, /á»§/g, /á»©/g, /á»«/g, /á»­/g, /á»¯/g, /á»±/g, /á»³/g, /á»µ/g, /á»·/g, /á»¹/g,
    /Äƒ/g, /Ă¢/g, /Ăª/g, /Ă´/g, /Æ¡/g, /Æ°/g
];

function isMojibake(content) {
    return mojibakePatterns.some(p => p.test(content));
}

function fixMojibake(content) {
    try {
        // This is a common way to fix UTF-8 that was interpreted as Latin1
        // We encode the string back to Latin1 bytes and then decode as UTF-8
        return Buffer.from(content, 'latin1').toString('utf8');
    } catch (e) {
        return content;
    }
}

const srcDir = path.join(__dirname, '..', 'src');

walk(srcDir, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (isMojibake(content)) {
            const fixed = fixMojibake(content);
            if (fixed !== content) {
                console.log(`Fixing ${filePath}...`);
                fs.writeFileSync(filePath, fixed, 'utf8');
            }
        }
    }
});
