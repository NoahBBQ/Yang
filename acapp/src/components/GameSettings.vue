<template>
    <div style="margin-top:2vw;">
        <el-button @click="settingDialogVisible = true" type="success" size="large" style="width: 7.5vw;height:2.8vw;">设置</el-button>
        <el-dialog
            v-model="settingDialogVisible"
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
                <el-button @click="settingDialogVisible = false;">取消</el-button>
                <el-button type="primary" @click="settingDialogVisible = false">
                确认
                </el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref} from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { useStore } from 'vuex';

    export default{
        watch:{
            enableMusic(){
                // console.log(this.enableMusic);
                this.$store.commit("updateMusic",this.enableMusic);
            },
        },
        setup(){
            const settingDialogVisible = ref(false);
            const store = useStore();
            const enableMusic = ref(store.state.setting.music);
            return{
                settingDialogVisible,
                enableMusic,
                Check,
                Close,
            }
        }
    }
</script>

<style scoped>
</style>