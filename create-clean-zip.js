const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname);
const outputPath = path.resolve(__dirname, '..', 'esipcametalica-hostinger.zip');

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
  console.log(`✓ ZIP created for Hostinger!`);
  console.log(`✓ Size: ${sizeMB} MB`);
  console.log(`✓ Includes: Source code, .next (pre-built), package.json`);
  console.log(`✓ NO node_modules (Hostinger will install fresh)`);
  console.log(`✓ Path: ${outputPath}`);
});

archive.on('error', (err) => {
  console.error('Error:', err);
  process.exit(1);
});

archive.pipe(output);

// Add files, EXCLUDING node_modules
console.log('Creating ZIP (excluding node_modules)...');
archive.glob('**/*', {
  cwd: sourceDir,
  ignore: [
    '.git/**',
    '.vercel/**',
    '.vs/**',
    'node_modules/**',  // EXCLUDE THIS - let Hostinger install
    'create-*.js',
    '.github/**',
    '*.zip'
  ],
  dot: true
});

archive.finalize();
