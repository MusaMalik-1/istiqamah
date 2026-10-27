const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Fetching GitHub authorization token from gh CLI...');
  const token = execSync('gh auth token', { encoding: 'utf8' }).trim();
  if (!token) {
    throw new Error('No GitHub token returned from "gh auth token". Please login with "gh auth login".');
  }
  console.log('Token acquired. Building and publishing release to GitHub...');

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  execSync('npx electron-builder --win nsis portable --publish always', {
    stdio: 'inherit',
    env: {
      ...process.env,
      GH_TOKEN: token,
      GITHUB_TOKEN: token
    }
  });

  // Ensure the release is published out of draft and marked latest
  console.log(`Publishing release v${pkg.version} out of draft...`);
  try {
    execSync(`gh release edit v${pkg.version} --draft=false --latest`, { stdio: 'inherit' });
  } catch (e) {
    console.warn('Could not auto-publish draft:', e.message);
  }

  // Ensure hyphenated installer is uploaded for electron-updater compatibility
  const setupSpace = path.join('dist', `Istiqamah Setup ${pkg.version}.exe`);
  const setupHyphen = path.join('dist', `Istiqamah-Setup-${pkg.version}.exe`);
  const blockmapSpace = path.join('dist', `Istiqamah Setup ${pkg.version}.exe.blockmap`);
  const blockmapHyphen = path.join('dist', `Istiqamah-Setup-${pkg.version}.exe.blockmap`);

  if (fs.existsSync(setupSpace)) {
    fs.copyFileSync(setupSpace, setupHyphen);
    fs.copyFileSync(blockmapSpace, blockmapHyphen);
    console.log(`Uploading exact hyphenated assets for v${pkg.version}...`);
    execSync(`gh release upload v${pkg.version} "${setupHyphen}" "${blockmapHyphen}" --clobber`, { stdio: 'inherit' });
  }

  console.log('Release published to GitHub successfully!');
} catch (err) {
  console.error('Publish failed:', err.message);
  process.exit(1);
}
