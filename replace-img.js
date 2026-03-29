import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const files = globSync('src/**/*.astro');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  if (content.includes('<img ') || content.includes('<img\n') || content.includes('<img\r')) {
    // Replace <img with <ImageMod
    content = content.replace(/<img\s/g, '<ImageMod ');
    content = content.replace(/<img\n/g, '<ImageMod\n');
    content = content.replace(/<img\r/g, '<ImageMod\r');
    
    // Check if ImageMod is imported
    if (!content.includes('ImageMod')) {
      // Find imports section in frontmatter
      let importStatement = 'import ImageMod from "@/components/ImageMod.astro";\n';
      
      // Some components might be inside src/layouts/components, so they might prefer relative, 
      // but Astro handles absolute alias @/components correctly if configured.
      // Wait, let's check alias in tsconfig.json. Astroplate usually sets @/components -> src/layouts/components
      // To be safe, let's use the alias from the file we saw earlier!
      // In features.astro, I imported: import ImageMod from "@/layouts/components/ImageMod.astro";
      
      const componentAlias = 'import ImageMod from "@/layouts/components/ImageMod.astro";';
      
      if (!content.includes(componentAlias)) {
        // Insert it right after the first `---` block opening
        content = content.replace(/^---\s*\n/m, `---\n${componentAlias}\n`);
      }
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
