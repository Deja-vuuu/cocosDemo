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
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 辅助形变动作时间
        squashDuration: 0,
        playerPos: 0
    },


    onLoad () {
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    setJumpAction: function () {
        // 跳跃上升
        let jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        let jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        let callback = cc.callFunc(this.playJumpSound, this);
        //加入形变,更细腻的动画表现
        //压瘪
        let squash=cc.scaleTo(this.squashDuration,1,0.6);
        //拉升
        let stretch=cc.scaleTo(this.squashDuration,1,1.2);

        //恢复正常

        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        let squashBack=cc.scaleTo(this.squashDuration,1,1);

        return cc.repeatForever(cc.sequence(squash,stretch,jumpUp,squashBack,jumpDown,callback));

    },

    onKeyDown (event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight = true;
                break;
        }
    },
    onKeyUp (event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight = false;
                break;
        }
    },
    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    onDestroy () {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    update: function (dt) {
        let windowWidth = cc.winSize.width
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // this.xSpeed / Math.abs(this.xSpeed) 运动方向
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        // 根据当前速度更新主角的位置
        this.playerPos += this.xSpeed * dt;

        // 区域限制
        if (Math.abs(this.playerPos) > windowWidth / 2 - this.node.width / 2 && (!this.accLeft || !this.accRight)) {
            this.node.x = this.playerPos / Math.abs(this.playerPos) * (windowWidth / 2 - this.node.width / 2)
            this.xSpeed = 0
        }else {
            this.node.x = this.playerPos
        }

    },
});
