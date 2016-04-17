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
    updateView:function(){
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                var div=document.getElementById("c"+c+r);
                if(this.data[r][c]!=0){
                    div.className="cell n"+this.data[r][c];
                    div.innerHTML=this.data[r][c];
                }else{
                    div.innerHTML="";
                    div.className="cell";
                }
            }
        }
    }

}


window.onload=function(){game.start()};