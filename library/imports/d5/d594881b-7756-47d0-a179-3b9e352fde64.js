"use strict";
cc._RF.push(module, 'd5948gbd1ZH0KF5O541L95k', 'ScoreFX');
// scripts/ScoreFX.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        anim: {
            default: null,
            type: cc.Animation
        }
    },

    init: function init(game) {
        this.game = game;
    },
    despawn: function despawn() {
        this.game.despawnScoreFX(this.node);
    },


    play: function play() {
        this.anim.play();
    }
});

cc._RF.pop();