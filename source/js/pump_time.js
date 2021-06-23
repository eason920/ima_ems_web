const fnUpdateMotor = function(from, group, data){
	const middler = dataCT.threshold.motor[0];
	const heighter = dataCT.threshold.motor[1];
	data.forEach(function(item, i){
		let status = item.status;
		const value = item.frequency;
		let checkPicStatus = false;
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
		$('.block:eq('+group+') .card-item[data-type="'+from+'"] .right-item:eq('+i+') .right-color').attr('data-status', status).css({backgroundColor}).text(value);
	});



};

$(()=>{
	console.log('aaa');

	$('.logo-title').click(function(){
		ii = ii == 1 ? 2 : 1;
		console.log('ii is ', ii);
		$.ajax({
			url: './data/build01/pump/main_'+ii+'.json',
			type: 'GET',
			dataType: 'json',
			success(res){
				dataMain = res;
				// console.log(dataMain.group);
				for(i=0;i<dataMain.group.length;i++){
					fnUpdateMotor('cwp', i, dataMain.group[i].cwp);
					fnUpdateMotor('fan', i, dataMain.group[i].fan);
				}
			}
		})
	})
})