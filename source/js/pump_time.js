const fnUpdateMotor = function(group, data, from){
	const prefix = $('.block:eq('+group+') .card-item[data-type="'+from+'"]');
	let picStatus = 'is-nor';
	let checkPicStatus = false;
	//
	const middler = dataCT.threshold.motor[0];
	const heighter = dataCT.threshold.motor[1];
	data.forEach(function(item, i){
		let status = item.status;
		const value = item.frequency;
		if( status != 8 || status != 12){
			switch(true){
				case value < middler:
					status = 9;break;
				case value >= middler && value < heighter:
					status = 10;break;
				case value >= heighter:
					status = 11;
					if( !checkPicStatus ){
						picStatus = 'is-err'
						checkPicStatus = true;
					};
					break;
				default:
			}
		};
		const index = dataCT.color.motor.findIndex( item => item.status == status );
		const backgroundColor= dataCT.color.motor[index].color;
		prefix.find('.right-item:eq('+i+') .right-color').attr('data-status', status).css({backgroundColor}).text(value);
	});
	prefix.find('.card-left .left-img').removeClass('is-nor is-err').addClass(picStatus);
};

const fnUpdatePipe = function(group, data){
	const prefix = $('.block:eq('+group+') .card-item[data-type="pipe"]');
	//-----
	const outValue = data.out.value;
	const outLimit = dataCT.threshold.pipe.out;
	const outStatus = outValue >= outLimit ? 14 : 13;
	const outIndex = dataCT.color.pipe.findIndex( item => item.status == outStatus );
	const outColor = dataCT.color.pipe[outIndex].color;
	prefix.find('.pipe-item[data-pipe="out"] .pipe-num').attr('data-status', outStatus).css('backgroundColor', outColor).text(outValue);
	//-----
	const pValue = data.p.value;
	const pLimit = dataCT.threshold.pipe.p;
	const pStatus = pValue >= pLimit ? 14 : 13;
	const pIndex = dataCT.color.pipe.findIndex( item => item.status == pStatus );
	const pColor = dataCT.color.pipe[pIndex].color;
	prefix.find('.pipe-item[data-pipe="p"] .pipe-num').attr('data-status', pStatus).css('backgroundColor', pColor).text(pValue);
	//-
	const deg = Math.round( 180 * ( pValue / 2 ) / 10 ) * 10;
	// console.log(pValue, deg);
	prefix.find('.pipe-guide').css('transform', 'rotate('+deg+'deg)');
	// prefix.find('.pipe-guide').text('aaaaa')
	//-----
	prefix.find('.left-img').removeClass('is-err is-nor')
	if(outStatus == 14 || pStatus == 14){
		prefix.find('.left-img').addClass('is-err');
	}else{
		prefix.find('.left-img').addClass('is-nor');
	}
};

const fnUpdate = function(time){
	setInterval(function(){
		ii = ii == 1 ? 2 : 1;
		// console.log('ii is ', ii);
		$.ajax({
			url: './data/build01/pump/main_'+ii+'.json',
			type: 'GET',
			dataType: 'json',
			success(res){
				dataMain = res;
				// console.log(dataMain.group);
				for(i=0;i<dataMain.group.length;i++){
					fnUpdateMotor(i, dataMain.group[i].cwp, 'cwp');
					fnUpdateMotor(i, dataMain.group[i].fan, 'fan');
					fnUpdatePipe(i, dataMain.group[i].pipe);
				}

				// ----------------------------
				if( $('#lb').attr('data-open') == 'true' ){ // LB開着才需要更新
					console.log('%cchart active', 'color:yellow');
					nowChart.dataCwp = dataMain.group[nowChart.gindex].cwp;
					nowChart.dataFan = dataMain.group[nowChart.gindex].fan;

					$('.c-box#for-cwp, .c-box#for-fan').html('');
					$('.c-box#for-cwp').html(fnCItemHtml('cwp',nowChart.dataCwp));
					$('.c-box#for-fan').html(fnCItemHtml('fan',nowChart.dataFan));

					// chart v
					fnRanderAll();
				};
			}
		})
	}, time * 1000 / 40 );
}

$(()=>{

})