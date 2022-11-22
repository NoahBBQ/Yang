<template>
  <el-affix :offset="0">
    <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">designed by lyx</el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">游戏中心</el-menu-item>
    
    <el-sub-menu index="2" v-if="$store.state.user.is_login"> 
      <template #title>
        <el-avatar>
          <img
            :src="$store.state.user.photo"
          />
        </el-avatar>
      </template>
      <el-menu-item index="2-1">我的信息</el-menu-item>
      <el-menu-item index="2-2">登出</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="2" v-else>登录</el-menu-item>
  </el-menu>
</el-affix>
</template>


<script>
import router from '@/router';
import { ref } from 'vue'
import { useStore } from 'vuex';
    export default{
        components:{

        },
        setup() {
            const store = useStore();
            let activeIndex = ref('1');
            if(window.location.pathname == "/user/account/login/" )
            {
                activeIndex = '2';
            }
            const handleSelect = (key) => {
               
                if(key == '1')
                {
                  activeIndex = '1';
                  router.push({name:"game_menu_index"});
                }
                else if(key == '2')
                {
                    activeIndex = '2';
                    router.push({name:"user_account_login_index"});
                }
                else if(key =='2-1')
                {
                    router.push({name:"user_account_info_index"});
                }
                else if(key =='2-2')
                {
                    store.dispatch("logout");
                    router.push({name:"user_account_login_index"});
                }
              }
            return {
                activeIndex,
                handleSelect,
            }
        }
    }
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>