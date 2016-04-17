/**
 * Created by Kiamkiet on 15/04/2016.
 */
var game={
    data:null,
    RN:4,
    CN:4,
    score:0,
    record:0,
    state:1,
    GAME_OVER:0,
    RUNNING:1,

    init:function(){
        var div=document.getElementById("gridPanel");
        div.style.width=this.RN*116+16+'px';
        div.style.height=this.CN*116+16+'px';
        var arr=[];
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                arr.push(""+r+c);
            }
        }
        var grids='<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';
        var cells='<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
        div.innerHTML=grids+cells;
    },
    start:function(){
        this.init();
        this.data=[];
        for(var r=0;r<this.RN;r++){
            this.data[r]=[];
            for(var c=0;c<this.CN;c++){
                this.data[r][c]=0;
            }
        }
        this.randomNum();
        this.randomNum();
        this.updateView();
        var me=this;//留住this
    //为当前页面注册键盘事件
        document.onkeydown=function(e){
          if(me.state==me.RUNNING){//只有游戏运行中，才响应键盘事件
            //事件处理函数中，this->.前的对象
            //获得事件对象——事件发生时自动封装事件信息的对象
            e=window.event||e;
            //根据不同的按键，调用不同的方法
            switch(e.keyCode){
              case 37: me.moveLeft(); break;
              case 38: me.moveUp(); break;
              case 39: me.moveRight(); break;
              case 40: me.moveDown(); break;
            }
          }
        }
    },
    randomNum:function(){
        for(;;) {
            var r = parseInt(Math.random() * this.RN);
            var c = parseInt(Math.random() * this.CN);
            if (this.data[r][c] == 0) {
                this.data[r][c]=Math.random()<0.5?2:4;
                break;
            }
        }
    },
    moveUp:function(){
        var before=String(this.data);
        for(var c=0;c<this.CN;c++){
            this.moveUpInCol(c);
        }
        var after=String(this.data);
        if(before!=after){
            this.randomNum();
            if(this.isGameover()){
                this.state=this.GAME_OVER;
            }
        }
        this.updateView();
    },
    moveUpInCol:function(c){
        for(var r=0;r<this.RN-1;r++){
            var nextr=this.moveUpInColNext(c,r);
            if(nextr==-1){break;}
            else{
                 if(this.data[r][c]==0){
                this.data[r][c]=this.data[nextr][c];
                this.data[nextr][c]=0;
                r--;
                }else if(this.data[r][c]==this.data[nextr][c]){
                this.data[r][c]*=2;
                this.data[nextr][c]=0;
                }
            }
        }
    },
    moveUpInColNext:function(c,r){
        for(var nextr=r+1;nextr<this.RN;nextr++){
            var nextData=this.data[nextr][c];
            if(nextData!=0){return nextr;}
        }return -1;
    },

    moveDown:function(){
        var before=String(this.data);
        for(var c=0;c<this.CN;c++){
            this.moveDownInCol(c);
        }
        var after=String(this.data);
        if(before!=after){
            this.randomNum();
            if(this.isGameover()){
                this.state=this.GAME_OVER;
            }
        }
        this.updateView();
    },
    moveDownInCol:function(c){
        for(var r=this.RN-1;r>0;r--){
            var prer=this.moveDownInColPre(c,r);
            if(prer==-1){break;}
            else{
                 if(this.data[r][c]==0){
                this.data[r][c]=this.data[prer][c];
                this.data[prer][c]=0;
                r++;
                }else if(this.data[r][c]==this.data[prer][c]){
                this.data[r][c]*=2;
                this.data[prer][c]=0;
                }
            }
        }
    },

    moveDownInColPre:function(c,r){
        for(var prer=r-1;prer>=0;prer--){
            var preData=this.data[prer][c];
            if(preData!=0){return prer;}
        }return -1;
    },
    moveRight:function(){//右移所有行
    //给data拍照，保存在变量before中
    var before=String(this.data);
    //r从0开始，到<RN结束，遍历data中每一行
    for(var r=0;r<this.RN;r++){
      //调用moveRightInRow,移动第r行
      this.moveRightInRow(r);
    }//(遍历结束)
    //再给data拍照，保存在变量after中
    var after=String(this.data);
    if(before!=after){//如果发生了变化
      //随机生成数，更新页面
      this.randomNum();
      //检查当前游戏是否结束
      if(this.isGameover()){
        //如果游戏结束，就将游戏状态改为GAMEOVER
        this.state=this.GAME_OVER;
        //如果当前得分>top
        if(this.score>this.top){
          //将当前得分写入cookie
          var now=new Date();
          now.setFullYear(now.getFullYear()+1);
          document.cookie="top1="+this.score+
                          ";expires="+now.toGMTString();
        }
      }
      this.updateView();
    }
  },
  moveRightInRow:function(r){//右移第r行
    //c从CN-1开始，到>0结束，每次-1
    for(var c=this.CN-1;c>0;c--){
      //调用getPrevInRow，查找c位置前一个不为0的位置，保存在变量prevc中
      var prevc=this.getPrevInRow(r,c);
      //如果没找到,就退出循环
      if(prevc==-1){break;}
      else{//否则
        if(this.data[r][c]==0){//如果当前元素为0
          //将r行prevc位置的元素赋值给当前元素
          this.data[r][c]=this.data[r][prevc];
          //将prevc位置的元素清零
          this.data[r][prevc]=0;
          c++; //c留在原地
        }else if(this.data[r][c]==
                  this.data[r][prevc]){
        //否则，如果当前元素等于r行prevc位置的元素
          this.data[r][c]*=2;//当前元素*=2;
          //将r行prevc位置的元素清零
          this.data[r][prevc]=0;
          //将当前元素的值累加到score中
          this.score+=this.data[r][c];
        }
      }
    }
  },
  getPrevInRow:function(r,c){//查找r行c之前的不为0的位置
    //prevc从c-1开始，到>=0结束,每次-1
    for(var prevc=c-1;prevc>=0;prevc--){
      //如果r行prevc位置的元素不等于0
      if(this.data[r][prevc]!=0){
        return prevc;//就返回prevc
      }
    }//(遍历结束)返回-1
    return -1;
  },
  moveLeft:function(){//左移所有行
    var before=String(this.data);//移动前拍张照
    //r从0开始，到<RN结束，遍历data中每一行
    for(var r=0;r<this.RN;r++){
      //调用moveLeftInRow(r)，移动第r行
      this.moveLeftInRow(r);
    }//(遍历结束)
    var after=String(this.data);//移动后拍张照
    //如果发生了移动，才随机生成数,更新页面
    if(before!=after){
      this.randomNum();
      //检查当前游戏是否结束
      if(this.isGameover()){
        //如果游戏结束，就将游戏状态改为GAMEOVER
        this.state=this.GAME_OVER;
        //如果当前得分>top
        if(this.score>this.top){
          //将当前得分写入cookie
          var now=new Date();
          now.setFullYear(now.getFullYear()+1);
          document.cookie="top1="+this.score+
                          ";expires="+now.toGMTString();
        }
      }
      this.updateView();
    }
  },
  moveLeftInRow:function(r){//左移第r行
    //c从0开始，到<CN-1结束，每次增1
    for(var c=0;c<this.CN-1;c++){
      //调用getNextInRow(r,c),查找r行c位置之后，下一个不为0的位置，保存在变量nextc中
      var nextc=this.getNextInRow(r,c);
      //如果nextc等于-1，就退出循环
      if(nextc==-1){break;}
      else{//否则
        //如果data中r行c列为0
        if(this.data[r][c]==0){
          //将data中r行nextc位置的值赋值给c位置
          this.data[r][c]=this.data[r][nextc];
          //将data中r行nextc位置重置为0
          this.data[r][nextc]=0;
          c--;//让c倒退一步，抵消c++，留在原地
        }else if(this.data[r][c]==
                  this.data[r][nextc]){
        //否则 如果data中r行c列的值等于data中r行nextc列的值
          //将data中r行c列的值*=2;
          this.data[r][c]*=2;
          //将data中r行nextc的值设置为0
          this.data[r][nextc]=0;
          //将当前元素的值累加到score中
          this.score+=this.data[r][c];
        }
      }
    }
  },
  //查找r行c列之后下一个不为0的位置
  getNextInRow:function(r,c){
    //nextc从c+1开始，到<CN结束，每次增1
    for(var nextc=c+1;nextc<this.CN;nextc++){
      //如果data中r行nextc位置不等于0
      if(this.data[r][nextc]!=0){
        return nextc; //就返回nextc
      }
    }//(遍历结束)返回-1
    return-1;
  },

    updateView:function(){
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                var div=document.getElementById("c"+r+c);
                if(this.data[r][c]!=0){
                    div.className="cell n"+this.data[r][c];
                    div.innerHTML=this.data[r][c];
                }else{
                    div.innerHTML="";
                    div.className="cell";
                }
            }
        }
    },

    isGameover:function(){
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                if(this.data[r][c]==0){
                    return false;
                }else if(c<this.CN-1&&(this.data[r][c]==this.data[r][c+1])){
                    return false;
                }else if(r<this.RN-1&&(this.data[r][c]==this.data[r+1][c])){
                    return false;
                }
            }
        }
        return true;
    }
}


window.onload=function(){game.start()};