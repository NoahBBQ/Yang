
export default {
  state: {
     level:1,
     gamemap:null,
     kinds:0,
     tot:0,
     cards:[],
     cnt:[],  //每类牌的数量
     tool_0:1,
     tool_1:1,
     tool_2:1,
     result:"", //空表示初始状态   lose 对应 输掉比赛 win 表示通过了第二关 但是没有触发隐藏关卡 pass表示触发了第三关并通关了
     uuid:""
  },
  getters: {
  },
  mutations: { //修改写这里
    updateLevel(state,level){
      state.level = level;
    },
    updateGameMap(state,gamemap){
        state.gamemap = gamemap;
    },
    updateKinds(state,kinds){
      state.kinds = kinds
    },
    updateTot(state,tot){
      state.tot = tot;
    },
    updateCards(state,cards){
      state.cards = cards;
    },
    updateCnt(state,cnt){
      state.cnt = cnt;
    },
    updateTool_0(state,tool_0){
      state.tool_0 = tool_0;
    },
    updateTool_1(state,tool_1){
      state.tool_1 = tool_1;
    },
    updateTool_2(state,tool_2){
      state.tool_2 = tool_2;
    },
    updateResult(state,result){
      state.result = result;
    },
    updateUuid(state,uuid){
      state.uuid = uuid;
    },
  },
  actions: { //复杂的操作，需要异步的写这里
    
  },
  modules: {
  }
}
