import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const [urlPath, query] = req.url.split('?');
            const lastSegment = urlPath.split('/').pop() || '';
            if (!lastSegment.includes('.')) {
              const fileToCheck = urlPath === '/' ? '/index.html' : urlPath + '.html';
              const fullPath = resolve(__dirname, fileToCheck.slice(1));
              if (fs.existsSync(fullPath)) {
                req.url = fileToCheck + (query ? '?' + query : '');
              }
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hygiene: resolve(__dirname, 'comment-maintenir-une-hygiene-bucco-dentaire-impeccable-au-quotidien.html'),
        facettes: resolve(__dirname, 'les-facettes-dentaires-le-secret-dun-sourire-hollywoodien-sur-mesure.html'),
        alignement: resolve(__dirname, 'pourquoi-lalignement-dentaire-est-important-meme-a-lage-adulte.html'),
        implants: resolve(__dirname, 'implants-dentaires-echec-age-os.html'),
        sagesse: resolve(__dirname, 'dents-de-sagesse-bombe-retardement.html'),
        mobile: resolve(__dirname, 'mobile.html'),
      }
    }
  }
});
