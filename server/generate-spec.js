/**
 * generate-spec.js
 * Reads @openapi JSDoc annotations from index.js + swagger.config.js
 * and writes the resulting OpenAPI spec to ../postman/specs/leap-matters-api.yaml
 */

const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const options = require('./swagger.config');
const spec = swaggerJsdoc(options);

const outPath = path.resolve(__dirname, '../postman/specs/leap-matters-api.yaml');
fs.writeFileSync(outPath, yaml.dump(spec, { lineWidth: -1 }));

console.log(`✓ Spec written to ${outPath}`);
