const nowChart = {
	bindex: 0,
	gindex: 0,
	data: new Object,
	dataCwp: new Array,
	dataFan: new Array,
	main: 'cwp'
};

let lbObj = {
	openedId: 'start'
}

let chartMain;

const scales_m = {
	yAxes: [{
		// display: false,
		ticks: {
			stepSize: 10,
			max: 60, // 使「原始耗電」可定位 *
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
			max: 60,
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

const fnRander = function(target, scales, data) {
	var ctx = document.getElementById(target);
	if( isMobile ){
		ctx.width = 20;  // w & h 兩值應一起看，結果實益是寬高比例 
		ctx.height = 15; // w & h 兩值應一起看，結果實益是寬高比例
	}

	let datasets = [];
	if( target == 'main'){
		datasets = [{
			data,
			pointBackgroundColor: '#fff',
			pointBorderColor: '#000',
			// ^ differents
			pointHoverBackgroundColor: 'transparent',
			backgroundColor: 'rgba(16,44,64,.85)',
			borderWidth: 1
		}]
	}else{
		datasets = [{
			data,
			pointBackgroundColor: 'transparent',
			pointBorderColor: 'transparent',
			// ^ differents
			pointHoverBackgroundColor: 'transparent',
			backgroundColor: 'rgba(16,44,64,.85)',
			borderWidth: 1
		}]
	};
	
	const obj = {
		type: 'line',
		data: {
			labels,
			datasets
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
			},
			animation: {
				duration: 0
			}
		}
	};

	if( target != 'main'){
		new Chart(ctx, obj);
	}else{
		console.log('is #main');
		if( chartMain != undefined ){
			chartMain.destroy();
		}
		chartMain = new Chart(ctx, obj);
	}
	
};

const fnRanderAll = function(){
	const scaleSetting = isMobile ? scales_m : scales;
	for(i=0;i<nowChart.dataCwp.length;i++){
		fnRander('cwp'+i, scaleSetting, nowChart.dataCwp[i].chart.data);
	};
	for(i=0;i<nowChart.dataFan.length;i++){
		fnRander('fan'+i, scaleSetting, nowChart.dataFan[i].chart.data);
	};
	if( !isMobile ){
		const data = nowChart.main == 'cwp' ? nowChart.dataCwp : nowChart.dataFan;
		// --
		fnRander('main', scales_m, data[nowChart.gindex].chart.data);
		// fnRander('main', scales_m, nowChart.dataCwp[0].chart.data);
	};
};

const fnCItemHtml = function(from, data){
	let h = '';
	for( i=0; i< data.length; i++ ){
		h+='<div class="c-item" data-from="'+from+'" data-gindex="'+i+'">'
			h+='<div class="c-mc">'
				h+='<div class="c-machine">'
				h+='30HP01<span>原始耗電：47 KW</span></div>'
				h+='<div class="c-c">'
				h+='<div class="c-box">'
					h+='<div class="c-limit"></div>'
					h+='<canvas id="'+from+i+'"></canvas>'
				h+='</div>'
				h+='</div>'
			h+='</div>'
			h+='<div class="c-msg">'
				h+='<div class="c-msg-item">耗電 <span>30</span>KW</div>'
				h+='<div class="c-msg-item">節能 <span>11.25</span>KWh</div>'
			h+='</div>'
		h+='</div>' // item
	}
	return h;
}

const switchControl = {
	"mb": {
		c2o(){ 
			$('#lb, #lb-masker').show() },
		o2c(){ 
			$('#lb, #lb-masker').hide() }
	},
	"pc": {
		c2o(){
			// setTimeout(()=>{
			// 	switchControl.height = $('#lb-content').innerHeight() + 2;
			// 	$('#content').css({maxHeight: 'calc(100vh - ' + switchControl.height +'px)', minHeight: 'auto'}).addClass('lb-open');
			// }, 100);
		},
		o2c(){
			// $('#content').removeAttr('style').removeClass('lb-open');
		}
	},
	height: 0,
	c2o(){ $('#lb').attr('data-open', 'true').css('transform', 'none') },
	o2c(){ $('#lb').attr('data-open', 'false').removeAttr('style') }
};

$(()=>{
	// 各 group btn v
	$('body').on('click', '.col-row[data-for="lb"]', function(){
		nowChart.bindex = $(this).attr('data-build-index');
		nowChart.gindex = $(this).attr('data-group-index');
		nowChart.data = dataMain.data[nowChart.bindex];
		nowChart.dataCwp = nowChart.data.group[nowChart.gindex].cwp;
		nowChart.dataFan = nowChart.data.group[nowChart.gindex].fan;
		const thisOpenedId = nowChart.bindex + nowChart.gindex;

		if( thisOpenedId != lbObj.openedId ){
			lbObj.openedId = thisOpenedId;
			// ----------------------------
			// HTML v
			// ----------------------------
			if( $('#lb').attr('data-open') == 'false' ){
				$('.c-box#for-cwp, .c-box#for-fan').html('');
				$('.c-box#for-cwp').html(fnCItemHtml('cwp',nowChart.dataCwp));
				$('.c-box#for-fan').html(fnCItemHtml('fan',nowChart.dataFan));
			};

			// ----------------------------
			// CHART v
			// ----------------------------
			fnRanderAll();

			// ----------------------------
			// LB OPEN v
			// ----------------------------
			if( isMobile ){
				$('#lb, #lb-masker').show();
				$('body').addClass('is-open')
			}else{
				$('#lb').css('transform', 'none');
			};
			$('#lb').attr('data-open', 'true');
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
		}

		
	});

	// lb ^ 鈕 v
	$('#lb-cbox').click(function(){
		if( $('#lb-subtitle span').text() !== '' ){
			// 不是第一次進場 / canvas 己繪製
			// clearInterval(lbObj.sid);
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
				// fnCanvasActive(lbObj.number, lbObj.floor, lbObj.show);

			}else{
				// o2c
				// lbObj.openedId = 'reset';
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

	// ----------------------------
	// 左側小 CANVAS (.c-item) v
	// ----------------------------
	if( !isMobile ){
		$('body').on('click', '.c-item', function(){
			nowChart.main = $(this).attr('data-from');
			nowChart.gindex = $(this).attr('data-gindex');
			const data = nowChart.main == 'cwp' ? nowChart.dataCwp : nowChart.dataFan;
			// --
			fnRander('main', scales_m, data[nowChart.gindex].chart.data);
		})
	};
});