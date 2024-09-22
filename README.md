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

## Configuration

### Domain and HTTPS Settings

Before running the development server, you may need to configure the following settings in `webpack.config.ts`:

1. **Domains**: 
   Update the `domains` array with your local development domain(s). For example:
   ```typescript
   const domains: BuildDomains = [
       'your-local-domain.local', // Replace with your domain
   ];
    ```
2. **HTTPS Configuration**:
    If you are using HTTPS, specify the paths to your SSL certificate and key files:
    ```typescript
    const httpsConfig = {
        key: fs.readFileSync('path/to/your/cert.key'), // Replace with your certificate key path
        cert: fs.readFileSync('path/to/your/cert.crt'), // Replace with your certificate path
    };
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