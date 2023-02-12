
export class Cell {
    constructor(x,y,z,kind = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z; //标识优先级别,又标识id
        this.able = false; //能不能操作
        this.send_able = false; //是否发送
        this.nextX = x;
        this.nextY = y;
        this.state = "idle"; // 刚开始都是静止,后面再切换到移动,我现在是把它改成了只动卡槽区的
        this.kind = kind; //牌的种类
        this.speed = 12;
        this.flush = 15;
    
        //效果之后再补充
    }

    move(gamemap){
        if(this.state === "idle") return 0; //0,1表示场上是否移动的牌，没有的话,假如 有 三连,此时可以消去三连的牌，并触发过渡的动画
        //type = 0 表示是场上牌移动,1 则是 卡槽区 牌移动
        let dx = this.nextX - this.x, dy = this.nextY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy); //这里是没有算长度的，只是为了处理运动方向
        const eps = 1e-3;
        //console.log("move: "+this.x + " " + this.y +" "+ distance);
       
        if(Math.abs(distance * gamemap.L) < eps)
        {
            //表示移动到了
            this.state = "idle";
            return 0;
        }
        else
        {
            let move_distance = this.speed * gamemap.timedelta / 1000;
            //console.log(gamemap.timedelta);
            let move_x =  Math.min(move_distance,distance) * (dx / distance);
            let move_y = Math.min(move_distance,distance) * (dy / distance);
            //console.log(move_x + " " + move_y + " " +move_distance);
            this.x += move_x;
            this.y += move_y;
            return 1;
        }
    }
}