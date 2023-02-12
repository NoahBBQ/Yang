<template>
    <div style="margin-top:2vw;">
        <el-button @click="helperDialogVisible = true" type="success" size="large" style="width: 7.5vw;height:2.8vw;">游戏规则</el-button>
        <el-dialog
            v-model="helperDialogVisible"
            title="规则"
            width="30%"
        >
            <p>第一关 会有4种牌型 共12张牌</p>
            <p>第二关 会有10种牌型 共36张牌</p>
            <p>隐藏关卡 前两关通关后概率开启, 牌型不定，牌数不定</p>
            <p>场上一共有三种道具，每种一个关卡只能用一次</p>
            <div class="clarity">
                <p>1. 从卡槽中撤销三张牌,并按操作顺序逆序摆放在牌面上 (当且仅当卡槽中存有三张牌)</p>
                <img src="/static/img/tool/道具1.png" alt="" class="image">
            </div>
            <div class="clarity">
                <p>2. 撤销上一次操作(当且仅当上一次操作的牌还在卡槽内)</p>
                <img src="/static/img/tool/道具2.png" alt="" class="image">
            </div>
            <div class="clarity">
                <p>3. 随机打乱场上所有的牌</p>
                <img src="/static/img/tool/道具3.png" alt="" class="image">
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="helperDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="helperDialogVisible = false">
                确认
                </el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref} from 'vue'
export default{
        components:{
        },
        setup(){
            const helperDialogVisible = ref(false);        
            return{
                helperDialogVisible,
            }
          
        }
    }
</script>

<style scoped>
.clarity{
    display: flex;
    text-align: center;
    justify-content: space-between;
    margin-bottom: 1vw;
}
.image{
    width: 4vw;
    height: 2.8vw;
}
</style>