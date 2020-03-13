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
       // 这个属性引用了星星预制资源
       starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 5,
        minStarDuration: 3,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 初始化得分
        score: 0,
        gainScoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        testPrefab: {
            default: null,
            type: cc.Prefab
        },
    },


    onLoad () {
        // 获取地平面的 y 轴坐标????
        this.groundY = this.ground.y + this.ground.height / 2;
        // 初始化计分
        this.spawnNewStar();
    },

    spawnNewStar: function() {
        //instantiate 方法的作用是：克隆指定的任意类型的对象，或者从 Prefab 实例化出新节点，返回值为 Node 或者 Object
        let newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this;

        this.starDuration = this.minStarDuration + Math.random()*(this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },
    getNewStarPosition: function () {
        let randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        let randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        let maxX = this.node.width/2;
        // 产生正负
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标  cc.v2二维向量坐标
        return cc.v2(randX, randY);
    },

    gainScore: function () {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score;
        // 播放特效
        console.log(this);
        var fx = cc.instantiate(this.testPrefab).getComponent('Test');
        this.node.addChild(fx.node);
        fx.node.setPosition(10, 20);
        fx.play();
        cc.audioEngine.playEffect(this.gainScoreAudio, false);
    },


    gameOver: function () {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    },

     update (dt) {
         // 每帧更新计时器，超过限度还没有生成新的星星
         // 就会调用游戏失败逻辑
         if (this.timer > this.starDuration) {
             // this.gameOver();
             return;
         }
         this.timer += dt;
     },
});
