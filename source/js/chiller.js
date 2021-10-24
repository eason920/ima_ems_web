let dataColor = new Object;
let dataMain = new Object;
let sum = {
	total: 0,
	s0: 0, // 0 沒有住戶
	s1: 0, // 1 關機正常
	s2: 0, // 2 開機正常
	s3: 0, // 3 開機異常
	s4: 0, // 4 關機異常
	s5: 0,  // 5 斷訊
	// firstTime: true
};

const apiPrifix= 'https://dash.ima-ems.com/'
const color_nor= 'rgba(16,44,64,.92)'
const color_err = 'rgba(147,26,49,.92)';
const bg_nor = [color_nor,color_nor,color_nor,color_nor,color_nor,color_nor,color_nor];
const bg_err = [color_err,color_err,color_err,color_err,color_err,color_err,color_err];

const nua = navigator.userAgent;
const isMobile = /iphone | ipad | android/i.test(nua);

const build_id = location.href.split('?build_id=')[1].split('&')[0];

const switchControl = {
	"mb": {
		c2o(){ 
			$('#lb, #lb-masker').show() },
		o2c(){ 
			$('#lb, #lb-masker').hide() }
	},
	"pc": {
		c2o(){
			setTimeout(()=>{
				switchControl.height = $('#lb-content').innerHeight() + 2;
				$('#content').css({maxHeight: 'calc(100vh - ' + switchControl.height +'px)', minHeight: 'auto'}).addClass('lb-open');
			}, 100);
		},
		o2c(){
			$('#content').removeAttr('style').removeClass('lb-open');
		}
	},
	heitht: 0,
	c2o(){ $('#lb').attr('data-open', 'true').css('transform', 'none') },
	o2c(){ $('#lb').attr('data-open', 'false').removeAttr('style') }
};

const API = {
	main: apiPrifix + 'api/single_chiller/build_id=' + build_id,
	color: apiPrifix + 'api/single_chiller/chiller_setting/build_id=' + build_id
};

console.log('api.main is', API.main);
console.log('api color is ', API.color);
// ----------------------------
const fnChart = function(id, data, labels, backgroundColor){
	const ctx = document.getElementById(id).getContext('2d');
	new Chart(ctx, {
		type: 'bar',
		data: {
			labels,
			datasets: [{
				data,
				backgroundColor,
				borderWidth: 1
			}]
		},
		options: {
			legend: {
				display: false
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}],
				xAxes: [{
					gridLines: {
						display: false // 橫軸 hide
					}
				}]
			},
			animation: {
				duration: 0
			}
		}
	});
};

let lbObj = {
	openedId: 'start',
	times: 0,
	sid: '',
	floor: 0,
	show: 0,
	number: 0
};

const fnCanvas = function(number, floor, show){
	// floor = floor.replace('f', '');
	// const cjj = lbObj.times % 4 + 1;
	// const url = './data/'+build_id+'/chill/house/' + number + '_' + floor + '_'+cjj+'.json';
	const url = apiPrifix + 'api/single_chiller/chiller_house/build_id='+ build_id +'/number=' + number + '/floor=' + floor.replace('f', '');
	// https://dash.ima-ems.com/api/single_chiller/chiller_house/build_id=01/number=32/floor=f1
	// api/single_chiller/chiller_house/build_id=<string:build_id>/number=<string:number>/floor=<string:floor>
	console.log('canvas api is ', url);
	$.ajax({
		url,
		type: 'GET',
		dataType: 'json',
		success: function(res){
			$('#lb-subtitle span').text( floor.replace('f', '') + '-' + show );
			fnChart('cv-1', res.normal, res.label, bg_nor);
			fnChart('cv-2', res.alarm, res.label, bg_err);
			lbObj.times ++;
		}
	})
};

const fnCanvasActive = function(number, floor, show){
	// 一次性 v
	fnCanvas(number, floor, show);

	// 多次性
	lbObj.sid = setInterval(function(){
		fnCanvas(number, floor, show);
	}, dataMain.update * 1000 );
}

