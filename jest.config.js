{
    "compilerOptions": {
      "baseUrl": ".",  // Base directory for resolving non-relative module imports
      "paths": {
        "@/*": ["./app/*"]  // Associer '@' au dossier 'app' de ton projet
      },
      "moduleResolution": "node",  // Assurer que la résolution de modules fonctionne comme dans Node.js
      "esModuleInterop": true,
      "strict": true
    }
  }
  