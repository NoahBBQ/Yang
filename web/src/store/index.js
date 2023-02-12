import { createStore } from 'vuex'
import game from '../store/game'
import user from '../store/user'
import setting from './setting'
export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    game,
    user,
    setting,
  }
})
