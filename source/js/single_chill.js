const labels= ['5/1','5/2','5/3','5/4','5/5','5/6','5/7'];

// const color_nor = '#102c40';
const color_nor= 'rgba(16,44,64,.92)'
// const color_err = '#5f363e';
const color_err = 'rgba(147,26,49,.92)';

const bg_nor = [color_nor,color_nor,color_nor,color_nor,color_nor,color_nor,color_nor];
const data_nor = [600, 570, 600, 550, 600, 300, 40]
const bg_err = [color_err,color_err,color_err,color_err,color_err,color_err,color_err];
const data_err = [10,30,5,50,2,30,5]

const nua = navigator.userAgent;

const fnCanvas = function(id, labels, data, backgroundColor ){
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

let colorObj = new Object;
let ChillObj = new Object;
let sum = {
	total: 0,
	s0: 0, // 0 沒有住戶
	s1: 0, // 1 關機正常
	s2: 0, // 2 開機正常
	s3: 0, // 3 開機異常
	s4: 0, // 4 關機異常
	s5: 0  // 5 斷訊
};

// ----------------------------
// NAV COLOR ITEM v
// ----------------------------
const fnRenderColor = function(data){
	let nav = ''; // NAV 演示用色
	let fix = ''; // 調整用色 SYS LB

	data.forEach(function(item){
		nav += '<div class="status-item" data-status="' + item.value + '">';
		nav += '<div class="status-color" style="background-color:' + item.color + '"></div>';
		nav += '<div class="status-txt">' + item.name + '</div>';
		nav += '</div>'

		// ----------------------------
		fix += '<div class="sys-citem" data-value="' + item.value + '">';
		fix += '<div class="sys-ctxt">' + item.name + '</div>';
		fix += '<div class="sys-sbtn">修改</div>'
		fix += '<input class="minicolors-item" type="text" data-control="wheel" value="' + item.color + '">'
		fix += '</div>';
	});

	$('.status-chill').html(nav);
	$('.sys-cbox').html(fix);
}

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
	html += '<div class="build-row">';
	html += '<div class="build-floor"></div>';
	html += '<div class="build-house">';
	data.house.show.forEach(function(item, i){
		html += '<div class="build-item" title=門牌"' + data.house.number[i] + '">';
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
		data.status[f].forEach(function(v){
			let code = '';
			colorObj.forEach(function(jtem, j){
				if( jtem.value == v ){
					code = jtem.color
				}
			});
			html += '<div class="build-item "';
			html += 'data-status="' + v + '" ';
			html += 'style="background-color:' + code + '">';
			html += '</div>';// .build-item
			//
			switch(v){
				case 0: sum.s0 ++; break;
				case 1: sum.s1 ++; break;
				case 2: sum.s2 ++; break;
				case 3: sum.s3 ++; break;
				case 4: sum.s4 ++; break;
				case 5: sum.s5 ++; break;
				default:
			}
			sum.total ++;
		});
		html += '</div>'// .build-house
		html += '</div>'// .build-row
	}
	$('#build').html(html);
};

$(()=>{
	// ----------------------------
	// NAV STATUS ITEM v
	// ----------------------------
	$.ajax({
		type: 'GET',
		url: './data/chill_color.json',
		dataType: 'json',
		success: function(res){
			colorObj = res.chiller;
			fnRenderColor(colorObj);

			// ----------------------------
			// BUILD v
			// ----------------------------
			$.ajax({
				type: 'GET',
				url: './data/chill.json',
				dataType: 'json',
				success: function(res){
					chillObj = res;
					$('#location span').text(chillObj.build);
					$('.rbox-psyitem.is-dry span').text(chillObj.psy.dry);
					$('.rbox-psyitem.is-wet span').text(chillObj.psy.wet);
					fnRenderBuild(chillObj);
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
			const value = $(this).attr('data-value');
			const name = $(this).find('.sys-ctxt').text();
			const color = $(this).find('.minicolors-item').val();
			console.log(value, name, color);
			colorObj.push({name, value, color});
		});
		console.log(colorObj);
		fnRenderColor(colorObj);
		setingMinicolor();
		fnRenderBuild(chillObj);
	});

	// ----------------------------
	// CHART v
	// ----------------------------
	fnCanvas('cv-1', labels, data_nor, bg_nor);
	fnCanvas('cv-2', labels, data_err, bg_err);

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
						const area = meta.data[index]._chart.config.data.datasets[0].backgroundColor[0] == color_nor ? 40 : 4
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
	let bottom = 0;
	if( !/iphone | ipad | android/i.test(nua) ){
		bottom = $('#lb-content').outerHeight(true) * -1;
		$('#lb').css({bottom});
	}

	const part = function(){
		if( /iphone | ipad | android/i.test(nua) ){
			$('#lb, #lb-masker').hide();
		}else{
			const status = $('#lb').attr('data-status');
			if( status == 0 ){
				$('#lb').attr('data-status', 1).removeAttr('style');
			}else{
				$('#lb').attr('data-status', 0);
				$('#lb').css({bottom});
			}
		};
	}
	$('#lb-cbox, .rbox-error-btn').click(function(){ part() });
	$('#build').on('click', '.build-item', function(){ part() });

	$('.build-house').click(function(){
		if( /iphone | ipad | android/i.test(nua) ){
			$('#lb, #lb-masker').hide();
		}else{
			$('#lb').attr('data-status', 1).removeAttr('style');
		}
	});

	// ----------------------------
	// HAMBER v
	// ----------------------------
	if( /iphone | ipad | android/i.test(nua) ){
		$('#hamber').click(function(){
			$(this).toggleClass('is-open');
			$('#mbbox, #nav-masker').toggle();
		});
	}
})