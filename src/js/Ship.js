import {
    ImageGenerate
} from '@/utils';
export default function Ship(gm, ctx) {
    ImageGenerate.loadImage([require('../../assets/images/player.png').default]);
    this.width = 80;
    this.height = 80;
    this.left = gm.w / 2 - this.width / 2;
    this.top = gm.h - 2 * this.height;
    this.gm = gm;
    this.player = ImageGenerate.createImage(require('../../assets/images/player.png').default);
    this.ctx = ctx;
}
Ship.prototype.paint = function () {
    this.ctx.drawImage(this.player, this.left, this.top, this.width, this.height);
}

Ship.prototype.setPosition = function (event) {
    var touch = event.targetTouches[0];
    var tarL = touch.clientX;
    var tarT = touch.clientY;
    this.left = tarL - this.width / 2 - 16;
    this.top = tarT - this.height / 2;
    if (this.left < 0) {
        this.left = 0;
    }
    if (this.left > 375 - this.width) {
        this.left = 375 - this.width;
    }
    if (this.top < 0) {
        this.top = 0;
    }
    if (this.top > this.gm.h - this.height) {
        this.top = this.gm.h - this.height;
    }
    this.paint();
}

Ship.prototype.controll = function () {
    var _this = this;
    var stage = $('#gamepanel');
    var currentX = this.left,
        currentY = this.top,
        move = false;
    stage.on(this.gm.eventType.start, function (event) {
        _this.setPosition(event);
        move = true;
    }).on(this.gm.eventType.end, function () {
        move = false;
    }).on(this.gm.eventType.move, function (event) {
        console.log(move)
        event.preventDefault();
        if (move) {
            _this.setPosition(event);
        }

    });
}
Ship.prototype.stop = function(){
    $('#gamepanel').off(this.gm.eventType.start + ' ' +this.gm.eventType.move);
}
Ship.prototype.eat = function (foodlist) {
    for (var i = foodlist.length - 1; i >= 0; i--) {
        var f = foodlist[i];
        if (f) {
            var l1 = this.top + this.height / 2 - (f.top + f.height / 2);
            var l2 = this.left + this.width / 2 - (f.left + f.width / 2);
            var l3 = Math.sqrt(l1 * l1 + l2 * l2);
            if (l3 <= this.height / 2 + f.height / 2) {
                foodlist[f.id] = null;
                if (f.type == 0) {
                    this.gm.stop();
                    this.stop();
                    $('#gameoverPanel').show();
                    setTimeout(function () {
                        $('#gameoverPanel').hide();
                        $('#resultPanel').show();
                        this.gm.getScore();
                    }, 2000);
                } else {
                    $('#score').text(++this.gm.score);
                    $('.heart').removeClass('hearthot').addClass('hearthot');
                    setTimeout(function () {
                        $('.heart').removeClass('hearthot')
                    }, 200);
                }
            }
        }

    }
}