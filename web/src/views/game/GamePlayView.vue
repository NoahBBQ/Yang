<template>
    <el-card id="game_play" class="card" shadow="always" :body-style="{ padding: '0px' }" >
        <div class="gamemap">
            <div class="game-header" >
                <div style="padding:1.5vh;">
                    <img src="/static/img/other/设置.png" alt="" class="settings" @click="dialogVisible = true">
                    <el-dialog
                        v-model="dialogVisible"
                        title="设置"
                        width="30%"
                    >
                        <span>音乐</span>
                        <el-switch
                        v-model="enableMusic"
                        class="mt-2"
                        style="margin-left: 24px"
                        inline-prompt
                        :active-icon="Check"
                        :inactive-icon="Close"
                        />
                        <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="dialogVisible = false">
                            确认
                            </el-button>
                        </span>
                        </template>
                    </el-dialog>
                </div>
                <div style="padding-top: 1.4vh;flex-direction:column;display:flex;">
                    <span class="text">{{time}}</span>
                    <img :src="'/static/img/other/切换'+ $store.state.game.level + '.png'" alt="" style="width:3.2vw;margin-left:2.6vw;margin-top:1vh;">
                </div>
               
                <div style="width: 3vw;padding:1.5vh;">
                    <img src="/static/img/other/回退.png" alt="" class="back" @click="close()"/>
                </div>
            </div>
            <div class="game-body" ref="parent">
                <canvas ref="canvas">

                </canvas>
            </div>
            <div class="tool-menu">
                <img v-if="$store.state.game.tool_0 == 1" src="/static/img/tool/道具1.png" alt="" style="width: 4.5vw;" @click="tool_use_1()">
                <img v-else src="/static/img/tool/道具1G.png" alt="" style="width: 4.5vw;">
                <img v-if="$store.state.game.tool_1 == 1" src="/static/img/tool/道具2.png" alt="" style="width: 4.5vw;" @click="tool_use_2()">
                <img v-else src="/static/img/tool/道具2G.png" alt="" style="width: 4.5vw;">
                <img v-if="$store.state.game.tool_2 == 1" src="/static/img/tool/道具3.png" alt="" style="width: 4.5vw;" @click="tool_use_3()">
                <img v-else src="/static/img/tool/道具3G.png" alt="" style="width: 4.5vw;">
            </div>
        </div>
        <!-- ResultBoard -->
        <div v-if="$store.state.game.result ==='lose' " class="bk" id="lose" :style="opacity = $store.state.game.result ==='lose'?1:0 ">
            <img src="@/assets/img/结束body.png" alt="" class="lose-body">
            <img src="@/assets/img/结束header.png" alt="" class="lose-header">
            <img src="@/assets/img/结束footer.png" alt="" class="lose-footer" @click="close()">
        </div>
        <div v-if="$store.state.game.result === 'win'" class="bk" id="win">
            <div class="win-header">
                <span class="win-text-yellow">恭喜你</span>
                <br/>
                <span class="win-text-white">无事发生</span>
            </div>
            <img  src="@/assets/img/返回菜单.png" alt="" class="win-footer" @click="close()">
        </div>
        <div v-if="$store.state.game.result ==='pass'" class="bk" id="pass">
            <img src="@/assets/img/星星.png" alt="" class="pass-header-1">
            <img src="@/assets/img/星星.png" alt="" class="pass-header-2">
            <img src="@/assets/img/星星.png" alt="" class="pass-header-3">
            <span class="pass-body">恭喜顺利通关</span>
            <span class="pass-body-meta">{{$store.state.user.rank}}</span>
            <img  src="@/assets/img/返回菜单.png" alt="" class="pass-footer" @click="close()">
        </div>
        <audio v-if="$store.state.setting.music" autoplay loop :src="require('@/assets/music/背景音乐.mp3')">  
        </audio>
    </el-card>
</template>

