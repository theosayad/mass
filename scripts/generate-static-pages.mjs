import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const templatePath = path.join(rootDir, 'static-pages', 'template.html');
const footerPath = path.join(rootDir, 'static-pages', 'partials', 'footer.html');
const pagesDir = path.join(rootDir, 'static-pages', 'pages');
const outputDir = path.join(rootDir, 'public');

const pages = [
  { file: 'privacy.html', title: 'Privacy Policy • Mass Times Lebanon' },
  { file: 'terms.html', title: 'Terms of Service • Mass Times Lebanon' },
  { file: 'support.html', title: 'Support • Mass Times Lebanon' },
  { file: 'parish-support.html', title: 'Parish Support • Mass Times Lebanon' },
  { file: 'emergency-contacts.html', title: 'Emergency Contacts • Mass Times Lebanon' },
];

const replaceAll = (input, replacements) => {
  let output = input;
  for (const [key, value] of Object.entries(replacements)) {
    output = output.split(key).join(value);
  }
  return output;
};

const main = async () => {
  const [template, footer] = await Promise.all([
    fs.readFile(templatePath, 'utf8'),
    fs.readFile(footerPath, 'utf8'),
  ]);

  await fs.mkdir(outputDir, { recursive: true });

  await Promise.all(
    pages.map(async ({ file, title }) => {
      const contentPath = path.join(pagesDir, file);
      const content = await fs.readFile(contentPath, 'utf8');
      const html = replaceAll(template, {
        '{{TITLE}}': title,
        '{{CONTENT}}': content.trim(),
        '{{FOOTER}}': footer.trim(),
      });
      await fs.writeFile(path.join(outputDir, file), `${html.trim()}\n`, 'utf8');
    }),
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
