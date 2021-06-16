let ii = 1;

const fnUpdateChiller = function(build, from){
	const group = dataMain.data[build].group;
	// normal item v
	group.forEach(function(item, i){
		const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq(0) .col-row:eq('+i+') span'; // 0 為正常,直控span
		const value = item[from].normal;
		//
		$(target).text(value);
	});

	// alarm item v
	const thre = dataThre[build].data[from];
	group.forEach(function(item, i){
		const status = item[from].alarm < thre? 6 : 7;
		const index = dataColor[from].findIndex( item => item.status == status );
		const color = dataColor[from][index].color;
		const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq(1) .col-row:eq('+i+')'; // 1 為異常,有兩target
		const value = item[from].alarm;
		//
		$(target).find('.col-status').attr('data-status', status).css('backgroundColor', color);
		$(target).find('span').text(value);
	});
};

const fnUpdateMotor = function(build, from){
	const group = dataMain.data[build].group;
	const xLength = group[0][from].length;
	for(c=0; c<xLength; c++){
		const yLength = group.length;
		for(r=0;r<yLength; r++){
			const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq('+c+') .col-row:eq('+r+')';
			let status = group[r][from][c].status;
			let value;
			switch(status){
				case 8:
					value= 'Off'
					break;
				case 12:
					value= '-';
					break;
				default:
					value = group[r][from][c].frequency;
					const limit_m = dataThre[build].data.motor[0];
					const limit_h = dataThre[build].data.motor[1];
					switch(true){
						case value < limit_m:
							status = 9;break;
						case value >= limit_m && value < limit_h:
							status = 10;break;
						case value >= limit_h:
							status = 11;break;
						default:
					}
			};
			const index = dataColor.motor.findIndex( item => item.status == status);
			const color = dataColor.motor[index].color;
			//
			$(target).find('.col-status').attr('data-status', status).css('backgroundColor', color);
			$(target).find('span').text(value);
		}
	}
};

const fnUpdatePipe = function(build, from){
	for( c in dataMain.data[build].group[0][from] ){
		dataMain.data[build].group.forEach(function(item, r){
			if( c == 'in'){
				const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq(0) .col-row:eq('+r+')';
				const value = item[from][c];
				$(target).find('span').text(value);
			}else{
				const w = c == 'out' ? 1 : 2;
				const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq('+w+') .col-row:eq('+r+')';
				const value = item[from][c].value;
				const status = value >= dataThre[build].data[from][c] ? 14 : 13
				const index = dataColor[from].findIndex( item => item.status == status );
				const color = dataColor[from][index].color;
				//
				$(target).find('.col-status').attr('data-status', status).css('backgroundColor', color);
				$(target).find('span').text(value);
			}
		});
	}
}

const fnUpdateSwitch = function(build, from){
	const group = dataMain.data[build].group;
	const xLength = group[0][from].length;
	for(c=0; c<xLength; c++){
		const yLength = group.length;
		for(r=0;r<yLength; r++){
			const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq('+c+') .col-row:eq('+r+')';
			const status = group[r][from][c].status;
			const value = group[r][from][c].machine+'：';
			//
			$(target).attr('data-status', status);
			$(target).find('span').text(value);
			$(target).find('b').text(status);
		}
	}
}

const fnUpdatePhy = function(build, from){
	const group = dataMain.data[build].group;
	const xLength = 2;
	for(c=0; c<xLength; c++){
		const yLength = group.length;
		for(r=0;r<yLength; r++){
			if( r == 0){
				let key = c==0 ? 'dry' : 'wet';
				let target = '.build:eq('+build+') .col[data-unit="phy"] .col-item:eq('+c+') .col-row:eq('+r+')';
				let value = dataMain.data[build].physical[key];
				//
				$(target).text(value)
			}
		}
	}
};

$(()=>{
	$('body').on('click', '.build-title', function(){
		ii = ii == 1 ? 2:1;
		$.ajax({
			type: "GET",
			url: './data/page1/main_' + ii + '.json',
			dataType: 'json',
			success(res){
				dataMain = res;
				for( build in res.data ){
					fnUpdateChiller(build, 'chiller');
					fnUpdateMotor(build, 'cwp');
					fnUpdateMotor(build, 'fan');
					fnUpdatePipe(build, 'pipe');
					fnUpdateSwitch(build, 'switch');
					fnUpdatePhy(build);
				};
				// ----------------------------
				if( $('#lb').attr('data-open') == 'true' ){ // LB開着才需要更新
					nowChart.data = dataMain.data[nowChart.bindex];
					nowChart.dataCwp = nowChart.data.group[nowChart.gindex].cwp;
					nowChart.dataFan = nowChart.data.group[nowChart.gindex].fan;

					// value v
					$('#lb-build span').text(nowChart.data.build);
					$('#lb-subtitle span').text(nowChart.data.total_pc);
					//
					$('.c-box#for-cwp, .c-box#for-fan').html('');
					$('.c-box#for-cwp').html(fnCItemHtml('cwp',nowChart.dataCwp));
					$('.c-box#for-fan').html(fnCItemHtml('fan',nowChart.dataFan));

					// chart v
					fnRanderAll();
				};
			}
		})
	});
})