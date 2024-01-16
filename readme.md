# Simple Match-3 Game built using Phaser3 and Vite.js
> My first actual Phaser3 project


## Getting Started

Clone this repository and install dependencies
```
yarn install
yarn start
```

## TODO

-Fix falling animation
-Add score counter
-Scaffold with Main Menu

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