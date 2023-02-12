import axios from "axios";
import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";
import { ElMessage } from 'element-plus'

export class GameMap extends AcGameObject{
    constructor(ctx,parent,store){
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        this.L = 0.856 * this.parent.clientWidth / this.cols;
        this.rows = 11.35;
        this.cols = 7.7; //对应到卡槽放大1.1倍数
        
        this.cells = [];
        this.cells_backup = [];

        for(let card of store.state.game.cards)
        {
            this.cells.push(new Cell(card.x,card.y,card.z));
            this.cells_backup.push(new Cell(card.x,card.y,card.z));
        }
      
        this.cells.sort((a,b)=>a.z-b.z); //防止传进来是乱序的,但是一般不会
        this.cells_backup.sort((a,b)=>a.z-b.z)
   
        this.board = []; //卡牌区
        this.shows = []; //三联区
        
        this.send_cards = [] //发牌组

        for(let cell of this.cells)
        {
            let new_cell = new Cell(0,0,cell.z); // z 是有用的,后面render 可以用来过渡用
            new_cell.nextX = cell.x;
            new_cell.nextY = cell.y;
            new_cell.speed = 15;
            this.send_cards.push(new_cell);
        }
        //console.log(this.send_cards);
        this.pass = true; //第2帧跳过
        //洗牌的转场去掉因为感觉太耗时了，直接了当好
        this.wash_image = new Image();
        this.wash_image.src = "/static/img/card/洗牌.png"
        
        this.images = [];
        this.imagesG = [];
        this.kinds = ["白菜","锄头","胡萝卜","火柴","剪刀","铃铛","木桩","奶瓶","青草","手套","刷子","水桶","羊毛","玉米"]; //14种
        
        this.op = []; //记录玩家的所有操作
        this.tool_use_cnt = [1,1,1]; //每局只能执行一次

        for(let i = 0; i < 14; i ++)
        {
            let image = new Image();
            let imageG = new Image();
            image.src = `/static/img/card/${this.kinds[i]}.png`;
            imageG.src = `/static/img/card/${this.kinds[i]}G.png`;
            this.images.push(image);
            this.imagesG.push(imageG);
        }
        //console.log("I have been create!!!");
    }
    //随机出现牌面
    create_cells_kind(){
        //原则 是三的倍数,且有多少种类牌，而且还有牌数
        let card_kinds = this.store.state.game.kinds;
        let card_tot = this.store.state.game.tot;
        //随机开头
        let p = Math.floor(Math.random() * 5) % 14;
        let kinds = [];
        for(let j = 0; j < card_kinds; j ++)
        {
            kinds.push((p + j) % 14);
        }
        let use = this.store.state.game.cnt; //每种牌的数量
       
        for(let i = 0; i < card_tot; i ++)
        {
            let p = Math.floor(Math.random() * use.length);
            while(use[p] == 0) p = Math.floor(Math.random() * use.length);
            this.cells[i].kind = this.cells_backup[i].kind = kinds[p];
            use[p] -= 1;
        }
    }
    //发牌
    deal_cards(){ //负责除了第一关的发牌
        const send = this.send_cards;
        if(send.length === 0) return;
        //每次发一张牌
        for(let cell of send)
            if(cell.state === "move") return;

        //按距离排队 发送
        send.sort((a,b)=>{
            let a_move = (a.nextX - a.x)*(a.nextX - a.x) + (a.nextY - a.y)*(a.nextY - a.y);
            let b_move = (b.nextX - b.x)*(b.nextX - b.x) + (b.nextY - b.y)*(b.nextY - b.y);
            return b_move - a_move;
        });
        for(let i  = 0; i < send.length ; i ++)
        {
            if(send[i].send_able === true) continue;
            else {
                send[i].state = "move";
                send[i].send_able = true;
                if(this.store.state.game.level == 2)
                {
                    send[i].speed = 18;
                }
                else if(this.store.state.game.level == 3)
                {
                    send[i].speed = 20;
                }

                break;
            }
        }
    }
    start(){
        //console.log(this.timedelta);
        this.update_size();
        this.create_cells_kind();
        //this.deal_cards(); //这里有问题了，就是第一帧结束的时候 timedelta 已经很大了
        this.add_listening_event();
        this.ctx.imageSmoothingEnabled = true; //使用平滑算法
        this.calculate();
    }
    //
    next_level(){
        this.cells = [];
        this.cells_backup = [];
        this.send_cards = [];
        this.tool_use_cnt = [1,1,1];
        this.store.commit("updateTool_0",1);
        this.store.commit("updateTool_1",1);
        this.store.commit("updateTool_2",1);
  
        for(let card of this.store.state.game.cards)
        {
            this.cells.push(new Cell(card.x,card.y,card.z));
            this.cells_backup.push(new Cell(card.x,card.y,card.z));
        }
        for(let cell of this.cells)
        {
            let new_cell = new Cell(0,0,cell.z); // z 是有用的,后面render 可以用来过渡用
            new_cell.nextX = cell.x;
            new_cell.nextY = cell.y;
            new_cell.speed = 14;
            this.send_cards.push(new_cell);
        }
        this.create_cells_kind();
    }
    add_listening_event(){
        this.ctx.canvas.addEventListener("click",e=>{
            //发牌的时候点击失效
            if(this.send_cards.length !== 0) return;
            let rate = this.images[0].height / this.images[0].width;
            //console.log(e.offsetX + " " + e.offsetY);
            let flag = -1;
            let x = e.offsetX/this.L,y = e.offsetY/this.L;
            const cells = this.cells;
            for(let i in cells){
                let cell = cells[i];
                if(x > cell.x && x - cell.x < 1 && y > cell.y && y - cell.y < rate && cell.able && cell.state === "idle")
                {
                    flag = i;
                    break;
                }
            }
            if(flag != -1)
            {
                //记录玩家的操作
                let p = -1;
                const board = this.board;
                if(board.length === 7) //游戏结束
                {
                    this.store.commit("updateResult","lose");
                    // setTimeout(() => {
                    //     window.alert("游戏结束,即将重新开始");
                    //     window.location.reload();     
                    // },100);
                    return;
                    //
                }
                this.op.push(cells[flag].z); //相当于id传进去
                //从后往前第一张牌
                for(let i = board.length - 1;i >= 0 ; i --)
                {
                    if(board[i].kind === cells[flag].kind)
                    {
                        p = i;
                        break;
                    }
                }
                if(p === - 1) p = board.length; //没有找到就放到队尾
                else p = p + 1; //找到放到后面一个

                let new_cell = new Cell(cells[flag].x,cells[flag].y,cells[flag].z,cells[flag].kind);
            
                new_cell.nextX = p * 1.1; 
                new_cell.nextY = this.rows - rate - 0.1;
                new_cell.state = "move";

                cells.splice(flag,1);
                board.splice(p,0,new_cell);

                for(let i = p + 1;i < board.length; i ++)
                {
                    board[i].nextX = board[i].nextX + 1.1;
                    board[i].state = "move";
                }

                //判断有没有三联的情况
                if(p >= 2)
                {
                    //出现了三联
                    if(board[p - 2].kind === board[p - 1].kind && board[p].kind === board[p-1].kind)
                    {
                        //重新更新卡槽内的牌的位置信息
                        let a = new Cell(board[p-2].x,board[p-2].y,board[p-2].z,board[p-2].kind),
                            b = new Cell(board[p-1].x,board[p-1].y,board[p-1].z,board[p-1].kind),
                            c = new Cell(board[p].x,board[p].y,board[p].z,board[p].kind);
                        a.nextY =  board[p-2].nextY- (rate + 0.3), b.nextY = board[p-1].nextY - (rate + 0.3), c.nextY = board[p].nextY - (rate + 0.3);
                        a.nextX = board[p-2].nextX, b.nextX =  board[p-1].nextX, c.nextX = board[p].nextX;    
                        a.state = b.state = c.state = "move";
                        let one_show = [];
                        one_show.push(a,b,c);
                        //更新坐标
                        for(let j = p + 1 ; j < board.length; j ++)
                            board[j].nextX -= 3.3;
                        board.splice(p-2,3);
                        this.shows.push(one_show);
                      
                        if(board.length === 0 && cells.length == 0) {
                            if(this.store.state.game.level === 3){
                                axios({
                                    method:"post",
                                    url:"https://app3565.acapp.acwing.com.cn/api/record/insert/",
                                    headers:{
                                        Authorization:"Bearer " + this.store.state.user.token,
                                    },
                                    params:{
                                        uuid:this.store.state.game.uuid,
                                    }
                                }).then(resp=>{
                                    if(resp.data.error_message === "success"){
                                        this.store.commit("updateResult","pass");
                                        this.store.commit("updateRank",resp.data.rank);
                                    }else{
                                        ElMessage({
                                            message: '1.抱歉服务器发生错误',
                                            type: 'warning',
                                          })
                                    }
                                }).catch(()=>{
                                    ElMessage({
                                        message: '2.抱歉服务器发生错误',
                                        type: 'warning',
                                      })
                                });
                            }
                            else if(this.store.state.game.level === 2)
                            {
                                axios({
                                    method:"post",
                                    url:"https://app3565.acapp.acwing.com.cn/api/test/index/",
                                    headers:{
                                        Authorization:"Bearer " + this.store.state.user.token,
                                    },
                                    params:{
                                        level:3,
                                    }
                                }).then(resp=>{
                                    if(resp.data.error_message === "success")
                                    {
                                        this.store.commit("updateLevel",3);
                                        this.store.commit("updateTot",resp.data.tot);
                                        this.store.commit("updateKinds",resp.data.kinds);
                                        this.store.commit("updateCards",resp.data.cards);
                                        this.store.commit("updateCnt",resp.data.cnt);
                                        this.store.commit("updateUuid",resp.data.uuid);
                                        this.next_level();
                                    }else{
                                        this.store.commit("updateResult","win");
                                    }
                                })
                            }
                            else
                            {
                                axios({
                                    method:"post",
                                    url:"https://app3565.acapp.acwing.com.cn/api/test/index/",
                                    headers:{
                                        Authorization:"Bearer " + this.store.state.user.token,
                                    },
                                    params:{
                                        level:2,
                                    }
                                }).then(resp => {
                                    if(resp.data.error_message === "success")
                                    {
                                        this.store.commit("updateLevel",2);
                                        this.store.commit("updateTot",resp.data.tot);
                                        this.store.commit("updateKinds",resp.data.kinds);
                                        this.store.commit("updateCards",resp.data.cards);
                                        this.store.commit("updateCnt",resp.data.cnt);
                                        this.next_level();
                                    }
                                })
                            }
                          
                        }
                    }
                }
            }
        })
        //实现鼠标的效果
        this.ctx.canvas.addEventListener("mousemove",e=>{
            let rate = this.images[0].height / this.images[0].width;
            // console.log(e.offsetX + " " + e.offsetY);
            let flag = 1;
            let x = e.offsetX/this.L,y = e.offsetY/this.L;
            for(let cell of this.cells){
                if(x > cell.x && x - cell.x < 1 && y > cell.y && y - cell.y < rate && cell.able)
                {
                    flag = 0;
                    this.ctx.canvas.style.cursor = "pointer";
                    break;
                }
            }
            if(flag) this.ctx.canvas.style.cursor = "default";
        })
    }
    discharge(){ //对应道具1 取消最近操作的还在卡槽的三张牌并把它放置在牌桌上，假如卡槽的牌不足三张，则忽略本次操作
        //卡槽不足三张则撤销失败
        //
        //console.log("trying to use discharge...");
        if(this.board.length < 3 || this.tool_use_cnt[0] == 0) return ;
        let len = this.op.length;
        const op = this.op;
        const board = this.board;
        const cells = this.cells;
        const backup = this.cells_backup;
        const rate = this.images[0].height / this.images[0].width;
        //否则一定能找到三张牌拿来撤销
        for(let i = len - 1,cnt = 0; i >= 0 && cnt < 3; i -- )
        {
            for(let j = 0; j < board.length; j ++)
            {
                if(op[i] === board[j].z)
                {

                    for(let k = j + 1; k < board.length; k ++)
                    {   
                        board[k].nextX = board[k].nextX - 1.1;
                        board[k].state = "move";
                    }
                    let new_cell = new Cell(board[j].x,board[j].y,board[j].z,board[j].kind);
                    //这里的able 我默认是 要到达牌区域后 状态变成idle 后 才能再继续操作，为了相对美观
                    new_cell.nextX = 1.1 * 2 + cnt * 1.1; //初始位差 加相对距离
                    new_cell.nextY =  this.rows - rate - 2.5;
                    new_cell.able = true;
                    new_cell.state = "move";
                    for(let k = 0; k <  backup.length; k ++)
                        if(new_cell.z === backup[k].z)
                        {
                            backup[k].x = new_cell.nextX;
                            backup[k].y = new_cell.nextY;
                            break;
                        }
                    cells.push(new_cell);
                    //cells 要重新排序
                    cells.sort((a,b)=>a.z-b.z);
                    board.splice(j,1);
                    cnt += 1;
                    break;
                }
            }    
        }
        this.tool_use_cnt[0] = 0;
        this.store.commit("updateTool_0",0);
    }
    cancel(){ //对应道具2 取消上一次操作,同样也是对应卡槽的卡牌,假如已经被消掉了，则不能操作,因为没有意义
        //console.log("trying to use cancel...");
        let len = this.op.length;
        //下面写的或是为了我测试用，实际发布需要修改逻辑
        if(len == 0  || this.tool_use_cnt[1] == 0) return;
        const op = this.op;
        const board = this.board;
        const backup = this.cells_backup;
        const cells = this.cells;
        let flag = 0;
    
        //现在就能知道分离的好处了，很好处理和扩展
        for(let i = 0; i < board.length; i ++)
        {
            if(board[i].z === op[len - 1])
            {
                flag = 1;
                //更新下所有board牌的坐标
                for(let j = i + 1; j < board.length; j ++)
                {
                    board[j].nextX = board[j].nextX - 1.1;
                    board[j].state = "move";
                }
                //console.log(board);
                let new_cell = new Cell(board[i].x,board[i].y,board[i].z,board[i].kind);
                //backup 我默认是按从低到高排列的所有直接下标访问即可
                new_cell.able = true;

                new_cell.nextX = backup[op[len-1] - 1].x;
                new_cell.nextY = backup[op[len-1] - 1].y;
                new_cell.state = "move";
                cells.push(new_cell);
                //cells 要重新排序
                cells.sort((a,b)=>a.z-b.z);
                board.splice(i,1);
            }
        }
        if(flag === 1)
        { 
            this.tool_use_cnt[1] = 0; //
            this.store.commit("updateTool_1",0);
        }
    }
    shuffle(){ //对应道具3  对场面上的牌进行一轮洗牌
        // 对于场面内的额所有牌
        //console.log("trying to use shuffle...");
        let len = this.cells.length;
        if(this.send_cards.length !== 0 || this.tool_use_cnt[2] === 0) return 0;
        const cells = this.cells;
        //加点特效
        for(let i = 0; i < len; i ++)
        {
            let rand = i + Math.floor((Math.random() * (len - i)));
            let a = cells[i].kind;
            let b = cells[rand].kind;
            cells[i].kind = b,cells[rand].kind = a;
        }
        this.tool_use_cnt[2] === 0;
        this.store.commit("updateTool_2",0);
    }
    next_move(){
        /** 
         * 可以控制多张牌，想到了方法了
         * 具体方法是 我再卡槽区上方再开一个区域 用于 特效播放,这样就不会冲突了
         * 然后我判断就直接再监听事件里判断
         */
        //优先级别的顺序是不会变的，所以不需要每次都排序
        if(this.pass)
        {
            this.pass = false;   
             return;
        }
        for(let cell of this.send_cards)
            cell.move(this);
        for(let cell of this.cells)
            cell.move(this);
        for(let cell of this.board)
            cell.move(this);
        for(let show of this.shows)
            for(let cell of show)
                cell.move(this);
    }
    update_size(){
        //0.856 背景是我自己拼凑的，位置有点偏差
        this.L = 0.856 * this.parent.clientWidth / this.cols; //为了使小卡片 和卡槽能对上，而且方便我写卡片
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }
    update(){
        this.deal_cards();
        this.calculate();
        this.next_move();
        this.update_size();
        this.render();
    }
    calculate(){ //刚开始发牌的局面 和 算出这次操作后的局面,默认是算出局面信息
        let length = this.cells.length;
        const g = this.cells;
        const rate = this.images[0].height / this.images[0].width;
        //这里就可能会有误差了,因为 不是 整数了，小数计算就会有误差
        for(let i = 0; i < length; i ++)
        {
            let flag = 1;
            //移动的牌属于脱离牌面的牌,之前这样是对的，现在有了撤销 也就是说，牌面的牌也会有移动的情况
            if(g[i].state === "move") continue;
            for(let j = i + 1; j < length; j ++)
            {
                //之前的话下面是要注释掉的,原因和上面一样
                if(g[j].state === "move") continue;
                //坐标方向变了,错了记得来看这里，有没有写错的
                let a_lx = g[i].x,a_ly = g[i].y + rate,a_rx = g[i].x + 1,a_ry = g[i].y;
                let b_lx = g[j].x,b_ly = g[j].y + rate,b_rx = g[j].x + 1,b_ry = g[j].y; 
                let lx = Math.max(a_lx,b_lx),ly = Math.min(a_ly,b_ly);
                let rx = Math.min(a_rx,b_rx),ry = Math.max(a_ry,b_ry);
                if(lx >= rx || ly <= ry) continue;
                else //说明相交了
                {
                    flag = 0;
                    break;
                }
            }
            if(flag == 1) g[i].able = true;
            else g[i].able = false; //可以不用加，因为一开始就是false
        }
    }
    render(){
        const ctx = this.ctx;
        const L = this.L;
        const w = this.images[0].width,h = this.images[0].height;
        const imgs = this.images,imgsG = this.imagesG;
        let send_all = 0;
        for(let cell of this.send_cards)
        {
            const x = cell.x,y = cell.y,L = this.L;
            const wash_image = this.wash_image;
            if(cell.send_able === true && cell.state === "idle") send_all += 1;
            ctx.drawImage(wash_image,x * L,y * L,L, h / w * L);
           
        }
        if(send_all === this.send_cards.length)
        {
            this.send_cards = [];
        }
        for(let cell of this.cells)
        {
            const x = cell.x,y = cell.y,kind = cell.kind;
            const img = imgs[kind],imgG = imgsG[kind];
      
            if(this.send_cards.length === 0)
            {
                if(cell.able) ctx.drawImage(img,x * L, y * L, L, L * h / w);
                else ctx.drawImage(imgG,x * L,y * L, L, L * h / w);
           
            }
            //出生的动画等下再加吧特效
        }
        for(let cell of this.board)
        {
            const x = cell.x,y = cell.y,kind = cell.kind;
            const img = imgs[kind];
            ctx.drawImage(img, x * L, y * L, L * 1.1, 1.1 * L * h / w);
        }
        let new_shows = [];
        
        for(let show of this.shows)
        {
            let cnt = 0;
            for(let cell of show) cnt += cell.state === "idle"? 1 :0;

            if(cnt === 3) 
            {
                let flag = 1;
                for(let cell of show)
                {
                    const x = cell.x,y = cell.y,f = cell.flush,kind = cell.kind;
                    const img = imgs[kind];
                    if(f === 0) {flag = 0; break;}
                    ctx.drawImage(img,x * L, (y + (1 - f / 15))  * L, f / 15 * L, f / 15 * L * h / w);
                    ctx.fillStyle = `rgba(240,240,240,0.5)`;
                    ctx.fillRect( x * L,(y + (1 - f / 15))  * L, f / 15 * L, f / 15 * L * h / w);
                    cell.flush -= 1;
                }
                if(flag) new_shows.push(show);
            }
            else
            {
                for(let cell of show)
                {
                    const x = cell.x,y = cell.y,kind = cell.kind;
                    const img = imgs[kind];
                    ctx.drawImage(img,x * L,y * L, L * 1.1, 1.1 * L * h / w);
                }
                new_shows.push(show);
            }
        }
        this.shows = new_shows;
    }
}