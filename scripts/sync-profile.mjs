import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

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

const tempRoot = await mkdtemp(join(tmpdir(), 'dithob-profile-sync-'));
const tempDir = join(tempRoot, 'profile-repo');
const askpass = join(tempRoot, 'git-askpass.sh');

await writeFile(
  askpass,
  '#!/bin/sh\ncase "$1" in\n  *Username*) printf "%s\\n" "x-access-token" ;;\n  *) printf "%s\\n" "$PROFILE_REPO_TOKEN" ;;\nesac\n',
  { mode: 0o700 },
);
await chmod(askpass, 0o700);

const gitEnv = {
  ...process.env,
  GIT_ASKPASS: askpass,
  GIT_TERMINAL_PROMPT: '1',
};
const runGit = (args, options = {}) => run('git', args, { ...options, env: gitEnv });

try {
  runGit(['clone', '--depth', '1', `https://github.com/${targetRepo}.git`, tempDir]);

  for (const [index, file] of targetFiles.entries()) {
    await writeFile(resolve(tempDir, file), sourceContents[index]);
  }

  runGit(['-C', tempDir, 'config', 'user.name', 'github-actions[bot]']);
  runGit(['-C', tempDir, 'config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);

  let changed = false;
  try {
    runGit(['-C', tempDir, 'diff', '--quiet', '--', ...targetFiles]);
  } catch {
    changed = true;
  }

  if (!changed) {
    console.log('PROFILE_SYNC_NOOP Profile repository already matches source');
  } else {
    runGit(['-C', tempDir, 'add', ...targetFiles]);
    runGit(['-C', tempDir, 'commit', '-m', 'docs: sync profile README from website source']);
    runGit(['-C', tempDir, 'push', 'origin', 'HEAD:main']);
    console.log(`PROFILE_SYNC_OK ${targetRepo}`);
  }
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
