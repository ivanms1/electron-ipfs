/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import IPFS from 'ipfs-core';
import Protector from 'libp2p/src/pnet';
import all from 'it-all';
import uint8ArrayConcat from 'uint8arrays/concat';
import Jimp from 'jimp';

import MenuBuilder from './menu';

const BOOTSTRAP_ADDRESSS =
  '/ip4/15.164.229.6/tcp/4001/ipfs/12D3KooWNubmXubMPzPY9B69HLAEpoRBS41MchdGCa9SgJtd5LnT';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

let node: any;

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 800,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.handle('upload-file', async (_, info) => {
  try {
    const descriptionHash = await node.add({ content: info.description });
    const preview = await Jimp.read(info.preview.path);
    await preview.resize(720, 404).quality(95);
    const previewContent = await preview.getBufferAsync(preview.getMIME());
    const previewHash = await node.add({
      content: previewContent,
    });

    const file = fs.readFileSync(info.file.path);
    const fileContent = Buffer.from(file);
    const fileHash = await node.add({
      content: fileContent,
    });

    return {
      success: true,
      description: { hash: String(descriptionHash.cid) },
      preview: { hash: String(previewHash.cid), name: info.preview.name },
      file: { hash: String(fileHash.cid), name: info.file.name },
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle('download-file', async (_, hash) => {
  try {
    // eslint-disable-next-line
    for await (const file of node.get(hash)) {
      // eslint-disable-next-line
      if (!file.content) continue;

      const content = [];

      // eslint-disable-next-line
      for await (const chunk of file.content) {
        content.push(chunk);
      }

      return {
        success: true,
        file: content,
      };
    }

    return {
      success: false,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle('get-image-preview', async (_, file) => {
  try {
    const description = uint8ArrayConcat(
      await all(node.cat(file.description.hash))
    );

    const preview = uint8ArrayConcat(await all(node.cat(file.preview.hash)));

    return {
      success: true,
      description,
      preview,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle('connect-to-ipfs', async () => {
  try {
    node = await IPFS.create({
      libp2p: {
        modules: {
          connProtector: new Protector(
            fs.readFileSync(getAssetPath('swarm.key'))
          ),
        },
      },
      config: {
        Bootstrap: [BOOTSTRAP_ADDRESSS],
      },
    });

    const version = await node.version();
    const id = await node.id();

    return {
      success: true,
      version,
      id,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
});
