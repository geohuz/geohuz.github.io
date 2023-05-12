import { types, flow, onPatch, destroy, getParent, getRoot, getMembers } from 'mobx-state-tree'


const AppState = types.model({
})
.actions(self=>({
}))

export const appStore=AppState.create()
