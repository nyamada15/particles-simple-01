
var createjs = window.createjs;
var ww, wh;

var canvas = document.getElementById("particle_canvas"), wrapper = $('#bg_canvas'), ratio, stage, particle, num, scale_min, scale_max, Cont, delta;
var shapes = [];
var id;
var ADD_LENGTH_PC = 0.0015;	// アニメーション時の移動距離
var ADD_LENGTH_SP = 0.004;	// アニメーション時の移動距離
init();


function init() {
	// ww = Math.floor(window.innerWidth);
	// wh = Math.floor(window.innerHeight);
	ww = Math.floor($(window).width());
	wh = Math.floor($(window).height());
	
	// カンバス設定
	if (stage) {
		stage.removeAllChildren();
	} else {
		stage = new createjs.Stage("particle_canvas");
	}
	
	
	// ratio = window.devicePixelRatio;
	ratio = 1;
	cw = wrapper.width();
	ch = wrapper.height();
	var scale = 1;
	if (ratio) {
		cw *= ratio;
		ch *= ratio;
		scale = ratio;
		// ww *= ratio;
		// wh *= ratio;
	}
	canvas.width = cw;
	canvas.height = ch;
	canvas.scaleX = canvas.scaleY = scale;
	
	if (Cont) {
		Cont.removeAllChildren();
	} else {
		Cont = new createjs.Container();
	}
	
	stage.addChild(Cont);


	if (ww > 768) {
		num = 50;
		scale_max = Math.floor(cw * 0.04);
		scale_min = Math.floor(scale_max / 4);
		delta = cw * ADD_LENGTH_PC;
	} else {
		num = 20;
		scale_max = Math.floor(cw * 0.08);
		scale_min = Math.floor(scale_max / 3);
		delta = cw * ADD_LENGTH_SP;
	}
	
	setParticle();
	
			
	

	
}

function setParticle() {
		
	// var pixel_num = logo_pixels.length;
	for(var a = 0; a < num; a++) {
		// var randPixel = randInt(0, pixel_num-1);
		// var image_index = randInt(0,d_images.length-1);
		particle = new createjs.Shape();
		// particle.regX = logo_p.regX = d_w / 2;
		// particle.regY = logo_p.regY = d_h / 2;
		var edge = getInitEdge();
		
		// console.log(currentX);
		particle.x = edge.startX;
		particle.y =  edge.startY;
		
		// particle.finish_x = edge.endX;
		// particle.finish_y = edge.endY;
		particle.graphics.beginFill("#fff");
		particle.alpha = randInt(3, 5) / 10;
		var p_size = randInt(scale_min, scale_max);
		particle.graphics.drawRect(0, 0, p_size, p_size);
		// particle.rotation = logo_p.rotation = randInt(-45, 45);

		var arrayDelta = getDelta(edge);
		// var radian = Math.atan2(edge.endY - edge.startY, edge.endX - edge.startX);
		// var deltaY = Math.floor(Math.sin(radian) * delta);
		// var deltaX = Math.floor(Math.cos(radian) * delta);

		// console.log("deltaX:" + deltaX + ", deltaY:" + deltaY);

		shapes.push({shape: particle, edge: edge, currentX: edge.startX, currentY: edge.startY, deltaX: arrayDelta[0], deltaY: arrayDelta[1]});

		Cont.addChild(particle);

		// 降ってくる動きの設定
		// var duration = randInt(duration_time/2, duration_time);
		// var timeline = new createjs.Timeline({ start: 0 }, { paused: true });

		// timeline.addTween(
		// 	createjs.Tween.get(particle, { override: true }).to({x: particle.finish_x}, duration, createjs.Ease.linear)
		// );
		// timeline.gotoAndPlay('start');

		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", moveParticle);



	}
	// logo_stage.update();
	// console.log(shapes);
	stage.update();
}

