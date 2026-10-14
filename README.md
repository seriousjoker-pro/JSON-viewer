# JSON Explorer

An interactive JSON explorer for the browser and Windows desktop. It turns pasted or opened JSON files into an expandable tree.

## Browser version

Open `index.html` in a modern browser. No build step is required.

## Windows desktop version

Install Node.js, then run `npm install` and `npm start` to launch the desktop app.
Run `npm run dist:win` to build the Windows installer in `dist`. The installer
registers `.json` files so JSON Explorer appears in Windows “Open with”. To make
it the default, choose it from **Settings → Apps → Default apps** after installing;
Windows requires the user to confirm default-app changes.

The desktop app opens a file passed by Windows, including when it is already
running. The browser version can also load a file using **Apri file**.

## Features

- Paste or edit JSON and render objects, arrays, and primitive values as a tree.
- Expand or collapse nested structures and search keys, values, and paths.
- Load a `.json` file or copy the input as formatted JSON.
- Invalid JSON reports the line and column when the browser provides a parse position.
- All JSON parsing and visualization happen locally on the device.

## License

Copyright (c) 2026 Marco Paleari. Licensed under the [MIT License](LICENSE).
