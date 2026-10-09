const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const zipFileName = 'ISAACIFY-Mobile-App.zip';
const localZipPath = path.join(rootDir, zipFileName);
const downloadsDir = 'C:\\Users\\abhil\\Downloads';
const targetZipPath = path.join(downloadsDir, zipFileName);

// Remove existing zips if present
if (fs.existsSync(localZipPath)) {
  fs.unlinkSync(localZipPath);
  console.log(`Removed existing local ${zipFileName}`);
}
if (fs.existsSync(targetZipPath)) {
  fs.unlinkSync(targetZipPath);
  console.log(`Removed existing download ${targetZipPath}`);
}

const entries = [
  'src',
  'assets',
  'scripts',
  'android',
  'app.json',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'eslint.config.js',
  'firebase.json',
  'firestore.rules',
  '.firebaserc',
  'expo-env.d.ts',
  'README.md',
  'AGENTS.md',
  'IMPLEMENTATION_CHECKLIST.md',
  'LICENSE',
  'run.bat',
  'run-android.bat',
  'run-web.bat',
  '.gitignore'
];

// Validate that every entry exists
console.log('Verifying files and folders for packaging:');
for (const entry of entries) {
  const p = path.join(rootDir, entry);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing expected project file or folder: ${entry}`);
  }
  const stat = fs.statSync(p);
  console.log(` [✓] ${entry} (${stat.isDirectory() ? 'Directory' : `${stat.size} bytes`})`);
}

console.log('\nCreating zip archive using tar.exe -a -cf...');
const entriesArgs = entries.map(e => `"${e}"`).join(' ');
const cmd = `tar.exe -a -cf "${localZipPath}" ${entriesArgs}`;
execSync(cmd, { cwd: rootDir, stdio: 'inherit' });

if (fs.existsSync(localZipPath)) {
  const size = fs.statSync(localZipPath).size;
  const sizeMB = (size / (1024 * 1024)).toFixed(2);
  console.log(`\nLocal archive created:`);
  console.log(` Path: ${localZipPath}`);
  console.log(` Size: ${sizeMB} MB (${size} bytes)`);

  // Copy to User Downloads folder
  console.log(`\nCopying to Downloads folder: ${targetZipPath}...`);
  fs.copyFileSync(localZipPath, targetZipPath);

  if (fs.existsSync(targetZipPath)) {
    const dSize = fs.statSync(targetZipPath).size;
    const dSizeMB = (dSize / (1024 * 1024)).toFixed(2);
    console.log(`[SUCCESS] Copied to Downloads folder:`);
    console.log(` Destination: ${targetZipPath}`);
    console.log(` Size: ${dSizeMB} MB (${dSize} bytes)`);
  } else {
    throw new Error('Failed to copy zip to Downloads folder.');
  }

  // Remove local zip in root to keep root completely clean if desired
  fs.unlinkSync(localZipPath);
  console.log(`Cleaned up local zip in root. File is safely stored in Downloads.`);
} else {
  throw new Error('Zip file creation failed.');
}
