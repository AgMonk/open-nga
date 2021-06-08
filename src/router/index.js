import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: "/",redirect:"/forum"},
  {path: "/forum",name:"forum",component:()=>import("../views/forum"),},
  {path: "/thread/:fid/:page",name:"thread",component:()=>import("../views/thread"),},
  {path: "/account/:uid",name:"account",component:()=>import("../views/account"),},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
