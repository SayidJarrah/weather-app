import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const outputDir = 'dist';

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const filesToCopy = ['index.html', 'styles.css', 'script.js'];

filesToCopy.forEach((file) => {
  copyFileSync(file, join(outputDir, file));
});

console.log(`Copied ${filesToCopy.length} files into ./${outputDir}`);
