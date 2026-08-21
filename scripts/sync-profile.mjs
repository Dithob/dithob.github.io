import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const sourceFiles = ['profile/README.md', 'profile/README.en.md'];
const targetRepo = 'Dithob/Dithob';
const targetFiles = ['README.md', 'README.en.md'];
const mode = process.argv[2] ?? '--check';

const run = (command, args, options = {}) => execFileSync(command, args, { cwd: root, stdio: 'inherit', ...options });

const sourceContents = await Promise.all(sourceFiles.map((file) => readFile(resolve(root, file), 'utf8')));

if (mode === '--check') {
  for (const [index, content] of sourceContents.entries()) {
    if (!content.trim()) throw new Error(`${sourceFiles[index]} is empty`);
  }
  if (!sourceContents[0].includes('README.en.md') || !sourceContents[1].includes('README.md')) {
    throw new Error('Profile README language links are incomplete');
  }
  console.log(`PROFILE_SOURCE_OK ${sourceFiles.join(' ')}`);
  process.exit(0);
}

if (mode !== '--publish') {
  throw new Error(`Unknown mode: ${mode}. Use --check or --publish.`);
}

if (!process.env.PROFILE_REPO_TOKEN) throw new Error('PROFILE_REPO_TOKEN is required for --publish');

const remoteUrl = `https://x-access-token:${encodeURIComponent(process.env.PROFILE_REPO_TOKEN)}@github.com/${targetRepo}.git`;
const tempDir = resolve('/tmp', `dithob-profile-sync-${process.pid}`);
run('git', ['clone', '--depth', '1', remoteUrl, tempDir]);

for (const [index, file] of targetFiles.entries()) {
  await writeFile(resolve(tempDir, file), sourceContents[index]);
}

run('git', ['-C', tempDir, 'config', 'user.name', 'github-actions[bot]']);
run('git', ['-C', tempDir, 'config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);

let changed = false;
try {
  run('git', ['-C', tempDir, 'diff', '--quiet', '--', ...targetFiles]);
} catch {
  changed = true;
}

if (!changed) {
  console.log('PROFILE_SYNC_NOOP Profile repository already matches source');
  process.exit(0);
}

run('git', ['-C', tempDir, 'add', ...targetFiles]);
run('git', ['-C', tempDir, 'commit', '-m', 'docs: sync profile README from website source']);
run('git', ['-C', tempDir, 'push', 'origin', 'HEAD:main']);
console.log(`PROFILE_SYNC_OK ${targetRepo}`);
