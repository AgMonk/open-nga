// noinspection SpellCheckingInspection

import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {path: "/",redirect:"/forum"},
  {path: "/forum",name:"收藏版面",component:()=>import("../views/forum"),},
  {path: "/config",name:"配置",component:()=>import("../views/config"),},

  {path: "/thread/favor/:page",name:"收藏主题",component:()=>import("../views/thread"),props:{title:`收藏主题`}},
  {path: "/thread/:fid/:page",name:"版面主题",component:()=>import("../views/thread"),},
  {path: "/thread/:fid/:page/:stid",name:"合集主题",component:()=>import("../views/thread"),},
  {path: "/thread/:fid/:page/:authorid/:searchpost",name:"指定用户的主题或回复",component:()=>import("../views/thread"),},

  {path: "/account/:uid",name:"用户中心",component:()=>import("../views/account"),},

  {path: "/read/:pid",name:"回复",component:()=>import("../views/read"),},
  {path: "/read/:tid/:page",name:"主题详情",component:()=>import("../views/read"),},
  {path: "/read/:tid/:page/:authorid",name:"只看TA",component:()=>import("../views/read"),},

  {path: "/post/:action/:fid/:tid/:pid/:stid",name:"发帖/回复",component:()=>import("../views/post"),},
  {path:"/test",name:"test",component:()=>import("../views/test"),},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

