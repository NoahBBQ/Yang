<template>
    <el-card class="card" shadow="always" :body-style="{ padding: '0px' }" >
        <div class="menu">
            <div class="menu-ops">
                <div style="margin-top:2vw;">
                    <el-button type="success" size="large" style="width: 7.5vw;height:2.8vw;" @click="start_game()">开始游戏</el-button>
                </div>
                <GameRules></GameRules>
                <RankList></RankList>
                <GameSettings></GameSettings>
                
            </div>
            
        </div>
    </el-card>
</template>

<script>
import RankList from '@/components/RankList.vue';
import GameRules from '@/components/GameRules.vue';
import GameSettings from '@/components/GameSettings.vue';
import router from '@/router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus'
    export default{
        components:{
          RankList,
          GameRules,
          GameSettings,
        },
        setup(){
            const store = useStore();
            const jwt_token = localStorage.getItem("jwt_token");
            if(jwt_token){
                store.commit("updateToken",jwt_token);
                store.dispatch("getinfo",{
                    token:jwt_token,
                    error(){localStorage.removeItem("jwt_token");}
                });
            }
            const start_game = ()=>{
                if(store.state.user.is_login)
                {
                    router.push({name:'game_play_index'});
                }
                else
                {
                    ElMessage({
                        message: '请先登录，未登录不能游玩',
                        type: 'warning',
                      })
                }
            }
            return{
                start_game,
            }
          
        }
    }
</script>

<style scoped>
    .card{
        width: 25vw;
        margin: 0 auto;
        margin-top: 2vh;
        animation: 0.5s fadeIn linear;
    }
    @keyframes fadeIn {
        0% {
        opacity: 0; /*初始状态 透明度为0*/
        }
        50% {
        opacity: 0; /*中间状态 透明度为0*/
        }
        100% {
        opacity: 1; /*结尾状态 透明度为1*/
        }
    }
    .menu{
        height: 40.85vw;
        background-image: url('@/assets/img/START.png');
        background-repeat: no-repeat;
        background-size: 100%;
        margin: 0 auto;
        position: relative;
    }
    .menu-ops{
        position: absolute;
        top: 19vw;
        left:9vw;
    }
   
</style>