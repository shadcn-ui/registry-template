import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables for testing
const envFiles = [
  '.env.local',
  '.env'
];

for (const file of envFiles) {
  config({ path: resolve(process.cwd(), file) });
}

// Export so it can be imported
export {};