{{{
    "title"    : "Pdf reports in Electron app",
    "date"     : "07-09-2018 18:30"
}}}

There are some cases when you need to run and distribute jsreport as part of a desktop app, to solve this a very good option is to use [electron](https://electronjs.org/docs/api/app) to build your desktop app. electron shares the same principle that jsreport, which it is let you build things using web technologies, so using electron + jsreport is a great combination. In this blog post we are going to show you how to use jsreport inside an electron app and what you need to do to make it work.

## Project setup

As first step we need to create a new project and install electron, let's create a `package.json` with the following content

```js
{
  "name": "jsreport-in-electron-app",
  "version": "0.0.0",
  "description": "Usage of jsreport inside an electron app (desktop app)",
  "main": "app.js",
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}
```

With the `package.json` generated we can install dependencies, let's go ahead and install `electron` as a development dependency by running `npm install electron --save-dev`, and then install `jsreport` with `npm install jsreport --save`.

Now let's create the entry points of the desktop app, create a `app.js` (the [electron's Main process](https://electronjs.org/docs/glossary#main-process) entry point) file with the following content

```js
const { app, BrowserWindow } = require('electron')
const EOL = require('os').EOL
const fs = require('fs')
const url = require('url')
const path = require('path')

let CWD = process.cwd()

let mainWindow

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 500, height: 300 })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file'
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

process.on('uncaughtException', (err) => {
  appLog('error', `Uncaught error: ${err.stack}`)
  throw err
})

// function to save app logs, it writes to console and to a file.
// writing to a file is handy because when running the app from normal
// executable there is no console to see logs
function appLog(level, message) {
  const origMsg = message

  message += EOL

  if (level === 'info') {
    console.log(origMsg)
    fs.appendFileSync(path.join(CWD, 'app-info.log'), message)
  } else if (level === 'error') {
    console.error(origMsg)
    fs.appendFileSync(path.join(CWD, 'app-error.log'), message)
  }
}
```

and an `index.html` file (the [electron's Renderer process](https://electronjs.org/docs/glossary#renderer-process) entry point) with content

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Electron - jsreport app</title>
</head>
<body>
  <button id="generateReport">Generate Report</button>
  <p id="details"></p>
</body>
</html>
```

with both files created we are now able to run the app using `npm start`, by doing that you should see a button "Generate Report" in desktop window

![empty electron app](https://jsreport.net/screenshots/electron-app1.png?v=1)

## Adding jsreport

let's continue by adding jsreport to the project and make it render a report, run `npm install jsreport --save`. in the report that we are going to use as example we will use some images located at `local-assets` directoy of our project so let's create the `local-assets` directory and [put there the following images](https://github.com/bjrmatos/jsreport-in-electron-app/tree/master/local-assets), then we need to create a `jsreport.config.json` file with the following content (note that in there we are using [assets](https://jsreport.net/learn/assets) configuration that allows jsreport to read from `local-assets` directory)

```js
{
  "httpPort": 5488,
  "store": {
    "provider": "fs"
  },
  "blobStorage": {
    "provider": "fs"
  },
  "logger": {
    "console": {
      "transport": "console",
      "level": "debug"
    },
    "file": {
      "transport": "file",
      "level": "info",
      "filename": "./logs/reporter.log"
    },
    "error": {
      "transport": "file",
      "level": "error",
      "filename": "./logs/error.log"
    }
  },
  "allowLocalFilesAccess": true,
  "templatingEngines": {
    "timeout": 10000,
    "strategy": "http-server"
  },
  "chrome": {
    "timeout": 40000
  },
  "extensions": {
    "assets": {
      "allowedFiles": "**/local-assets/*.*",
      "publicAccessEnabled": true,
      "searchOnDiskIfNotFoundInStore": true,
      "rootUrlForLinks": "http://localhost:5488"
    },
    "authentication": {
      "cookieSession": {
        "secret": "<your strong secret here>"
      },
      "admin": {
        "username": "admin",
        "password": "password"
      },
      "enabled": false
    },
    "scripts": {
      "timeout": 40000,
      "strategy": "http-server"
    }
  }
}
```

and we need to update `index.html` to the following

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Electron - jsreport app</title>
</head>
<body>
  <button id="generateReport">Generate Report</button>
  <p id="details"></p>

  <script>
  const { ipcRenderer } = require('electron')

  const args=[{
    "name": "electron" ,
    "description":"Build cross platform desktop apps with JavaScript, HTML, and CSS"
  }, {
    "name": "jsreport",
    "description": "Innovative and unlimited reporting based on javascript templating engines and web technologies"
  }]

  const generateBtn = document.getElementById('generateReport')
  const detailsEl = document.getElementById('details')

  generateBtn.addEventListener('click', () => {
    detailsEl.innerText = ''

    generateBtn.disabled = true
    generateBtn.innerText = 'Rendering..'

    ipcRenderer.send('render-start', args)
  })

  ipcRenderer.on('render-finish', (ev, data) => {
    generateBtn.disabled = false
    generateBtn.innerText = 'Generate Report'

    if (data && data.errorText) {
      detailsEl.innerText = data.errorText
    }
  })
  </script>
</body>
</html>
```

as you can see we've added some code that sends an action to the main process of electron (`app.js`) from the renderer process (`index.html`), this action will make the main process to start jsreport (if necessary) and make it render a report with some data. now we need to modify `app.js` to handle the action and to use jsreport in there

```js
const { app, BrowserWindow, ipcMain } = require('electron')
const EOL = require('os').EOL
const fs = require('fs')
const url = require('url')
const path = require('path')

let CWD = process.cwd()

const rootDir = CWD

const jsreport = require('jsreport')({
  rootDirectory: rootDir
})

let mainWindow

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 500, height: 300 })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file'
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // handling action that was generated from renderer process
  ipcMain.on('render-start', async (event, args) => {
    appLog('info', 'initializing reporter..')

    try {
      // we defer jsreport initialization on first report render
      // to avoid slowing down the app at start time
      if (!jsreport._initialized) {
        await jsreport.init()
        appLog('info', 'jsreport started')
      }

      appLog('info', 'rendering report..')

      try {
        const resp = await jsreport.render({
          template: {
            content: fs.readFileSync(path.join(__dirname, './report.html')).toString(),
            engine: 'handlebars',
            recipe: 'chrome-pdf'
          },
          data: {
            rows: args
          }
        })

        appLog('info', 'report generated')

        fs.writeFileSync(path.join(CWD, 'report.pdf'), resp.content)

        const pdfWindow = new BrowserWindow({
      		width: 1024,
      		height: 800,
      		webPreferences: {
      			plugins: true
      		}
      	})

      	pdfWindow.loadURL(url.format({
          pathname: path.join(CWD, 'report.pdf'),
          protocol: 'file'
        }))

        event.sender.send('render-finish', {})
      } catch (e) {
        appLog('error', `error while generating or saving report: ${e.stack}`)
        event.sender.send('render-finish', { errorText: e.stack })
      }
    } catch (e) {
      appLog('error', `error while starting jsreport: ${e.stack}`)
      app.quit()
    }
  })
})

process.on('uncaughtException', (err) => {
  appLog('error', `Uncaught error: ${err.stack}`)
  throw err
})

// function to save app logs, it writes to console and to a file.
// writing to a file is handy because when running the app from normal
// executable there is no console to see logs
function appLog(level, message) {
  const origMsg = message

  message += EOL

  if (level === 'info') {
    console.log(origMsg)
    fs.appendFileSync(path.join(CWD, 'app-info.log'), message)
  } else if (level === 'error') {
    console.error(origMsg)
    fs.appendFileSync(path.join(CWD, 'app-error.log'), message)
  }
}
```

most of the new code handles the action `ipcMain.on('render-start', ..)`, in which we are initializing jsreport if it was not initialized (only on first render) and then send a render request which uses html defined in `report.html` file. finally we save the generated pdf report in `report.pdf` file and show it right in new window of desktop app.

to complete the code here is the content of `report.html`

```html
<html>
  <head>
    <style>
      table, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
    </style>
  </head>
  <body>
    <img
      src='{#asset ./local-assets/electron-logo.svg @encoding=dataURI}'
      width='300px'
    />
    <span style="font-size: 28px;"><b>&nbsp;&nbsp;+&nbsp;&nbsp;</b></span>
    <img
      src='{#asset ./local-assets/jsreport-logo.png @encoding=dataURI}'
      width='250px'
      height='120px'
    />
    <br />
    <br />
    <table>
      <tr>
        <td>
          <b>Name</b>
        </td>
        <td>
          <b>Description</b>
        </td>
      </tr>
      {{#each rows}}
      <tr>
        <td>{{name}}</td>
        <td>{{description}}</td>
      </tr>
      {{/each}}
    </table>
  </body>
</html>
```

now we should be able to start the app again with `npm start` and render a report by clicking the `"Generate Report"` button, by doing it we should see the following

![render report in electron app](https://jsreport.net/screenshots/electron-app2.png?v=1)

## Build desktop executable

So far we've been able to render a report from our dev environment, now we are going to do the same but when our app has been packaged as a desktop executable. we need two install two packages, `electron-is-dev` and `electron-builder`, the first helps to know when the app is running from desktop executable or not, and the second is a utility that handles the process of building the desktop executable.

let's run `npm install electron-is-dev --save` and `npm install electron-builder -save-dev` and modify our `package.json` file

```js
{
  "name": "jsreport-in-electron-app",
  "version": "0.0.0",
  "description": "Usage of jsreport inside an electron app (desktop app)",
  "main": "app.js",
  "scripts": {
    "start": "electron .",
    "pack": "electron-builder",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "license": "MIT",
  "build": {
    "appId": "com.jsreportinelectron.app",
    "extraFiles": [
      "local-assets",
      "node_modules/puppeteer/.local-chromium/**/*"
    ]
  },
  "dependencies": {
    "electron-is-dev": "0.3.0",
    "jsreport": "2.1.1",
    "webpack": "1.13.1"
  },
  "devDependencies": {
    "electron": "2.0.2",
    "electron-builder": "20.19.2"
  }
}
```

we added a `build` object and a `pack` script into our `package.json`. the `build` object is configuration for `electron-builder` and the `pack` script will execute `electron-builder`.

before trying to build an executable for our app we need to do some changes in code. first we need to install `webpack` as a dependency in our project, it may seem weird to do it since we are not using it in the project but this is needed because the way `electron-builder` works gets into conflict with some internal logic of jsreport, somehow `electron-builder` is not able to recognize that `webpack` is not needed at runtime and it throws an error when packaging the app, so let's run `npm install webpack --save` to fix that problem.

now we need to modify some code in `app.js` to fix some paths when the app is running from desktop executable

```js
const { app, BrowserWindow, ipcMain } = require('electron')
const EOL = require('os').EOL
const fs = require('fs')
const url = require('url')
const path = require('path')
const isDev = require('electron-is-dev')

let CWD = process.cwd()

if (!isDev) {
  const chromePath = require('puppeteer').executablePath()
  const exePath = path.dirname(app.getPath('exe'))

  // process.cwd() returns '/' on unix from executable
  if (process.platform !== 'win32' && process.cwd() !== exePath) {
    CWD = exePath
    process.chdir(CWD)
  }

  // get correct path to chrome executable when running on compiled electron app
  process.env.extensions_chromePdf_launchOptions_executablePath = path.join(CWD, chromePath.slice(chromePath.indexOf('node_modules')))
}

const rootDir = process.platform === 'darwin' ? __dirname : CWD

const jsreport = require('jsreport')({
  rootDirectory: rootDir
})

let mainWindow

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 500, height: 300 })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file'
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // handling action that was generated from renderer process
  ipcMain.on('render-start', async (event, args) => {
    appLog('info', 'initializing reporter..')

    try {
      // we defer jsreport initialization on first report render
      // to avoid slowing down the app at start time
      if (!jsreport._initialized) {
        await jsreport.init()
        appLog('info', 'jsreport started')
      }

      appLog('info', 'rendering report..')

      try {
        const resp = await jsreport.render({
          template: {
            content: fs.readFileSync(path.join(__dirname, './report.html')).toString(),
            engine: 'handlebars',
            recipe: 'chrome-pdf'
          },
          data: {
            rows: args
          }
        })

        appLog('info', 'report generated')

        fs.writeFileSync(path.join(CWD, 'report.pdf'), resp.content)

        const pdfWindow = new BrowserWindow({
      		width: 1024,
      		height: 800,
      		webPreferences: {
      			plugins: true
      		}
      	})

      	pdfWindow.loadURL(url.format({
          pathname: path.join(CWD, 'report.pdf'),
          protocol: 'file'
        }))

        event.sender.send('render-finish', {})
      } catch (e) {
        appLog('error', `error while generating or saving report: ${e.stack}`)
        event.sender.send('render-finish', { errorText: e.stack })
      }
    } catch (e) {
      appLog('error', `error while starting jsreport: ${e.stack}`)
      app.quit()
    }
  })
})

process.on('uncaughtException', (err) => {
  appLog('error', `Uncaught error: ${err.stack}`)
  throw err
})

// function to save app logs, it writes to console and to a file.
// writing to a file is handy because when running the app from normal
// executable there is no console to see logs
function appLog(level, message) {
  const origMsg = message

  message += EOL

  if (level === 'info') {
    console.log(origMsg)
    fs.appendFileSync(path.join(CWD, 'app-info.log'), message)
  } else if (level === 'error') {
    console.error(origMsg)
    fs.appendFileSync(path.join(CWD, 'app-error.log'), message)
  }
}
```

we just needed to change some paths at the top with the help of `electron-is-dev` package. after that we are now able to run `npm run pack` and wait until our desktop app executable is generated in `dist` directory in where we can start the app and run the report as before.

As a final note you can see the example described in the post [here](https://github.com/bjrmatos/jsreport-in-electron-app). It maybe be possible that you get other problems if you use more advanced features of jsreport, in that case if you get other problems please let us know so we can add updates to the post about solutions for those problems.
