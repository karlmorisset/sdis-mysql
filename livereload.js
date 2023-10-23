import livereload from 'livereload';
import path from 'node:path';
import { fileURLToPath } from 'url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const createLiveReloadServer = (directories) => {
  const liveReloadServer = livereload.createServer();

  directories.forEach((dir) => {
    liveReloadServer.watch(path.join(rootDir, dir));
  });

  liveReloadServer.server.once('connection', () => {
    console.warn("À l'écoute des changements");
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });
};

export default createLiveReloadServer;
