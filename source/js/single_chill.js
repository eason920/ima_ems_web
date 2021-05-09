const labels= ['5/1','5/2','5/3','5/4','5/5','5/6','5/7'];

// const color_nor = '#102c40';
const color_nor= 'rgba(16,44,64,.92)'
// const color_err = '#5f363e';
const color_err = 'rgba(147,26,49,.92)';

const bg_nor = [
	color_nor,
	color_nor,
	color_nor,
	color_nor,
	color_nor,
	color_nor,
	color_nor
];
const data_nor = [600, 570, 600, 550, 600, 300, 40]
const bg_err = [
	color_err,
	color_err,
	color_err,
	color_err,
	color_err,
	color_err,
	color_err
];
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
}

$(()=>{
	
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

	$('#lb-cbox').click(function(){
		console.log(nua);
		if( /iphone | ipad | android/i.test(nua) ){
			$('#lb, #lb-masker').hide();
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