function moveParticle() {
	for (var i = 0; i < shapes.length; i++) {

		// if ( Math.abs(shapes[i].edge.endX - shapes[i].currentX) <= 0 || Math.abs(shapes[i].edge.endY - shapes[i].currentY) <= 0 ) {
		if ( -1 * scale_max > shapes[i].currentX || cw + scale_max < shapes[i].currentX || -1 * scale_max > shapes[i].currentY || ch + scale_max < shapes[i].currentY ) {
			// console.log("INIT! / " + i);
			// 初期化
			getEdge(shapes[i].edge);
			// console.log(shapes[i]);
			shapes[i].currentX = shapes[i].edge.startX;
			shapes[i].currentY = shapes[i].edge.startY;
			var arrayDelta = getDelta(shapes[i].edge);
			shapes[i].deltaX = arrayDelta[0];
			shapes[i].deltaY = arrayDelta[1];
		} else {
			// 移動
			shapes[i].currentX += shapes[i].deltaX;
			shapes[i].currentY += shapes[i].deltaY;
		}
		shapes[i].shape.x = shapes[i].currentX;
		shapes[i].shape.y = shapes[i].currentY;
		stage.update();
	}

}

// ランダム関数（少数用）
function randFloat(min, max) {
	return min + Math.random() * (max - min);
}
// ランダム関数（整数用）
function randInt(min, max) {
	return min + Math.floor(Math.random() * Math.floor(max + 1 - min));
}

function getDelta(edge) {
	
	var radian = Math.atan2(edge.endY - edge.startY, edge.endX - edge.startX);
	var deltaX = Math.floor(Math.cos(radian) * delta * 10) / 10;
	var deltaY = Math.floor(Math.sin(radian) * delta * 10) / 10;
	// console.log(deltaY);
	return [deltaX, deltaY];
}

function PointEdge() {
	this.startX;
	this.startY;
	this.endX;
	this.endY;
}

function randTwo(min, max) {
	var first = min + Math.floor(Math.random() * Math.floor(max + 1 - min));
	var second;
	do  {
		second = min + Math.floor(Math.random() * Math.floor(max + 1 - min));
	} while (first == second);
	return [first, second];
}


function getEdge(edge) {
	// var edge = new PointEdge();
	var edgeCodes = randTwo(0, 3);
	

	switch (edgeCodes[0]) {
		case 0:
			edge.startX = 0 - scale_max;
			edge.startY = randInt(0, wh);
			break;
		case 1:
			edge.startX = ww + scale_max;
			edge.startY = randInt(0, wh);
			break;
		case 2:
			edge.startX = randInt(0, ww);
			edge.startY = 0 - scale_max;
			break;
		case 3:
			edge.startX = randInt(0, ww);
			edge.startY = wh + scale_max;
			break;
	}
	switch (edgeCodes[1]) {
		case 0:
			edge.endX = 0 - scale_max;
			edge.endY = randInt(0, wh);
			break;
		case 1:
			edge.endX = ww + scale_max;
			edge.endY = randInt(0, wh);
			break;
		case 2:
			edge.endX = randInt(0, ww);
			edge.endY = 0 - scale_max;
			break;
		case 3:
			edge.endX = randInt(0, ww);
			edge.endY = wh + scale_max;
			break;
	}

	// return edge;
}
function getInitEdge() {
	var edge = new PointEdge();
	var edgeCodes = randTwo(0, 3);
	edge.startX = randInt(1, cw + scale_max * 2) - scale_max;
	edge.startY = randInt(1, ch + scale_max * 2) - scale_max;
	// var currentX = randInt(1, cw + scale_max * 2) - scale_max;
	// var currentY = randInt(1, ch + scale_max * 2) - scale_max;

	// switch (edgeCodes[0]) {
	// 	case 0:
	// 		edge.startX = 0 - scale_max;
	// 		edge.startY = randInt(0, wh);
	// 		break;
	// 	case 1:
	// 		edge.startX = ww + scale_max;
	// 		edge.startY = randInt(0, wh);
	// 		break;
	// 	case 2:
	// 		edge.startX = randInt(0, ww);
	// 		edge.startY = 0 - scale_max;
	// 		break;
	// 	case 3:
	// 		edge.startX = randInt(0, ww);
	// 		edge.startY = wh + scale_max;
	// 		break;
	// }
	switch (edgeCodes[1]) {
		case 0:
			edge.endX = 0 - scale_max;
			edge.endY = randInt(0, wh);
			break;
		case 1:
			edge.endX = ww + scale_max;
			edge.endY = randInt(0, wh);
			break;
		case 2:
			edge.endX = randInt(0, ww);
			edge.endY = 0 - scale_max;
			break;
		case 3:
			edge.endX = randInt(0, ww);
			edge.endY = wh + scale_max;
			break;
	}

	return edge;
}
//$(window).on("load", function() {
	