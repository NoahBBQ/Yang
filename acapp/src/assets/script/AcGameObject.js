const AC_GAME_OBJECT = [];

export class AcGameObject{
    constructor(){
        AC_GAME_OBJECT.push(this);
        this.timedelta = 0;
        this.has_called_start = false;
    }
    start(){ //第一帧执行

    }
    update(){ //每一帧执行一次,出第一次外

    }
    on_destory(){ //删除执行前调用一次 之前destory 英文是打错的

    }
    destroy() { //删除
        this.on_destory();
        for(let i in AC_GAME_OBJECT){
            const obj = AC_GAME_OBJECT[i];
            if(obj == this){
                AC_GAME_OBJECT.splice(i);
            }
        }
    }
}

let last_timestamp; // 上一次执行时间

const step = timestamp => {
    for(let obj of AC_GAME_OBJECT){
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step);
}

requestAnimationFrame(step);




