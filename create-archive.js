const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'esipcametalica-deployment.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✅ Archive created: esipcametalica-deployment.zip (${archive.pointer()} bytes)`);
  process.exit(0);
});

archive.on('error', (err) => {
  console.error('❌ Error creating archive:', err);
  process.exit(1);
});

archive.pipe(output);

// Add directories and files
const excludePatterns = ['node_modules', '.next', '.git', '.env.local', 'dist', '.DS_Store'];

const addFilesRecursive = (sourceDir, arcDir) => {
  const files = fs.readdirSync(sourceDir);

  files.forEach(file => {
    const fullPath = path.join(sourceDir, file);
    const stats = fs.statSync(fullPath);
    const arcPath = path.join(arcDir, file);

    // Skip excluded patterns
    if (excludePatterns.some(pattern => file === pattern || fullPath.includes(pattern))) {
      return;
    }

    if (stats.isDirectory()) {
      addFilesRecursive(fullPath, arcPath);
    } else {
      archive.file(fullPath, { name: arcPath });
    }
  });
};

console.log('📦 Creating archive...');
addFilesRecursive(__dirname, '');

archive.finalize();