const fnRenderBuild = function(data){
	let html = '';
	let status4 = '';
	let status3 = '';
	html += '<div class="build-row">';
	html += '<div class="build-floor"></div>';
	html += '<div class="build-house">';
	data.house.show_name.forEach(function(item, i){
		html += '<div class="build-item" title="門牌' + data.house.value[i] + '號">';
		html += item;
		html += '</div>';// .build-item
	});
	html += '</div>'// .build-house
	html += '</div>'// .build-row
	for( f in data.status ){
		let wf = f;
		if( /f/i.test(f) ){ wf= wf.replace('f', '') }
		html += '<div class="build-row">';
		html += '<div class="build-floor">' + wf + '</div>';
		html += '<div class="build-house">';
		data.status[f].forEach(function(v, i){
			const info = wf + '-' + data.house.show_name[i];
			let code = '';
			dataColor.forEach(function(jtem, j){
				if( jtem.status == v ){
					code = jtem.color
				}
			});
			html += '<div class="build-item" '
			html += 'data-floor="' + f + '" '
			html += 'data-number="' + data.house.value[i] + '" ';
			html += 'data-show="' + data.house.show_name[i] + '" ';
			html += 'title="' + info + '" ';
			html += 'data-status="' + v + '" ';
			html += 'style="background-color:' + code + '">';
			html += '</div>';// .build-item

			// 異常冰機列表 v
			const statusHtml = function(num){
				let codeHtml = '';
				if( v == num ){
					codeHtml += '';
					codeHtml += '<div class="rbox-error-item">'
					codeHtml += '<div class="rbox-error-txt">' + info + '</div>'
					codeHtml += '<div class="rbox-error-btn" ';
					codeHtml += 'data-floor="' + f + '" '
					codeHtml += 'data-number="' + data.house.value[i] + '" ';
					codeHtml += 'data-show="' + data.house.show_name[i] + '" ';
					codeHtml += 'title="' + info + '" ';
					codeHtml += '>詳細</div>'
					codeHtml += '</div>'
				};
				return codeHtml;
			};
			status4 += statusHtml(4);
			status3 += statusHtml(3);
			
			// sum v
			switch(v){
				case 0: sum.s0 ++; break;
				case 1: sum.s1 ++; break;
				case 2: sum.s2 ++; break;
				case 3: sum.s3 ++; break;
				case 4: sum.s4 ++; break;
				case 5: sum.s5 ++; break;
				default:
			};
			sum.total ++;
		});
		html += '</div>'// .build-house
		html += '</div>'// .build-row
	}
	$('#build').html(html);
	if( status3 == '' ){ status3 = '(無開機異常)'}
	if( status4 == '' ){ status4 = '(無關機異常)'}
	$('.errbox[data-status=4] .rbox-error').html(status4);
	$('.errbox[data-status=3] .rbox-error').html(status3);
};

const fnIntervalBuild = function(){
	let ii = 0;
	setInterval(function(){
		ii ++;
		// const jj = ii%4+1;
		// const url ='./data/'+build_id+'/chill/main_'+jj+'.json';
		const url = API.main;
		// const url ='./data/build01/chill/main.json';
		$.ajax({
			type: 'GET',
			url,
			dataType: 'json',
			success: function(res){
				dataMain = res;
				fnTime(dataMain.data_time);
				$('.rbox-psyitem.is-dry span').text(dataMain.physical.dry);
				$('.rbox-psyitem.is-wet span').text(dataMain.physical.wet);
				
				// init v
				sum = {
					total: 0,
					s0: 0, // 0 沒有住戶
					s1: 0, // 1 關機正常
					s2: 0, // 2 開機正常
					s3: 0, // 3 開機異常
					s4: 0, // 4 關機異常
					s5: 0,  // 5 斷訊
				};

				fnRenderBuild(dataMain); // < 需要計數的都往此 fn 下方寫
				//-
				$('.is-chill-total').text(sum.total - sum.s0);
				$('.is-chill-err-total').text(sum.s3 + sum.s4);
				
				// 右上 v
				for(i=0;i<=5;i++){
					const sumTarget = 's' + i;
					$('.rbox-status-item:eq('+i+') .rbox-status-num').text(sum[sumTarget]);
				}
				// console.log(jj, sum);
			}
		});
				
	}, 1000 * dataMain.update );
	// }, 1000 * 10 );
};

