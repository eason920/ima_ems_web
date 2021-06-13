let ii = 1;

const fnUpdateChiller = function(build, from){
	const group = mainBuild.data[build].group;
	// normal item v
	group.forEach(function(item, i){
		const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq(0) .col-row:eq('+i+') span'; // 0 為正常,直控span
		const value = item[from].normal;
		//
		$(target).text(value);
	});

	// alarm item v
	const thre = mainThre[build].data[from];
	group.forEach(function(item, i){
		const status = item[from].alarm < thre? 6 : 7;
		const index = mainColor[from].findIndex( item => item.status == status );
		const color = mainColor[from][index].color;
		const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq(1) .col-row:eq('+i+')'; // 1 為異常,有兩target
		const value = item[from].alarm;
		//
		$(target).find('.col-status').attr('data-status', status).css('backgroundColor', color);
		$(target).find('span').text(value);
	});
};

const fnUpdateMotor = function(build, from){
	const group = mainBuild.data[build].group;
	const xLength = group[0][from].length;
	for(c=0; c<xLength; c++){
		const yLength = group.length;
		for(r=0;r<yLength; r++){
			const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq('+c+') .col-row:eq('+r+')';
			const status = group[r][from][c].status;
			const index = mainColor.motor.findIndex( item => item.status == status);
			const color = mainColor.motor[index].color;
			const value = group[r][from][c].frequency;
			//
			$(target).find('.col-status').attr('data-status', status).css('backgroundColor', color);
			$(target).find('span').text(value);
		}
	}
};

const fnUpdatePipe = function(build, from){
	for( a in mainBuild.data[build].group[0][from] ){
		mainBuild.data[build].group.forEach(function(item, i){
			
			if( a == 'in'){
				const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq('+i+') .col-row:eq(0)';
				console.log(target);
				const value = item[from][a];
				$(target).find('span').text(value);
			}else{
				const w = a == 'out' ? 1 : 2;
				const target = '.build:eq('+build+') .col[data-unit="'+from+'"] .col-item:eq('+i+') .col-row:eq('+w+')';
				console.log(target);
				const status = item[from][a].status;
				const index = mainColor[from].findIndex( item => item.status == status );
				const color = mainColor[from][index].color;
				const value = item[from][a].value;
				//
				$(target).find('.col-status').attr('data-status', status).css('backgroundColor', color);
				$(target).find('span').text(value);
			}
		});
	}
}

const fnUpdateSwitch = function(build, from){
	const group = mainBuild.data[build].group;
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
	const group = mainBuild.data[build].group;
	const xLength = 2;
	for(c=0; c<xLength; c++){
		const yLength = group.length;
		for(r=0;r<yLength; r++){
			if( r == 0){
				let key = c==0 ? 'dry' : 'wet';
				let target = '.build:eq('+build+') .col[data-unit="phy"] .col-item:eq('+c+') .col-row:eq('+r+')';
				let value = mainBuild.data[build].physical[key];
				//
				$(target).text(value)
			}
		}
	}
};

$(()=>{
	$('body').on('click', '.col-row[data-for="lb"]', function(){
		ii = ii == 1 ? 2:1;
		console.log('got, ii is ', ii);
		$.ajax({
			type: "GET",
			url: './data/page1/main_' + ii + '.json',
			dataType: 'json',
			success(res){
				mainBuild = res;
				// console.log(mainBuild.data[0].physical);
				for( build in res.data ){
					fnUpdateChiller(build, 'chiller');
					fnUpdateMotor(build, 'cwp');
					fnUpdateMotor(build, 'fan');
					fnUpdatePipe(build, 'pipe');
					fnUpdateSwitch(build, 'switch');
					fnUpdatePhy(build);
				};
				
			}
		})
	});
})