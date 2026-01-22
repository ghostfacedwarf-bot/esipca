const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname);
const outputPath = path.resolve(__dirname, '..', 'esipcametalica-full-deploy.zip');

// Remove old zip
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
}

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 6 }
});

output.on('close', () => {
  const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✓ Full ZIP created!`);
  console.log(`✓ Size: ${sizeMB} MB`);
  console.log(`✓ Includes: node_modules, .next, everything!`);
  console.log(`✓ Path: ${outputPath}`);
});

archive.on('error', (err) => {
  console.error('Error:', err);
  process.exit(1);
});

archive.pipe(output);

// Add ALL files, only excluding .git and .vercel
console.log('Creating archive with node_modules and .next...');
archive.glob('**/*', {
  cwd: sourceDir,
  ignore: [
    '.git/**',
    '.vercel/**',
    '.vs/**',
    'create-zip.js',
    'create-full-zip.js',
    '.github/**'
  ],
  dot: true
});

archive.finalize();