$(()=>{
	// ----------------------------
	// NAV STATUS ITEM v
	// ----------------------------
	$.ajax({
		type: 'GET',
		url: API.color,
		dataType: 'json',
		success: function(res){
			// console.log(res.color);
			// console.log(res.color.chiller.splice(0, 6) );
			dataColor = res.color.chiller.splice(0,6);

			// ----------------------------
			// BUILD v
			// ----------------------------
			$.ajax({
				type: 'GET',
				url: API.main,
				dataType: 'json',
				success: function(res){
					// console.log( res.status);
					// for( a in res.status ){
					// 	const floor = Number(a.replace('f', ''))
					// 	console.log(floor);
					// }

					dataMain = res;

					// structure v
					$('#location span').text(dataMain.build);
					$('.rbox-psyitem.is-dry span').text(dataMain.physical.dry);
					$('.rbox-psyitem.is-wet span').text(dataMain.physical.wet);
					fnRenderBuild(dataMain); // < 需要計數的都往此 fn 下方寫
					//-
					$('.is-chill-total').text(sum.total - sum.s0);
					$('.is-chill-err-total').text(sum.s3 + sum.s4);
					
					// time v
					fnTime(dataMain.data_time);

					// MINICOLORS SETTINGS v
					fnRenderColor(dataColor);
					setingMinicolor();
					
					// interval v
					fnIntervalBuild();

					// UI v
					// const errH0 = $('#left').innerHeight();
					// const errH1 = $('.right-title').outerHeight(true);
					// const errH2 = $('.rbox-top.is-psy').innerHeight();
					// const errH3 = $('.rbox.is-status').height();
					// const errH4 = $('.rbox-sum').height();
					// const errH = 'calc(' + errH0 + 'px - ' + errH1 * 2 + 'px - ' + errH2 + 'px - ' + errH3 +'px - ' + errH4 + 'px)';
					// console.log(errH, 'errh');
					// $('.rbox-top.is-err').css('height', errH)
				}
			});
		}
	});

	$('.navlabel-item[data-unit="pump"]').attr('href', 'single_pump.html?build_id=' + build_id);

	// ----------------------------
	// CHART v
	// ----------------------------
	Chart.plugins.register({
		afterDatasetsDraw: function(chartInstance, easing) {
			// To only draw at the end of animation, check for easing === 1
			var ctx = chartInstance.chart.ctx;
			// console.log(chartInstance.chart);
			chartInstance.data.datasets.forEach(function(dataset, i) {
				var meta = chartInstance.getDatasetMeta(i);
				if (!meta.hidden ) {
					meta.data.forEach(function(element, index) {
						// console.log(element._chart);
						// Draw the text in black, with the specified font
						// nor > err
						const area = meta.data[index]._chart.config.data.datasets[0].backgroundColor[0] == color_nor ? 40 : 20
						// less > more
						let padding = 5;
						let color = '#000';
						if( dataset.data[index].toString() > area ){
							padding = -20;
							color = '#fff';
						}
						// const padding =  ? -20 : 5;
						ctx.fillStyle = color;
						var fontSize = 13;
						var fontStyle = 'normal';
						var fontFamily = 'Helvetica Neue';
						ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
						// Just naively convert to string for now
						var dataString = dataset.data[index].toString();
						// Make sure alignment settings are correct
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						var position = element.tooltipPosition();
						// if( dataset.data[index].toString() != 0 ){
							
							ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
						// }
					});
				}
			});
		}
	});

	// ----------------------------
	// LB v
	// ----------------------------


	$('#lb-cbox').click(function(){
		if( $('#lb-subtitle span').text() !== '' ){
			// 不是第一次進場 / canvas 己繪製
			clearInterval(lbObj.sid);
			const open = $('#lb').attr('data-open');
			if( open == 'false'){
				// c2o
				if( isMobile ){
					switchControl.c2o();
					switchControl.mb.c2o();
				}else{
					switchControl.c2o();
					switchControl.pc.c2o();
				};

				// ----------------------------
				fnCanvasActive(lbObj.number, lbObj.floor, lbObj.show);

			}else{
				// o2c
				lbObj.openedId = 'reset';
				if( isMobile ){
					switchControl.o2c();
					switchControl.mb.o2c();
				}else{
					switchControl.o2c();
					switchControl.pc.o2c();
				};
			};
		}else{
			alert('請點擊指定住戶以察看詳細');
		};
	});

	$('body').on('click', '.build-item, .rbox-error-btn', function(){
		lbObj.floor = $(this).attr('data-floor');
		lbObj.show = $(this).attr('data-show');
		if( lbObj.openedId != lbObj.floor + lbObj.show ){
			clearInterval(lbObj.sid);
			lbObj.openedId = lbObj.floor + lbObj.show;
			console.log('different btn');
			const status = $(this).attr('data-status');
			if( status != 0 ){
				// 非空戶 v
				if( isMobile ){
					switchControl.c2o();
					switchControl.mb.c2o();
				}else{
					switchControl.c2o();
					switchControl.pc.c2o();
				};

				// ----------------------------
				lbObj.number = $(this).attr('data-number');
				fnCanvasActive(lbObj.number, lbObj.floor, lbObj.show);

			}else{
				// 空戶，不作用 v
				if( isMobile ){
					switchControl.o2c();
					switchControl.mb.o2c();
				}else{
					switchControl.o2c();
					switchControl.pc.o2c();
				};
			}
		}else{
			console.log('same btn');
		}
	});

	$('.build-house').click(function(){
		if( isMobile ){
			$('#lb, #lb-masker').hide();
		}else{
			$('#lb').attr('data-status', 1).removeAttr('style');
		}
	});

	// ---------------------------- 
	// HAMBER v
	// ----------------------------
	if( isMobile ){
		$('#hamber').click(function(){
			$(this).toggleClass('is-open');
			$('#mbbox, #nav-masker').toggle();
		});
	}

	// --------------------------------
	// -- 0920 check api
	// --------------------------------
	// $('.sys-btn').click(function(){
	$('.sys-btn696969').click(function(){
		console.log('got');
		// const url = apiPrifix + 'api/user/login';
		const url = 'https://dash.ima-ems.com/api/user/login';
		const email = $('#loginAcc').val();
		const password = $('#loginPW').val();
		// const data = {
		// 	email,
		// 	password
		// }
		const data = JSON.stringify({email,password});
		console.log('api is ', url);
		console.log('send data is ', data);
		$.ajax({
			type: 'POST',
			url,
			data,
			contentType: 'application/json',
			dataType: 'json',
			success: function(res){
				console.log(res);
				// $.ajax({
				// 	type: 'GET',
				// 	url: 'https://dash.ima-ems.com/api/single_chiller/build_id=01',
				// 	dataType: 'json',
				// 	success(res){
				// 		console.log('build single 01 is', res);
				// 	},
				// 	error(err){
				// 		console.log('err is ', err);
				// 	}
				// });
			},
			error: function(err){
				console.log(err);
			}
		});

		// $.ajax({
		// 	type:"POST",
		// 	url:"./2020/api/Wschedule.asp",
		// 	data:{
		// 		dt_id: viewWeekId
		// 	},
		// 	dataType:"json",
	})
	
	// $('body').on('click', '.sys-title', function(){
	$('.sys-title').click(function(){
		console.log('got sys-title 2');
		// $.ajax({
		// 	type: 'POST',
		// 	url: 'https://dash.ima-ems.com/api/single_chiller/build_id=01',
		// 	contentType: 'application/json',
		// 	dataType: 'json',
		// 	success(res){
		// 		console.log('build single 01 is', res);
		// 	},
		// 	error(err){
		// 		console.log(err);
		// 	}
		// });
		// 401
		$.ajax({
			type: 'GET',
			url: 'https://dash.ima-ems.com/api/single_chiller/build_id=01',
			dataType: 'json',
			success(res){
				console.log('build single 01 is', res);
			},
			error(err){
				console.log('err is ', err);
			}
		});
	})
})

//https://dash.ima-ems.com/api/single_chiller/build_id=01



// https://dash.ima-ems.com/
// testuser@ima-ems.com
// ima42838254

// https://dash.ima-ems.com/api/user/login
// https://dash.ima-ems.com/api/user/login
