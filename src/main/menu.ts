import { app, Menu, MenuItemConstructorOptions, shell } from 'electron'

const appName = 'Metronome'
const template: MenuItemConstructorOptions[] = [
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', enabled: false, role: 'undo' },
      { label: 'Redo', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' },
      // { label: '', role: 'pasteAndMatchStyle' },
      // { label: '删除', role: 'delete' },
      // { label: '全选', role: 'selectAll' },
    ],
  },
  // {
  //   role: 'window',
  //   label: 'Window',
  //   submenu: [
  //     { label: 'Reload', role: 'reload' },
  //     { label: 'Minimize', role: 'minimize' },
  //   ],
  // },
  // {
  //   role: 'help',
  //   label: 'Help',
  //   submenu: [
  //     {
  //       label: 'Click here',
  //       click() {
  //         shell.openExternal(
  //           'https://github.com/cyytemplate/vite-electron-ts/issues'
  //         )
  //       },
  //     },
  //     {
  //       label: 'GitHub',
  //       click() {
  //         shell.openExternal('https://github.com/cyytemplate/vite-electron-ts')
  //       },
  //     },
  //   ],
  // },
]

if (process.platform === 'darwin') {
  template.unshift({
    label: 'Metronome',
    submenu: [
      { label: 'About ' + appName, role: 'about' },
      // {type: 'separator'},
      // {label: '服务', role: 'services', submenu: []},
      { type: 'separator' },
      { label: 'Hide ' + appName, role: 'hide' },
      { label: 'Hide Others', role: 'hideOthers' },
      { label: 'Unhide', role: 'unhide' },
      { type: 'separator' },
      { label: 'Quit ' + appName, role: 'quit' },
    ],
  })
}
const menu = Menu.buildFromTemplate(template)

app.on('ready', () => {
  Menu.setApplicationMenu(menu)
})
