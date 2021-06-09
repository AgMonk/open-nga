// noinspection SpellCheckingInspection

import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {path: "/",redirect:"/forum"},
  {path: "/forum",name:"forum",component:()=>import("../views/forum"),},
  {path: "/thread/:fid/:page/:stid",name:"stid",component:()=>import("../views/thread"),},
  {path: "/thread/:fid/:page",name:"thread",component:()=>import("../views/thread"),},
  {path: "/account/:uid",name:"account",component:()=>import("../views/account"),},
  {path: "/read/:tid/:page",name:"read",component:()=>import("../views/read"),},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

