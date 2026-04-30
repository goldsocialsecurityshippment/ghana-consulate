import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

export function getJsonContent<T>(filename: string): T {
  const filePath = path.join(contentDir, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export function getMarkdownContent(filename: string): string {
  const filePath = path.join(contentDir, filename);
  return fs.readFileSync(filePath, 'utf-8');
}