<script>
import { GameMap } from '@/assets/script/GameMap';
import { ref,onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios'
import router from '@/router';
import { Check, Close } from '@element-plus/icons-vue'

    export default{
        watch:{
            enableMusic(){
                this.$store.commit("updateMusic",this.enableMusic);
            },
        },
        setup(){
            let store = useStore();
            let canvas = ref(null);
            let parent  = ref(null);
            const dialogVisible = ref(false);
            const enableMusic = ref(store.state.setting.music);
            let time = new Date();
            time = " - " + (time.getMonth() + 1) + "月" + time.getDate() + "日" +" - ";

            const close = ()=>{
                fadeOut(document.getElementById("game_play"));
            }
            
            const fadeOut = (elem)=>{ 
                elem.style.opacity = 75;
                if(elem.style.opacity != 0){
                    let speed = 30;
                    let num = 10;
                    const st = setInterval(()=>{
                        num --;
                        elem.style.opacity = num/10;
                        if(num < 0) {clearInterval(st);router.push({name:'game_menu_index'});}
                    },speed);
                    st
                }
            }

            onMounted(() => {
                store.commit("updateResult","");
                store.commit("updateLevel",1);
                store.commit("updateTool_0",1);
                store.commit("updateTool_1",1);
                store.commit("updateTool_2",1);
                
                //index有/的
                axios({
                    method:"post",
                    url:"https://app3565.acapp.acwing.com.cn/api/test/index/",
                    headers:{
                        Authorization:"Bearer " + store.state.user.token,
                    },
                    params:{
                        level:store.state.game.level
                    }
                }).then(resp=>{
                    //let cards = resp.data.cards;
                    if(resp.data.error_message === "success")
                    {
                        store.commit("updateTot",resp.data.tot);
                        store.commit("updateKinds",resp.data.kinds);
                        store.commit("updateCards",resp.data.cards);
                        store.commit("updateCnt",resp.data.cnt);
                        store.commit("updateGameMap", new GameMap(canvas.value.getContext('2d'),parent.value,store)); 
                    }
                })
            })
            const tool_use_1 = ()=>{
                store.state.game.gamemap.discharge();
            }
            const tool_use_2=()=>{
                store.state.game.gamemap.cancel();
            }
            const tool_use_3=()=>{
                store.state.game.gamemap.shuffle();
            }
           
            return {
                canvas,
                parent,
                dialogVisible,
                time,
                tool_use_1,
                tool_use_2,
                tool_use_3,
                close,
                enableMusic,
                Check,
                Close,
            }
        }
    }
</script>

<style scoped>
    .card{
        width: 25vw;
        margin: 0 auto;
        margin-top: 2vh;
        position: relative;
    }
    .gamemap{
        position: relative;
        height: 40.85vw;
        background-image: url('@/assets/img/BackGround.png');
        background-repeat: no-repeat;
        background-size: 100%;
        margin: 0 auto;
    }
    .settings{
        width:2.5vw;
        cursor:pointer;
        user-select: none;
    }
    .back{
        width: 3vw;
        cursor: pointer;
        user-select: none;
    }
    .game-header>img :hover{
        width: 3vw;
    }

    .game-header{
        width: 100%;
        height: 3.9vw;
        display: flex;
        justify-content: space-between;
        margin:0 auto;
    }
    .game-body{
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 1.85vw;
        padding-right: 1.8vw;
    }
    .deal-cards{
        float: right;
        width: 2vw;
        height: 2vw;
        margin: 0 auto;
    }
    .tool-menu{
        padding-top: 1.5vw;
        padding-left: 2vw;
        padding-right: 2vw;
        display: flex;
        text-align: center;
        justify-content:space-between;
        
    }
    .tool-menu > img{
        cursor: pointer;
        user-select: none;
    }
    .text{
        padding-left: 0.2vw;
        padding-right: 0.2vw;
        color:white;
        font-size: 1.5vw;
        background-color: rgba(0,0,0,0.7);
        border-radius: 5%;
        user-select: none;
    }
  
    .bk{
        position: absolute;
        width: 25vw;
        height: 41.5vw;
        top:0;
        left:0;
        background-color: rgba(0,0,0,0.75);
        animation: 0.6s fadeIn linear;
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
    .lose-header{
        position: absolute;
        width: 8vw;
        left: 8.5vw;
        top: 3.3vw;
        user-select: none;
        -webkit-user-drag: none;
    }
    .lose-body{
        position: absolute;
        width: 15vw;
        left: 5vw;
        top: 5vw;
        user-select: none;
        -webkit-user-drag: none;
    }
    .lose-footer{
        position: absolute;
        width: 7.5vw;
        left: 8.6vw;
        top: 19.5vw;
        cursor: pointer;
        user-select: none;
        -webkit-user-drag: none;
    }
    .win-header{
        position: absolute;
        width: 15vw;
        height: 6vw;
        left: 5vw;
        top: 6vw;
        background-color: black;
        text-align: center;
        border-radius: 2%;
        padding-top:1vw;
        user-select: none;
    }
    .win-text-yellow{
        color: yellow;
        font-size: 1.5vw;
        user-select: none;
        -webkit-user-drag: none;
    }
    .win-text-white{
        color: white;
        font-size: 2vw;
        user-select: none;
        -webkit-user-drag: none;
    }
    .win-body{
        position: absolute;
        background-color: black;
        color: #ece584;
        height: 1vw;
        display:table; 
        padding: 0.2vw;
        padding-left: 1vw;
        padding-right: 1vw;
        left: 8vw;
        top:13vw;
        font-size: 0.9vw;
    }
    .win-footer{
        position: absolute;
        width: 9vw;
        left: 8vw;
        top: 16vw;
        cursor: pointer;
        user-select: none;
        -webkit-user-drag: none;
    }
    .pass-header-1{
        position: absolute;
        width: 5.5vw;
        left: 4.5vw;
        top: 5vw;
        user-select: none;

    }
    .pass-header-2{
        position: absolute;
        width: 5.5vw;
        left: 9.5vw;
        top: 4.2vw;
        user-select: none;
    }
    .pass-header-3{
        position: absolute;
        width: 5.5vw;
        left: 14.5vw;
        top: 5vw;
        user-select: none;
    }
    .pass-body{
        position: absolute;
        left: 8vw;
        top:12vw;
        color: yellow;
        font-size: 1.5vw;
        user-select: none;
        -webkit-user-drag: none;
    }
    .pass-body-meta{
        position: absolute;
        left: 11vw;
        top: 14vw;
        font-size: 0.5vw;
        color: white;
    }
    .pass-footer{
        position: absolute;
        width: 9vw;
        left: 8vw;
        top: 16vw;
        cursor: pointer;
        user-select: none;
        -webkit-user-drag: none;
        -webkit-tap-highlight-color:transparent;
    }
</style>