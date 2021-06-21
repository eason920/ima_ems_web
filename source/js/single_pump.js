let dataMain = new Object();
let dataColor = new Object();
let dataThre = new Object()

const nua = navigator.userAgent;
const isMobile = /iphone | ipad | android/i.test(nua);

let ii = 1

const fnHtmlTitle = function(data, name){
	// console.log('title ', data, name);
	let h ='';
	h+='<div class="title">'
		h+='<div class="title-txt">'+name+'</div>'
		h+='<div class="title-switch"> '
			data.forEach(function(item, i){
				if( item.machine.trim() != ''){
					h+='<div class="title-item"> '
					h+='<div class="title-machine">'+item.machine+'：</div>'
					h+='<div class="title-status" data-status="'+item.status+'">'+item.status+'</div>'
					h+='</div>'// item
				};
				if( item.machine.trim() == '' && i == 0){
					h+='(no switch in this group)'
				}
			});
		h+='</div>'
	h+='</div>' // title
	return h
};

const fnHtmlPump = function(data){
	// console.log('pump ', data);
	let h = '';
	h+='<div class="card-item" data-type="pump">'
		h+='<div class="card-left">'
			h+='<div class="left-img is-err"><img class="is-nor" src="./images/pump_nor.png"><img class="is-err" src="./images/pump_err.png"></div>'
			h+='<div class="left-name">水泵浦</div>'
		h+='</div>'
		h+='<div class="card-right">'
			data.forEach(function(item, i){
				h+='<div class="right-item">'
				h+='<div class="right-name">'+item.machine+'：</div>'
				h+='<div class="right-color" data-status="'+item.status+'" style="background-color: #9B9BEA">'+item.frequency+'</div>'
				h+='<div class="right-btn">詳細</div>'
				h+='</div>' // item
			});
		h+='</div>'
	h+='</div>' // chill 1/3
	return h
};

const fnHtmlFan = function(data){
	// console.log('fan ', data);
	let h = '';
	h+='<div class="card-item" data-type="fan">'
		h+='<div class="card-left">'
			h+='<div class="left-img is-err"><img class="is-nor" src="./images/fan_nor.png"><img class="is-err" src="./images/fan_err.png"></div>'
			h+='<div class="left-name">水塔風扇</div>'
		h+='</div>'
		h+='<div class="card-right">'
			data.forEach(function(item, i){
				h+='<div class="right-item">'
				h+='<div class="right-name">'+item.machine+'：</div>'
				h+='<div class="right-color" data-status="'+item.status+'" style="background-color: #4B4BEA">'+item.frequency+'</div>'
				h+='<div class="right-btn">詳細</div>'
				h+='</div>' // item
			});
		h+='</div>'
	h+='</div>' // pump 2/3
	return h
};

const fnHtmlPipe = function(data){
	console.log('pipe ', data);
	let h = '';
	h+='<div class="card-item" data-type="pipe">'
		h+='<div class="card-left">'
			h+='<div class="left-img is-err"><img class="is-nor" src="./images/pipe_nor.png"><img class="is-err" src="./images/pipe_err.png"></div>'
			h+='<div class="left-name">水溫/水壓</div>'
		h+='</div>'
		h+='<div class="pipe"> '
			h+='<div class="pipe-box">'
				h+='<div class="pipe-item">'
					h+='<div class="pipe-name">回水溫：</div>'
					h+='<div class="pipe-num">'+data.in+'</div>'
				h+='</div>'
				h+='<div class="pipe-item">'
					h+='<div class="pipe-name">出水溫：</div>'
					h+='<div class="pipe-num" data-status="'+data.out.status+'" style="background-color: #8CC63F">'+data.out.value+'</div>'
				h+='</div>'
				h+='<div class="pipe-item">'
					h+='<div class="pipe-name">水壓差：</div>'
					h+='<div class="pipe-num" data-status="'+data.p.status+'" style="background-color: #C1272D">'+data.p.value+'</div>'
				h+='</div>'
			h+='</div>'
			h+='<div class="pipe-board">'
				const deg = Math.round( 180 * ( data.p.value / 2 ) / 10 ) * 10;
				h+='<div class="pipe-guide" style="transform: rotate('+deg+'deg)"></div>'
			h+='</div>'
		h+='</div>'
	h+='</div>' // pipe 3/3
	return h
}

$(()=>{
	console.log('got single_pump.js');
	$.ajax({
		url: './data/build01/pump/main_'+ii+'.json',
		type: 'GET',
		dataType: 'json',
		success(res){
			dataMain = res;
			let h = '<div id="mb-btn">省電詳細</div>';
			dataMain.group.forEach(function(item, i){
				h+='<div class="block">'
					h+=fnHtmlTitle(item.switch, item.show_name);
					h+='<div class="card">'
						h+=fnHtmlPump(item.cwp);
						h+=fnHtmlFan(item.fan);
						h+=fnHtmlPipe(item.pipe);
					h+='</div>' // card
				h+='</div>' // block
			});
			$('#wrapper-single').html(h);
		}
	})
});