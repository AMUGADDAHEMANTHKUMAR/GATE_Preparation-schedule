#!/usr/bin/env node

// Simple build test script to debug Vercel deployment issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting build test...');
console.log('📁 Current directory:', process.cwd());
console.log('📦 Node version:', process.version);
console.log('📋 NPM version:', execSync('npm --version', { encoding: 'utf8' }).trim());

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Check if src directory exists
if (!fs.existsSync('src')) {
  console.error('❌ src directory not found!');
  process.exit(1);
}

console.log('✅ All checks passed!');
console.log('🚀 Ready to build...');

try {
  console.log('🔨 Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
