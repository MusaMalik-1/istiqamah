const { execSync } = require('child_process');

try {
  console.log('Fetching GitHub authorization token from gh CLI...');
  const token = execSync('gh auth token', { encoding: 'utf8' }).trim();
  if (!token) {
    throw new Error('No GitHub token returned from "gh auth token". Please login with "gh auth login".');
  }
  console.log('Token acquired. Building and publishing release to GitHub...');

  execSync('npx electron-builder --win nsis portable --publish always', {
    stdio: 'inherit',
    env: {
      ...process.env,
      GH_TOKEN: token,
      GITHUB_TOKEN: token
    }
  });

  console.log('Release published to GitHub successfully!');
} catch (err) {
  console.error('Publish failed:', err.message);
  process.exit(1);
}
