<template>
    <div style="margin-top:2vw;">
        <el-button @click="rankDialogVisible = true" type="success" size="large" style="width: 7.5vw;height:2.8vw;">排行榜</el-button>
        <el-dialog
            v-model="rankDialogVisible"
            title="排行榜(每日自动更新)"
            width="30%"
        >
            <span>{{time}}(榜单/只记录前50位触发隐藏关卡并通关的玩家)</span>
            <el-button @click="updateView()">手动刷新</el-button>
            <el-table 
                ref="multipleTableRef"
                :data="data.arr" 
            
                style="width: 100%;"
                max-height="25vw"
                @selection-change="handleSelectionChange"
                >
                <el-table-column prop="rank" label="排名"  />
                <el-table-column prop="username" label="用户" />
                <el-table-column  label="头像">
                    <template #default="scope">
                        <el-avatar
                            :src="scope.row.photo"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="时间" />
            </el-table>

        </el-dialog>
    </div>
</template>

<script>

import {ref} from 'vue'
import { reactive } from '@vue/reactivity';
import axios from 'axios';
import { onMounted } from 'vue';

    export default{
        components:{
      
        },
        setup(){
            const rankDialogVisible = ref(false);
            const multipleTableRef = ref(null);
            const multipleSelection  = ref([]);
            const handleSelectionChange =(val)=>{
                multipleSelection.value = val;    
            }
            const data = reactive({
                arr:[]
            });
            let time = new Date();
            time = (time.getMonth() + 1) + "月" + time.getDate() + "日";
            const updateView = () =>{
                data.arr = [];
                axios({
                    method:"get",
                    url:"https://app3565.acapp.acwing.com.cn/api/record/get/"
                }).then(resp=>{
                    for(let i in resp.data.records){
                        let username = resp.data.users[i].username;
                        if(username.length > 18) username = username.substr(0,18)+"...";
                        data.arr.push({
                            rank: parseInt(i) + 1,
                            username:  username,
                            photo: resp.data.users[i].photo,
                            time:resp.data.records[i].time.split(" ")[1],
                        })
                    }
                })
            };
            //往后端接受请求
            onMounted(() => {
              updateView();
            })
            return{
                data,
                time,
                updateView,
                handleSelectionChange,
                multipleTableRef,
                rankDialogVisible,
            }
          
        }
    }
</script>

<style scoped>
    .csszx{
        
    }
</style>