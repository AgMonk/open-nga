import {createStore} from 'vuex'
import account from "./account"
import forum from "./forum"
import thread from "./thread"
import read from "./read"
import navi from "./navi"
import config from "./config"
import notice from "./notice"

export default createStore({
  state: {
    test:true,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    account,forum,thread,navi,read,config,notice
  }
})
