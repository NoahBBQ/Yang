<template>
    <GameMenu v-if="$store.state.router.router_name === 'menu'"></GameMenu>
    <GamePlay v-if="$store.state.router.router_name === 'play'"></GamePlay>
</template>
<script>
import axios from 'axios';
import { useStore } from 'vuex';
import GameMenu from './views/game/GameMenuView.vue';
import GamePlay from './views/game/GamePlayView.vue';
  export default{
    components:{
      GameMenu,
      GamePlay,
    },
    setup(){
      const store = useStore();

      axios({
        method:"get",
        url:"https://app3565.acapp.acwing.com.cn/api/user/account/acwing/acapp/apply_code/",
      }).then(resp =>{
          if(resp.data.result === "success"){
            store.state.user.AcWingOS.api.oauth2.authorize(resp.data.appid, resp.data.redirect_uri, resp.data.scope, resp.data.state, resp =>{
              if(resp.result === "success"){
                const jwt_token = resp.jwt_token;
                store.commit("updateToken",jwt_token);
                store.dispatch("getinfo",{
                    token:jwt_token,
                    error(){}
                });
              }else{
                store.state.user.AcWingOS.api.window.close();
              }
            });
          }else{
            store.state.user.AcWingOS.api.window.close();
          }
      });
    }
  }
</script>
<style scoped>
  
</style>
