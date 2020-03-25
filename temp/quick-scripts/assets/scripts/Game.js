(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dfd50t3ye1BZpVVYZ+sjAgm', 'Game', __filename);
// scripts/Game.js

'use strict';

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
        }
    },

    onLoad: function onLoad() {
        console.log(this);
        // 获取地平面的 y 轴坐标????
        this.groundY = this.ground.y + this.ground.height / 2;
        this.scorePool = new cc.NodePool('ScoreFX');
        this.starPool = new cc.NodePool('Star');
        // 初始化计分
        this.spawnNewStar();
    },


    spawnNewStar: function spawnNewStar() {
        //instantiate 方法的作用是：克隆指定的任意类型的对象，或者从 Prefab 实例化出新节点，返回值为 Node 或者 Object
        var newStar = null;
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get();
        } else {
            newStar = cc.instantiate(this.starPrefab);
        }
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this;
        console.log(' newStar.getComponent(\'Star\')', newStar.getComponent('Star'));
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },
    // 生成得分
    spawnScoreFX: function spawnScoreFX() {
        var fx = void 0;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        } else {
            fx = cc.instantiate(this.testPrefab).getComponent('ScoreFX');
            fx.init(this);
            return fx;
        }
    },
    // 销毁得分
    despawnScoreFX: function despawnScoreFX(scoreFX) {
        this.scorePool.put(scoreFX);
    },


    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        // 产生正负
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标  cc.v2二维向量坐标
        return cc.v2(randX, randY);
    },

    gainScore: function gainScore(pos) {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score;
        // 播放特效
        var fx = this.spawnScoreFX();
        console.log('fx', fx);
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();
        cc.audioEngine.playEffect(this.gainScoreAudio, false);
    },

    gameOver: function gameOver() {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    },

    update: function update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            // this.gameOver();
            return;
        }
        this.timer += dt;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        