import fs from 'fs';
import { execSync } from 'child_process';

execSync('adb shell uiautomator dump && adb pull /sdcard/window_dump.xml dump.xml', { stdio: 'inherit' });
const xml = fs.readFileSync('dump.xml', 'utf8');

const targets = [
  'Quick Fill',
  'Add to client list',
  'Client Name',
  'Company',
  'Mobile Number',
  'Email Address',
  'Add Client',
  'Close',
  'Save',
  'Create Project',
  'Create Invoice',
  'New Project',
  'Projects',
  'Finance',
  'More',
  'Home'
];

for (const target of targets) {
  const re = new RegExp(`(?:text|content-desc)="[^"]*${target}[^"]*"[^>]*bounds="([^"]+)"`, 'i');
  const m = xml.match(re);
  if (m) {
    const b = m[1];
    const nums = b.match(/\d+/g).map(Number);
    const cx = Math.round((nums[0] + nums[2]) / 2);
    const cy = Math.round((nums[1] + nums[3]) / 2);
    console.log(`Target "${target}": bounds = ${b} -> Center: (${cx}, ${cy})`);
  }
}

try { fs.unlinkSync('dump.xml'); } catch {}
