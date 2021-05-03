
const labels= ['5/1','5/2','5/3','5/4','5/5','5/6','5/7'];
const bg_nor = [
	'rgba(54, 162, 235, 0.2)',
	'rgba(54, 162, 235, 0.2)',
	'rgba(54, 162, 235, 0.2)',
	'rgba(54, 162, 235, 0.2)',
	'rgba(54, 162, 235, 0.2)',
	'rgba(54, 162, 235, 0.2)',
	'rgba(54, 162, 235, 0.2)'
];
const data_nor = [600, 570, 600, 550, 600, 300, 50]
const bg_err = [
	'rgba(255, 99, 132, 0.2)',
	'rgba(255, 99, 132, 0.2)',
	'rgba(255, 99, 132, 0.2)',
	'rgba(255, 99, 132, 0.2)',
	'rgba(255, 99, 132, 0.2)',
	'rgba(255, 99, 132, 0.2)',
	'rgba(255, 99, 132, 0.2)'
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
			chartInstance.data.datasets.forEach(function(dataset, i) {
				var meta = chartInstance.getDatasetMeta(i);
				if (!meta.hidden ) {
					meta.data.forEach(function(element, index) {
						// Draw the text in black, with the specified font
						ctx.fillStyle = 'grey';
						var fontSize = 16;
						var fontStyle = 'normal';
						var fontFamily = 'Helvetica Neue';
						ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
						// Just naively convert to string for now
						var dataString = dataset.data[index].toString();
						// Make sure alignment settings are correct
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						var padding = -15;
						var position = element.tooltipPosition();
						if( dataset.data[index].toString() != 0 ){
							ctx.fillText(dataString + '分', position.x, position.y - (fontSize / 2) - padding);
						}
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
})