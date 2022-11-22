import { createRouter, createWebHistory } from 'vue-router'
import GamePlayView from '../views/game/GamePlayView.vue'
import GameMenuView  from '../views/game/GameMenuView.vue'
import UserAccountLoginView from "../views/user/account/UserAccountLoginView.vue"
import UserAccountInfoView from '../views/user/account/UserAccountInfoView.vue'
import store from '../store/index'
const routes = [

  {
    path:"/",
    name:"home",
    redirect:"/user/account/login/",
  },
  {
    path:"/game/menu/",
    name:"game_menu_index",
    component:GameMenuView,
  },
  {
     path:"/game/play/",
     name:"game_play_index",
     component:GamePlayView,
     meta:{
      requestAuth:true,
     }
  },
 {  path:"/user/account/login/",
    name:"user_account_login_index",
    component:UserAccountLoginView,

 },
 {  path:"/user/account/info/",
    name:"user_account_info_index",
    component:UserAccountInfoView,
    meta:{
      requestAuth:true,
     }
 },
 {
  path:"/:catchAll(.*)",
  redirect:"/user/account/login/"
 }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to,from,next)=>{
    if(to.meta.requestAuth && !store.state.user.is_login){
      next({name:"user_account_login_index"});
    }else{
      next();
    }
})
export default router
