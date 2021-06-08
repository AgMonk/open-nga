import { createStore } from 'vuex'
import account from "./account"
import forum from "./forum"
import thread from "./thread"

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    account,forum,thread
  }
})
