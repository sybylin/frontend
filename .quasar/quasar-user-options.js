/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/

import lang from 'quasar/lang/en-US'

import iconSet from 'quasar/icon-set/material-icons'



import {QSpinnerCube,AppFullscreen,Cookies,Loading,LocalStorage,SessionStorage,Meta,Notify} from 'quasar'



const userOptions = { config: {"loading":{"delay":400,"spinner":"QSpinnerCube","spinnerSize":80,"spinnerColor":"cyan-7"},"notify":{"color":"light-blue-7","position":"bottom","timeout":"3000"}},lang,iconSet,components: {QSpinnerCube},plugins: {AppFullscreen,Cookies,Loading,LocalStorage,SessionStorage,Meta,Notify} }
userOptions.config.loading.spinner = QSpinnerCube
export default userOptions

