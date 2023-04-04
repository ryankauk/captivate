import {
  ReduxStore,
  CleanReduxState,
  resetState,
  getCleanReduxState,
  store,
} from '../../../renderer/redux/store'
import ipcChannels from '../../shared/engine/ipc_channels'
import AutoSavedVal, { printTimePassed } from './AutoSavedVal'
import fixState from '../../../shared/fixState'
import defaultState from '../../../renderer/redux/defaultState'

let autoSavedVal: AutoSavedVal<CleanReduxState> | null = null

export function stopAutoSave() {
  if (autoSavedVal !== null) {
    autoSavedVal.stop()
  }
}

export function startAutoSave() {
  if (autoSavedVal !== null) {
    autoSavedVal.start()
  }
}

export function getSaveSlots() {
  if (autoSavedVal === null) {
    return []
  } else {
    return autoSavedVal
      .loadAll()
      .slice(2)
      .map((datedSave) => ({
        timePassed: printTimePassed(datedSave),
        apply: () => store.dispatch(resetState(fixState(datedSave.data))),
      }))
  }
}

function restoreLastState(
  store: ReduxStore,
  asv: AutoSavedVal<CleanReduxState>
) {
  let latest = asv.loadLatest()
  if (latest === null) {
    store.dispatch(resetState(defaultState()))
  } else {
    store.dispatch(resetState(fixState(latest)))
  }
}

export const autoSave = (store: ReduxStore) => {
  autoSavedVal = new AutoSavedVal('state', () =>
    getCleanReduxState(store.getState())
  )

  restoreLastState(store, autoSavedVal)
}

// @ts-ignore: Typescript doesn't recognize the globals set in "src/main/preload.js"
const ipcRenderer = window.electron.ipcRenderer

export const captivateFileFilters = {
  captivate: { name: 'Captivate', extensions: ['captivate'] },
}

export async function loadFile(
  title: string,
  fileFilters: Electron.FileFilter[]
): Promise<string> {
  return ipcRenderer.invoke(ipcChannels.load_file, title, fileFilters)
}

export async function saveFile(
  title: string,
  data: string,
  fileFilters: Electron.FileFilter[]
): Promise<NodeJS.ErrnoException> {
  return ipcRenderer.invoke(ipcChannels.save_file, title, data, fileFilters)
}
