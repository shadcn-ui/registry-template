#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Clean up the generated registry files by removing invalid "." dependencies
 * that get added by shadcn CLI when it encounters @/ alias imports
 */
function cleanRegistryFiles() {
  const registryDir = path.join(process.cwd(), 'public/r');
  const jsonFiles = glob.sync('*.json', { cwd: registryDir });
  
  let cleanedCount = 0;
  
  for (const file of jsonFiles) {
    const filePath = path.join(registryDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const data = JSON.parse(content);
      
      if (data.dependencies && Array.isArray(data.dependencies)) {
        const originalLength = data.dependencies.length;
        // Remove "." dependencies and deduplicate
        data.dependencies = [...new Set(data.dependencies.filter(dep => dep !== '.'))];
        
        if (data.dependencies.length !== originalLength) {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          console.log(`✅ Cleaned ${file}: removed invalid dependencies`);
          cleanedCount++;
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  if (cleanedCount === 0) {
    console.log('✅ All registry files are clean');
  } else {
    console.log(`✅ Cleaned ${cleanedCount} registry files`);
  }
}

cleanRegistryFiles();