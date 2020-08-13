import {ImageGenerate} from '@/utils';
export default function Food(gm,type, left, id){
	this.speedUpTime = 300;
	this.id = id;
	this.type = type;
	this.width = 50;
	this.height = 50;
	this.left = left;
	this.top = -50;
	this.speed = 0.04 * Math.pow(1.2, Math.floor(gm.time/this.speedUpTime));
	this.loop = 0;
    this.gm = gm;
	const pic= this.type == 0 ? require('../../assets/images/food1.png').default : require('../../assets/images/food2.png').default;
	this.pic = ImageGenerate.createImage(pic);
}
Food.prototype.paint = function(ctx){
	ctx.drawImage(this.pic, this.left, this.top, this.width, this.height);
}
Food.prototype.move = function(ctx){
	if(this.gm.time % this.speedUpTime == 0){
		this.speed *= 1.2;
	}
	this.top += ++this.loop * this.speed;
	if(this.top>this.gm.h){
        this.gm.foodList[this.id] = null;
	}
	else{
		this.paint(ctx);
	}
}