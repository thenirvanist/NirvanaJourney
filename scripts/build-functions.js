import { build } from 'esbuild';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the functions directory exists
const functionsDir = join(__dirname, '..', 'netlify', 'functions');
if (!existsSync(functionsDir)) {
  mkdirSync(functionsDir, { recursive: true });
}

console.log('Building Netlify function...');

// Build the Netlify function
try {
  await build({
    entryPoints: [join(__dirname, '..', 'server', 'netlify-function.cjs')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: join(functionsDir, 'api.cjs'),
    external: [
      '@neondatabase/serverless',
      '@supabase/supabase-js',
      'drizzle-orm',
      'express',
      'bcryptjs',
      'jsonwebtoken',
      'nodemailer',
      'openai',
      'resend',
      'zod',
      'serverless-http'
    ],
    minify: false,
    sourcemap: false
  });
  console.log('✓ Netlify function built successfully');
} catch (error) {
  console.error('✗ Failed to build Netlify function:', error);
  process.exit(1);
}