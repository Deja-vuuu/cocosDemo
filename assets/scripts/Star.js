// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    getPlayDist: function(){
        let playerPos = this.game.player.getPosition();
        let dist  = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function(){
        this.game.spawnNewStar();
        this.node.destroy();
        // 得分
        this.game.gainScore();
    },


     update (dt) {
         // 根据 Game 脚本中的计时器更新星星的透明度
         let opacityRatio = 1 - this.game.timer/this.game.starDuration;
         let minOpacity = 50;
         // 节点透明度，默认值为 255。
         this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
         if (this.getPlayDist() < this.pickRadius){
            this.onPicked()
            return
         }
     },
});
