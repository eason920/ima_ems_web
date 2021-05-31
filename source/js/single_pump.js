const nua = navigator.userAgent;

const scales_m = {
	yAxes: [{
		// display: false,
		ticks: {
			stepSize: 10,
			min: 0
		},
		gridLines: {
			// display: false
		},
	}],
	xAxes: [{
		// display: false,
		ticks: {
			maxTicksLimit: 6.1 // 0.1用以去除抓到非整點的時間
		},
		gridLines: {
			display: false
		},
	}]
};

const scales = {
	yAxes: [{
		display: false,
		ticks: {
			stepSize: 10,
			min: 0
		}
	}],
	xAxes: [{
		display: false,
		ticks: {
			maxTicksLimit: 6.1 // 0.1用以去除抓到非整點的時間
		}
	}]
};

const labels = [];
const m = [0, 15, 30, 45];
for( i=0;i<24;i++ ){
	m.forEach(function(m){
		if(String(i).length < 2){ i = '0' + i};
		if(String(m).length < 2){ m = '0' + m};
		labels.push( i + ':' + m );
	});
};

const fnRander = function(target, scales) {
	var ctx = document.getElementById(target);
	if( /iphone | ipad | android/i.test(nua) ){
		ctx.width = 20;  // w & h 兩值應一起看，結果實益是寬高比例 
		ctx.height = 15; // w & h 兩值應一起看，結果實益是寬高比例
	}
	new Chart(ctx, {
		type: 'line',
		data: {
			labels,
			datasets: [{
				// data: [
				//   0,0,0,0,0,0,0,0,0,0,0,0,
				//   0,0,0,0,0,0,0,0,0,0,0,0,
				//   51, 35, 32, 45, 37, 30, 51, 35
				// ],
				data: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					31, 35, 32, 45, 37, 30, 31, 35, 32, 30, 31, 35, 32,
					45, 37, 30, 31, 35, 32, 45, 55, 30, 30, 31, 35, 32,
					// 40, 37, 33, 35, 35, 35, 47, 35
				],
				// backgroundColor: 'rgba(54, 162, 235, .8)',
				// borderColor: 'rgba(0,0,0, 1)',
				pointBackgroundColor: 'transparent',
				pointBorderColor: 'transparent',
				pointHoverBackgroundColor: 'transparent',
				backgroundColor: 'rgba(16,44,64,.85)',
				// borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1
			}],
		},
		options: {
			scales,
			legend: { // AREA : 上方導引色塊
				display: false
			},
			tooltips: { // AREA : 在點上 mouseover 出的報告小視窗
				// enabled: false, // 是否要運作
				caretPadding: 10, // 與 point 的距離
				displayColors: false, // 小色塊顯示
			}
		}
	});
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

$(()=>{
	$.ajax({
		type: 'GET',
		url: './data/build01/pump/main_1.json',
		dataType: 'json',
		success: function(res){
			console.log(res);
			fnTime(res.data_time);

			setingMinicolor();
		}
	});

	if( /iphone | ipad | android/i.test(nua) ){
		console.log('mb');
		for(i=1;i<=3;i++){
			fnRander('c'+i, scales_m);
			fnRander('w'+i, scales_m);
		};
	}else{
		console.log('pc');
		for(i=1;i<=3;i++){
			fnRander('c'+i, scales);
			fnRander('w'+i, scales);
		};
	}
	
	fnRander('m', scales_m);
	// ----------------------------
	// ----------------------------
	// ----------------------------
	$('#lb-cbox, #mb-btn').click(function(){
		console.log(nua);
		if( /iphone | ipad | android/i.test(nua) ){
			$('#lb, #lb-masker').show();
			$('body').addClass('is-open')
		}else{
			$('#lb').css('transform', 'none');
		}
	});
	// $('#lb-cbox').click(); //<<<<<<

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