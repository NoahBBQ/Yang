<template>

    <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>个人中心</span>
          </div>
        </template>
        <div style="display: flex;justify-content: space-between; ">
            <div class="box-flex" style="width: 15vw;">
                <img
                :src="$store.state.user.photo"
                class="image"
                />
                <el-popover :visible="visible" placement="top" :width="160" id="popover">
                    <el-input v-model="inputUrl" placeholder="请输入图片url" clearable />
                    <input type="text" hidden v-model="st"/>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" plain @click="visible=false;st = 0;"
                        >取消</el-button
                      >
                      <el-button size="small" type="primary" @click="visible=false;st = 1;"
                        >确定</el-button
                      >
                    </div>
                    <template #reference>
                      <el-button @click="visible=true;st = 0;">修改头像</el-button>
                    </template>
                </el-popover>
            </div>
            <div class="box-flex" style="width: 30vw;margin-right:5vw;">
                <span>今日评语(不定期更新)</span>
                <el-divider />
                <span
                >希望你每天都开心</span
                >
                <el-divider />
                <span
                >有些东西失去了就再也找不回来了,过往终将成遗憾。</span
                >
            </div>
        </div>
        
      </el-card>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue'
import { useStore } from 'vuex';
export default{
    watch:{
        st(){ //靠watch来添加变化
            if(this.st == 1){
                const url = this.inputUrl;
                axios({
                    method:"post",
                    url:"https://app3565.acapp.acwing.com.cn/api/user/account/update/photo/",
                    headers:{
                        Authorization:"Bearer " + this.$store.state.user.token,
                    },
                    params:{
                        photo:url,
                    }
                }).then(resp=>{
                    if(resp.data.error_message === "success"){
                        this.$store.commit("updatePhoto",url);
                    }
                });
            }
        }
    },
    setup(){
       const inputUrl = ref("");
       const st = ref("0");
       const visible = ref(false);
       const store = useStore();
       const jwt_token = localStorage.getItem("jwt_token");
            if(jwt_token){
                store.commit("updateToken",jwt_token);
                store.dispatch("getinfo",{
                    token:jwt_token,
                    error(){localStorage.removeItem("jwt_token");}
                });
            }
       return {
            visible,
            inputUrl,
            st,
    
       }
    }
}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .box-card {
    width: 60vw;
    margin:0 auto;
    margin-top: 1vw;
  }
  .image{
    width: 15vw;
    height: 15vw;
  }
  .box-flex{
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
</style>