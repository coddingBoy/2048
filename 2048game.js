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
    top:0,

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
    	this.state=this.RUNNING;
        this.init();
        this.data=[];
        this.score=0;
        if(document.cookie.indexOf("=")!=-1){
        	this.top=document.cookie.split("=")[1];
        }
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
    move:function(iterator){
    	var before=String(this.data);
        iterator();
        var after=String(this.data);
        if(before!=after){
            this.randomNum();
            if(this.isGameover()){
                this.state=this.GAME_OVER;
                if(this.score>this.top){
                	var now=new Date();
                    now.setFullYear(now.getFullYear()+1);
                    document.cookie="top1="+this.score+
                    ";expires="+now.toGMTString();
                }
            }
        } 	
        this.updateView();
    },
    moveUp:function(){
        var me=this;
        this.move(function(){for(var c=0;c<me.CN;c++){
            me.moveUpInCol(c);
        }});
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
                this.score+=(this.data[r][c]*=2);
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
        var me=this;
        this.move(function(){for(var c=0;c<me.CN;c++){
            me.moveDownInCol(c);
        }});   
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
                this.score+=(this.data[r][c]*=2);
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
    moveRight:function(){
    	var me=this;
    	this.move(function(){for(var r=0;r<me.RN;r++){
      me.moveRightInRow(r);
    }});
  },
  moveRightInRow:function(r){
    for(var c=this.CN-1;c>0;c--){
      var prevc=this.getPrevInRow(r,c);
      if(prevc==-1){break;}
      else{
        if(this.data[r][c]==0){
          this.data[r][c]=this.data[r][prevc];
         
          this.data[r][prevc]=0;
          c++; 
        }else if(this.data[r][c]==
                  this.data[r][prevc]){
          this.score+=(this.data[r][c]*=2);
          this.data[r][prevc]=0;
        }
      }
    }
  },
  getPrevInRow:function(r,c){
    for(var prevc=c-1;prevc>=0;prevc--){
      if(this.data[r][prevc]!=0){
        return prevc;
      }
    }
    return -1;
  },
  moveLeft:function(){
  	var me=this;
    this.move(function(){for(var r=0;r<me.RN;r++){
      me.moveLeftInRow(r);
    }}); 
  },
  moveLeftInRow:function(r){
    for(var c=0;c<this.CN-1;c++){
      var nextc=this.getNextInRow(r,c);
      if(nextc==-1){break;}
      else{
        if(this.data[r][c]==0){
          this.data[r][c]=this.data[r][nextc];
          this.data[r][nextc]=0;
          c--;
        }else if(this.data[r][c]==
                  this.data[r][nextc]){
         this.score+=(this.data[r][c]*=2);
          this.data[r][nextc]=0;
        }
      }
    }
  },
  getNextInRow:function(r,c){
    for(var nextc=c+1;nextc<this.CN;nextc++){   
      if(this.data[r][nextc]!=0){
        return nextc; 
      }
    }
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
        score.innerHTML=this.score;
        topScore.innerHTML=this.top;
        if(this.state==this.GAME_OVER){
        	gameOver.style.display="block";
        	finalScore.innerHTML=this.score;
        }else{
        	gameOver.style.display="none";
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