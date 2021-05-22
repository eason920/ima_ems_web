let colorObj = new Object;
let ChillObj = new Object;
let sum = {
	total: 0,
	s0: 0, // 0 沒有住戶
	s1: 0, // 1 關機正常
	s2: 0, // 2 開機正常
	s3: 0, // 3 開機異常
	s4: 0, // 4 關機異常
	s5: 0,  // 5 斷訊
	firstTime: true
};

const color_nor= 'rgba(16,44,64,.92)'
const color_err = 'rgba(147,26,49,.92)';
const bg_nor = [color_nor,color_nor,color_nor,color_nor,color_nor,color_nor,color_nor];
const bg_err = [color_err,color_err,color_err,color_err,color_err,color_err,color_err];

const nua = navigator.userAgent;
const isMobile = /iphone | ipad | android/i.test(nua);

const build_id = location.href.split('?build_id=')[1];

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
			}
		}
	});
};

const fnCanvas = function(number, floor, show){
	// floor = floor.replace('f', '');
	const url = './data/'+build_id+'/chill/house/' + number + '_' + floor + '.json';
	$.ajax({
		url,
		type: 'GET',
		dataType: 'json',
		success: function(res){
			$('#lb-subtitle span').text( floor.replace('f', '') + '-' + show );
			fnChart('cv-1', res.normal, res.label, bg_nor);
			fnChart('cv-2', res.alarm, res.label, bg_err);
		}
	})
};

// ----------------------------
// NAV COLOR ITEM v
// ----------------------------
const fnRenderColor = function(data){
	let nav = ''; // NAV 演示用色
	let fix = ''; // 調整用色 SYS LB
	let total = ''; // 冰機狀態統計(右上)

	data.forEach(function(item){
		nav += '<div class="status-item" data-status="' + item.status + '">';
		nav += '<div class="status-color" style="background-color:' + item.color + '"></div>';
		nav += '<div class="status-txt">' + item.name + '</div>';
		nav += '</div>'

		// ----------------------------
		const sumTarget = 's' + item.status;
		fix += '<div class="sys-citem" data-status="' + item.status + '">';
		fix += '<div class="sys-ctxt">' + item.name + '</div>';
		fix += '<div class="sys-sbtn">修改</div>'
		fix += '<input class="minicolors-item" type="text" data-control="wheel" value="' + item.color + '">'
		fix += '</div>';

		// ----------------------------
		total += '<div class="rbox-status-item">'
		total += '<div class="rbox-status-color" data-status="' + item.status + '" style="background-color:' + item.color + '"></div>'
		total += '<div class="rbox-status-info">'
		total += '<div class="rbox-status-num">'+ sum[sumTarget] +'</div>'
		total += '<div class="rbox-status-txt">' + item.name + '</div>'
		total += '</div>'
		total += '</div>'
	});

	$('.status-chill').html(nav); // NAV
	$('.sys-cbox').html(fix);// 改色 LB
	$('.rbox-status.is-total').html(total); // 右中
	// 異常冰機列表 v
	for(i=3;i<=4;i++){
		$('.errbox[data-status="'+i+'"]').find('.rbox-status-color').css('background-color', data[i].color);
		$('.errbox[data-status="'+i+'"] span').text(data[i].name);
	};
};

const setingMinicolor = function(){
	$('.minicolors-item').each( function() {
		$(this).minicolors({
			control: $(this).attr('data-control') || 'hue',
			defaultValue: $(this).attr('data-defaultValue') || '',
			format: $(this).attr('data-format') || 'hex',
			keywords: $(this).attr('data-keywords') || '',
			inline: $(this).attr('data-inline') === 'true',
			letterCase: $(this).attr('data-letterCase') || 'lowercase',
			opacity: $(this).attr('data-opacity'),
			position: $(this).attr('data-position') || 'bottom',
			swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
			change: function(value, opacity) {
				if( !value ) return;
				if( opacity ) value += ', ' + opacity;
				// if( typeof console === 'object' ) {
				// 	console.log(value);
				// }
			}
		});
	});
};

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
			colorObj.forEach(function(jtem, j){
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

			if( sum.firstTime ){
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
			};
		});
		html += '</div>'// .build-house
		html += '</div>'// .build-row
	}
	$('#build').html(html);
	if( sum.firstTime ){
		$('.errbox[data-status=4] .rbox-error').html(status4);
		$('.errbox[data-status=3] .rbox-error').html(status3);
	};
};

$(()=>{
	// ----------------------------
	// NAV STATUS ITEM v
	// ----------------------------
	$.ajax({
		type: 'GET',
		url: './data/'+build_id+'/chill/color.json',
		dataType: 'json',
		success: function(res){
			colorObj = res.chiller;

			// ----------------------------
			// BUILD v
			// ----------------------------
			$.ajax({
				type: 'GET',
				url: './data/'+build_id+'/chill/main.json',
				dataType: 'json',
				success: function(res){
					chillObj = res;
					$('#location span').text(chillObj.build);
					$('.rbox-psyitem.is-dry span').text(chillObj.psy.dry);
					$('.rbox-psyitem.is-wet span').text(chillObj.psy.wet);
					fnRenderBuild(chillObj); // < 需要計數的都往此 fn 下方寫
					sum.firstTime = false;
					//-
					fnRenderColor(colorObj);
					$('.is-chill-total').text(sum.total);
					$('.is-chill-err-total').text(sum.s3 + sum.s4);

					// MINICOLORS SETTINGS v
					setingMinicolor();
				}
			});
		}
	});

	$('#updateColor').click(function(){
		colorObj = [];
		$('.sys-citem').each(function(){
			const status = $(this).attr('data-status');
			const name = $(this).find('.sys-ctxt').text();
			const color = $(this).find('.minicolors-item').val();
			console.log(status, name, color);
			colorObj.push({name, status, color});
		});
		console.log(colorObj);
		fnRenderColor(colorObj);
		setingMinicolor();
		fnRenderBuild(chillObj);
	});

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
	const switchControl = {
		"mb": {
			c2o(){ 
				$('#lb, #lb-masker').show_name() },
			o2c(){ 
				$('#lb, #lb-masker').hide() }
		},
		"pc": {
			c2o(){
				setTimeout(()=>{
					switchControl.height = $('#lb-content').innerHeight() + 2;
					$('#content').css({maxHeight: 'calc(100vh - ' + switchControl.height +'px)', minHeight: 'auto'})
				}, 100);
			},
			o2c(){
				$('#content').removeAttr('style');
			}
		},
		heitht: 0,
		c2o(){ $('#lb').attr('data-open', 'true').css('transform', 'none') },
		o2c(){ $('#lb').attr('data-open', 'false').removeAttr('style') }
	};

	$('#lb-cbox').click(function(){
		if( $('#lb-subtitle span').text() !== '' ){
			// 不是第一次進場 / canvas 己繪製
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
			}else{
				// o2c
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
			//-
			const number = $(this).attr('data-number');
			const floor = $(this).attr('data-floor');
			const show = $(this).attr('data-show');
			console.log(number, floor, status);
			fnCanvas(number, floor, show);
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
})