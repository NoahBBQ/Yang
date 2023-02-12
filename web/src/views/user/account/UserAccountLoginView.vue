<template>
    <el-card class="box-card" v-if="show_content">

        <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="user"
        style="max-width: 360px"
        >
        <el-form-item label="用户名">
            <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="user.password" />
        </el-form-item>
        
        <el-form-item style="margin-left:8vw;">
            <el-button type="success" plain  @click="registerDialog= true"
                >注册</el-button
            >
            <el-button type="primary" plain @click="login()"
                >登录</el-button
            >
            </el-form-item>
        </el-form>
        <el-dialog  v-model="registerDialog" title="注册" width="25%">
            <el-form 
            :model="form"
            label-width="100px"
            style="max-width: 360px"
            >
                <el-form-item label="用户名">
                    <el-input maxlength="100"  show-word-limit v-model="form.username" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" show-password v-model="form.password" />
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input type="password"  show-password v-model="form.confirmedPassword" />
                </el-form-item>
            </el-form>
            <span class="alert">*注册成功后会自动登录</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="registerDialog = false">取消</el-button>
                <el-button type="primary" @click="register()">
                   确定
                </el-button>
              </span>
            </template>
          </el-dialog>
    </el-card>
    
  </template>
  
  <script>
  import { ref ,reactive} from 'vue'
  import { useStore } from 'vuex';
  import axios from 'axios';
  import { ElMessage } from 'element-plus'
  import router from '@/router';

    export default{
        components:{
           
        },
        setup(){
            const store = useStore();
            const labelPosition = ref('right');
            const registerDialog= ref(false);
            let show_content = ref(false);

            //localStorage存储token
            const jwt_token = localStorage.getItem("jwt_token");
            if(jwt_token){
                store.commit("updateToken",jwt_token);
                store.dispatch("getinfo",{
                    token:jwt_token,
                    error(){
                        show_content.value = true;
                        localStorage.removeItem("jwt_token");
                    }
                });
                router.push({name:"game_menu_index"});
            }else{
                show_content.value = true;
            }
          
            //解决闪的问题，就是切换会出现白色交替
           
            const form = reactive({
                name:"",
                password:"",
                confirmedPassword:""
            });
            const user = reactive({
                username: '',
                password:'',
            });
            const login = ()=>{
                store.dispatch("login",user);
            }
            const register = ()=>{
                axios({
                    method:"post",
                    url:"https://app3565.acapp.acwing.com.cn/api/user/account/register/",
                    params:{
                        username:form.username,
                        password:form.password,
                        confirmedPassword:form.confirmedPassword,
                    }
                }).then(resp=>{
                    if(resp.data.error_message === "success"){
                        user.username = form.username;
                        user.password = form.password;
                        store.dispatch("login",user);
                    }
                    else
                    {
                        ElMessage({
                            message: resp.data.error_message,
                            type: 'error',
                        })
                    }
                })
            }
            return{
                show_content,
                labelPosition,
                registerDialog,
                form,
                user,
                login,
                register
            }
        }
  }
  </script>


<style scoped>
.box-card {
    width: 480px;
    margin: 0 auto;
    margin-top: 5vw;
  }
  .alert{
    margin-left: 14vw;
    font-size: 4px;
    color: grey;
  }
</style>
  