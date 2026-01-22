const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname);
const outputPath = path.resolve(__dirname, '..', 'esipcametalica-deploy.zip');

// Remove old zip
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
}

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✓ ZIP created!`);
  console.log(`✓ Size: ${sizeMB} MB`);
  console.log(`✓ Path: ${outputPath}`);
});

archive.on('error', (err) => {
  console.error('Error:', err);
  process.exit(1);
});

archive.pipe(output);

// Add files, excluding certain folders
archive.glob('**/*', {
  cwd: sourceDir,
  ignore: [
    '.git/**',
    '.vercel/**',
    '.vs/**',
    'node_modules/**',
    '.next/**',
    'create-zip.js'
  ]
});

archive.finalize();
