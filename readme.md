# Simple Match-3 Game built using Phaser3 and Vite.js
> My first actual Phaser3 project

## Have to have - 

> [Node.js](https://nodejs.org/en/)
> [npm](https://www.npmjs.com/)

## Getting Started

Clone this repository and install dependencies
```bash
npm git clone https://github.com/KereneL/matchAndMix matchAndMix
cd matchAndMix

npm install
```

Start local server:
```bash
npm run start
```

To create a production build:

```bash
npm run build
```

>Production files will be placed in the `dist` folder.
>Upload those files to a web server.

## Project Structure
```
    ├── dist
    ├── node_modules
    ├── public
    │   ├── fruit_sprites
    │   │   ├── banana.png
    │   │   ├── bluberries.png
    │   │   ├── cherry.png
    │   │   ├── grapes.png
    │   │   ├── greenapple.png
    │   │   ├── mango.png
    ├── src
    │   ├── js
    │   │   ├──Board.js
    │   │   ├──config.js
    │   │   ├──MainScreenScene.js
    │   │   ├──Square.js
    │   ├── main.js
	├── index.html
    ├── package.json
```

## Local Server Port

You can change the dev server's port number by modifying the `vite.config.js` file. Look for the `server` section:

```js
{
	// ...
	server: { host: '0.0.0.0', port: 8000 },
}
```
>Change 8000 to whatever.