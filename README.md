# WP-starter - Starter Template for WordPress

A starter template for assembling WordPress themes using Webpack, TypeScript, Babel, Sass, and image optimization.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Symbyanz/wp-starter.git
cd wp-starter
npm install
npm run start
```

## Usage

Start the development server, create a development build and a production build:
```bash
npm run start
npm run dev
npm run build
```

## Project Structure

Minified version of the webpack builder structure
```plaintext
wp-starter/
├── assets/            # Output directory
├── config/            # Webpack configurations
├── src/               # Source files
│   ├── ts/
│   ├── scss/
│   ├── img/
│   └── etc/
├── package.json
└── webpack.config.ts  # Main configuration
```