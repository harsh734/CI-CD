/**
 * Script to generate swagger.json from JSDoc annotations
 * Run: node scripts/generate-swagger.js
 */
const fs = require('fs');
const path = require('path');
const { swaggerSpec } = require('../src/configs/swagger.config');

const outputPath = path.join(__dirname, '..', 'swagger.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf8');

console.log(`✅ swagger.json generated at ${outputPath}`);
