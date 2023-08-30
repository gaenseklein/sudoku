const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 720,
    height: 1200,
    frame: false,
  })
  // win.setMenu(null)
  // win.removeMenu()
  win.loadFile('game.html')
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()
})
