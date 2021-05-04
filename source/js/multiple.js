const nua = navigator.userAgent;

const labels = [];
const m = [0, 15, 30, 45];
for( i=0;i<24;i++ ){
	m.forEach(function(m){
		if(String(i).length < 2){ i = '0' + i};
		if(String(m).length < 2){ m = '0' + m};
		labels.push( i + ':' + m );
	});
};

const fnRander = function(target) {
	var ctx = document.getElementById(target);
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
				backgroundColor: 'rgba(54, 162, 235, 0.2)',
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1
			}],
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						stepSize: 10,
						min: 0
					}
				}],
				xAxes: [{
					ticks: {
						maxTicksLimit: 6.1 // 0.1用以去除抓到非整點的時間
					}
				}]
			},
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
}

$(()=>{
	// for(i=1;i<=3;i++){
	// 	fnRander('c'+i);
	// 	fnRander('w'+i);
	// };
	// fnRander('m');
	// ----------------------------
	// ----------------------------
	// ----------------------------
	$('#lb-cbox').click(function(){
		console.log(nua);
		if( /iphone | ipad | android/i.test(nua) ){
			$('#lb, #lb-masker').hide();
			$('body').removeClass('is-open')
		}else{
			const bottom = $('#lb-content').outerHeight(true) * -1;
			$('#lb').css({bottom});
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