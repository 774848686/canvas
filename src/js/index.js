import '@/scss/index.scss';
import Food from './Food';
import Ship from './Ship';
const gm = {
	w : 375,
	h : 568,
	bgWidth : 375,
	bgHeight : 1126,
	time : 0,
	timmer : null,
	bgSpeed : 2,
	bgloop : 0,
	score : 0,
	foodList : [],
	bgDistance : 0,//背景位置
	eventType : {
		start : 'touchstart',
		move : 'touchmove',
		end : 'touchend'
	},
	init : function(){
		var _this = this;
		var canvas = document.getElementById('stage');
		var ctx = canvas.getContext('2d');

		//绘制背景
		var bg = new Image();
		_this.bg = bg;
		bg.onload = function(){
          	ctx.drawImage(bg, 0, 0, _this.bgWidth, _this.bgHeight);          	
        }
		bg.src = require('../../assets/images/bg.jpg').default;

		_this.initListener(ctx);


	},
	initListener : function(ctx){
		var _this = this;
		var body = $(document.body);
		$(document).on(gm.eventType.move, function(event){
			event.preventDefault();
		});
		body.on(gm.eventType.start, '.replay, .playagain', function(){
			$('#resultPanel').hide();
			var canvas = document.getElementById('stage');
			var ctx = canvas.getContext('2d');
			_this.ship = new Ship(gm,ctx);
      		_this.ship.controll();
      		_this.reset();
			_this.run(ctx);
		});

		body.on(gm.eventType.start, '#frontpage', function(){
			$('#frontpage').css('left', '-100%');
		});

		body.on(gm.eventType.start, '#guidePanel', function(){
			$(this).hide();
			_this.ship = new Ship(gm,ctx);
			_this.ship.paint();
      		_this.ship.controll();
			gm.run(ctx);
		});
	},
	rollBg : function(ctx){
		if(this.bgDistance>=this.bgHeight){
			this.bgloop = 0;
		}
		this.bgDistance = ++this.bgloop * this.bgSpeed;
		ctx.drawImage(this.bg, 0, this.bgDistance-this.bgHeight, this.bgWidth, this.bgHeight);
		ctx.drawImage(this.bg, 0, this.bgDistance, this.bgWidth, this.bgHeight);
	},
	run : function(ctx){
		var _this = gm;
		ctx.clearRect(0, 0, _this.bgWidth, _this.bgHeight);
		_this.rollBg(ctx);
		//绘制飞船
		_this.ship.paint();
		_this.ship.eat(_this.foodList);
		//产生月饼
		_this.genorateFood();
		//绘制月饼
		for(var i=_this.foodList.length-1; i>=0; i--){
			var f = _this.foodList[i];
			if(f){
				f.paint(ctx);
				f.move(ctx);
			}
		}
		_this.timmer = setTimeout(function(){
			gm.run(ctx);
		}, Math.round(1000/60));

		_this.time++;
	},
	stop : function(){
		var _this = this
		$('#stage').off(gm.eventType.start + ' ' +gm.eventType.move);
		setTimeout(function(){
			clearTimeout(_this.timmer);
		}, 0);
		
	},
	genorateFood : function(){
		var genRate = 50; //产生月饼的频率
		var random = Math.random();
		if(random*genRate>genRate-1){
			var left = Math.random()*(this.w - 50);
			var type = Math.floor(left)%2 == 0 ? 0 : 1;
			var id = this.foodList.length;
			var f = new Food(gm,type, left, id);
			this.foodList.push(f);
		}
	},
	reset : function(){
		this.foodList = [];
		this.bgloop = 0;
		this.score = 0;
		this.timmer = null;
		this.time = 0;
		$('#score').text(this.score);
	},
	getScore : function(){
		var time = Math.floor(this.time/60);
		var score = this.score;
		var user = 1;
		if(score==0){
			$('#scorecontent').html('真遗憾，您竟然<span class="lighttext">一个</span>月饼都没有抢到！');
			$('.btn1').text('大侠请重新来过').removeClass('share').addClass('playagain');
			$('#fenghao').removeClass('geili yinhen').addClass('yinhen');
			return;
		}
		else if(score<10){
			user = 2;
		}
		else if(score>10 && score<=20){
			user = 10;
		}
		else if(score>20 && score<=40){
			user = 40;
		}
		else if(score>40 && score<=60){
			user = 80;
		}
		else if(score>60 && score<=80){
			user = 92;
		}
		else if(score>80){
			user = 99;
		}
		$('#fenghao').removeClass('geili yinhen').addClass('geili');
		$('#scorecontent').html('您在<span id="stime" class="lighttext">2378</span>秒内抢到了<span id="sscore" class="lighttext">21341</span>个月饼<br>超过了<span id="suser" class="lighttext">31%</span>的用户！');
		$('#stime').text(time);
		$('#sscore').text(score);
		$('#suser').text(user+'%');
		$('.btn1').text('请小伙伴吃月饼').removeClass('playagain').addClass('share');
	}
}
gm.init();