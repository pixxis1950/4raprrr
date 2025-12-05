const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Assuming scripts/ is at the root
const contentDir = path.join(__dirname, '../content');
// Output to root as a TS file
const outputFile = path.join(__dirname, '../posts.ts');

// Create content dir if not exists
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
  console.log('Created content directory');
}

// Get all MD files
let files = [];
try {
  files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
} catch (e) {
  console.log("No markdown files found or directory error.");
}

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Split accented characters into their base chars and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const posts = files.map(filename => {
  const filePath = path.join(contentDir, filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Generate slug from title if not explicitly provided in frontmatter
  const slug = data.slug || (data.title ? slugify(data.title) : filename.replace('.md', ''));

  return {
    id: filename.replace('.md', ''),
    slug: slug,
    ...data,
    content: content,
    // Default image if not provided in MD
    imageUrl: data.imageUrl || `https://picsum.photos/seed/${filename}/800/600`
  };
});

// Sort by date new to old
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate TS content
const fileContent = `import { Post } from './types';

export const posts: Post[] = ${JSON.stringify(posts, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent);
console.log(`✅ Successfully generated ${posts.length} posts to posts.ts`);