import { createStore } from 'vuex'
import game from '../store/game'
import user from '../store/user'
import router from '../store/router'
import setting from '../store/setting'

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
    router,
    setting,
  }
})
