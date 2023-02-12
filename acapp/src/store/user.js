import axios from "axios";
import { ElMessage } from 'element-plus'

export default{
    state: {
        id:"",
        username:"",
        photo:"",
        token:"",
        is_login:false,
        rank:"",
        AcWingOS:"AcWingOS"
    },
    getters: {
    },
    mutations: {
        updatePhoto(state,photo){
            state.photo = photo;
        },
        updateUser(state,user){
            state.id = user.id;
            state.username = user.username;
            state.photo = user.photo;
            state.is_login = user.is_login;
        },
        updateToken(state,token){
            state.token = token;
        },
        logout(state){
            state.id = "",
            state.username = "",
            state.photo = "",
            state.token = "",
            state.is_login = false
        },
        updateRank(state,rank){
            state.rank = rank;
        }
    },
    actions: {
        login(context,data){
            axios({
                method:"post",
                url:"https://app3565.acapp.acwing.com.cn/api/user/account/token/",
                params:{
                    username:data.username,
                    password:data.password,
                }
            }).then(resp=>{
                if(resp.data.error_message === "success"){
                    localStorage.setItem("jwt_token",resp.data.token);
                    context.commit("updateToken",resp.data.token);
                    context.dispatch("getinfo",{
                        token:resp.data.token,
                        error(){

                        }
                    });
                    ElMessage({
                        message: '登录成功',
                        type: 'success',
                      })
                }
            }).catch(()=>{
                ElMessage({
                    message: '账号或密码错误',
                    type: 'error',
                })
            });
        },
        getinfo(context,data){
            const token = data.token;
            axios({
                method:"post",
                url:"https://app3565.acapp.acwing.com.cn/api/user/account/info/",
                headers:{
                    Authorization:"Bearer " + token,
                }
            }).then(resp=>{
                if(resp.data.error_message === "success"){
                    context.commit("updateUser",{
                        ...resp.data,
                        is_login:true,
                    });
                }else{
                    data.error();
                }
            })
        },
        logout(context){
            localStorage.removeItem("jwt_token");
            context.commit("logout");
        }
    },
    modules: {
      
    }
}