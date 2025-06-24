const fs = require('fs');
const path = require('path');

// Read the registry.json
const registryPath = path.join(__dirname, '..', 'public', 'r', 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

// Filter installable components
const installableComponents = registry.items.filter(
  item => item.type === 'registry:component' || item.type === 'registry:block'
);

// Extract all unique dependencies
const allDependencies = new Set();
installableComponents.forEach(component => {
  if (component.dependencies) {
    component.dependencies.forEach(dep => allDependencies.add(dep));
  }
});

// Create the all-components meta file
const allComponents = {
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "all-components",
  "type": "registry:component",
  "title": "All Mini App UI Components",
  "description": "Install all hellno/mini-app-ui components at once",
  "dependencies": Array.from(allDependencies).sort(),
  "registryDependencies": installableComponents.map(
    component => `https://hellno-mini-app-ui.vercel.app/r/${component.name}.json`
  ),
  "files": []
};

// Write the all-components.json file
const outputPath = path.join(__dirname, '..', 'public', 'r', 'all-components.json');
fs.writeFileSync(outputPath, JSON.stringify(allComponents, null, 2));

console.log('✅ Generated all-components.json with', installableComponents.length, 'components');