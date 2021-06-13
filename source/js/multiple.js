let mainBuild = new Object();
let mainColor = new Object();
let mainThre = new Object()

const fnHtmlGroup = function(build, from){
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		const data = mainBuild.data[build].group;
			h+='<div class="col-item">'
				h+='<div class="col-title">群組</div>'
				data.forEach(function(item, i){
					h+='<div class="col-row" data-for="lb"'
					h+=' data-build-index='+build
					h+=' data-group-index='+i+'>'
					h+='<span>'+data[i].show_name+'</span>'
					h+='<div class="col-btn">詳</div></div>'
				});
			h+='</div>' // item
		h+='<div class="col-limit" data-for="fix">異常交界<div class="col-btn">調</div></div>'
	h+='</div>' // col
	return h;
};

const fnHtmlChiller = function(build, from){
	const titleObj = ['正常', '異常']
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		const group = mainBuild.data[build].group;
		// normal item v
		h+='<div class="col-item">'
			h+='<div class="col-title">'+titleObj[0]+'</div>'
			group.forEach(function(item, i){
				h+= '<div class="col-row"><span>'+item.chiller.normal+'</span></div>'
			});
		h+='</div>'// item

		// alarm item v
		const thre = mainThre[build].data[from];
		h+='<div class="col-item">'
			h+='<div class="col-title">'+titleObj[1]+'</div>'
			group.forEach(function(item, i){
				const status = item.chiller.alarm < thre? 6 : 7;
				const index = mainColor.chiller.findIndex(function(item){
					return item.status == status;
				});
				const color = mainColor.chiller[index].color;
				h+='<div class="col-row">';
					h+='<div class="col-status" data-status="'+status+'" '
					h+='style="background-color:'+color+'"></div>'
					h+='<span>'+item.chiller.alarm+'</span>'
				h+='</div>'//row
			});
		h+='</div>'// item

		// limit v
		h+='<div class="col-limit"><span>'+ thre +'</span>台</div>'

	h+='</div>' // col
	return h;
}

const fnHtmlMotor = function(build, from){
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		const group = mainBuild.data[build].group;
		const xLength = group[0][from].length;
		for(c=0; c<xLength; c++){
			h+='<div class="col-item">'
				h+='<div class="col-title">'
				if(c==0){
					h+= from == 'cwp' ? '(水泵)' : '(風扇)'
				}
				h+=group[0][from][c].machine
				h+='</div>'
				const yLength = group.length;
				for(r=0;r<yLength; r++){
					const status = group[r][from][c].status;
					const index = mainColor.motor.findIndex( item => item.status == status);
					const color = mainColor.motor[index].color;
					h+='<div class="col-row">'
						h+='<div class="col-status" data-status="'+status+'" '
						h+='style="background-color:'+color+'"></div>'
						h+='<span>'+group[r][from][c].frequency+'</span>'
					h+='</div>' // row
				}
			h+='</div>'// item
		}
	h+='</div>' // col

	if( from == 'fan' ){
		const thre = mainThre[build].data.motor;
		h+='<div class="col-limit">中<span>'+ thre[0] +'</span>kWh / 高 <span>'+thre[1]+'</span>kWh</div>'
	}
	return h;
}

const fnHtmlPipe = function(build, from){
	const titleObj = ['(管線)回水溫', '出水溫', '水壓差']
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		let i = 0;
		for( a in mainBuild.data[build].group[0][from] ){
			h+='<div class="col-item">'
				h+='<div class="col-title">'+titleObj[i]+'</div>'
				mainBuild.data[build].group.forEach(function(item){
					h+='<div class="col-row">'
						if( a == 'in'){
							h+='<span>'+item[from][a]+'</span>'
						}else{
							const status = item[from][a].status;
							const index = mainColor[from].findIndex( item => item.status == status );
							const color = mainColor[from][index].color;
							h+='<div class="col-status" data-status="'+status+'"'
							h+=' style="background-color:'+color+'"></div>'
							h+='<span>'+item[from][a].value+'</span>'
						}
					h+='</div>' // row
				});
			h+='</div>' // item
			if( i == 2 ){// 每列只會有三 item
				const thre = mainThre[build].data.pipe;
				h+='<div class="col-limit">出水 <span>'+thre.out+'</span>度  /  水壓<span>'+thre.p+'</span></div>'
			}
			i ++;
		}
	h+='</div>' // col
	return h;
}

const fnHtmlSwitch = function(build, from){
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		const group = mainBuild.data[build].group;
		const xLength = group[0][from].length;
		for(c=0; c<xLength; c++){
			h+='<div class="col-item">'
				h+='<div class="col-title">'
				h+= c == 0 ? '(開關狀態)':'-'
				h+='</div>'
				const yLength = group.length;
				for(r=0;r<yLength; r++){
					const status = group[r][from][c].status;
					h+='<div class="col-row" data-status='+status+'>'
						if( status == ''){
							h+='<span>-</span>'
						}else{
							h+='<span>'+group[r][from][c].machine+'：</span>'
							h+='<b>'+status+'</b>'
						}
					h+='</div>' // row
				}
			h+='</div>'// item
			if( c == xLength - 1 ){
				h+='<div class="col-limit">-</div>'
			}
		}
	h+='</div>' // col
	return h;
}

const fnHtmlPhy = function(build, from){
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		const group = mainBuild.data[build].group;
		const xLength = 2;
		for(c=0; c<xLength; c++){
			h+='<div class="col-item">'
				h+='<div class="col-title">'
				h+= c==0 ? '乾球' : '濕球'
				h+='</div>'
				const yLength = group.length;
				for(r=0;r<yLength; r++){
					h+='<div class="col-row"><span>'
					if( r == 0){
						const key = c==0 ? 'dry' : 'wet'
						h+=mainBuild.data[build].physical[key]
					}
					h+='</span></div>' // row
				}
			h+='</div>'// item
			if( c == xLength - 1 ){
				h+='<div class="col-limit">-</div>'
			}
		}
	h+='</div>' // col
	return h;
};

const fnBalance = function(){
	let c = 0;
	let f = 0;
	let s = 0;
	$('.col[data-unit="cwp"]').each(function(){
		const w = $(this).outerWidth(true);
		if( w > c ){ c = w };
	});
	$('.col[data-unit="fan"]').each(function(){
		const w = $(this).outerWidth(true);
		if( w > f ){ f = w };
	});
	$('.col[data-unit="switch"]').each(function(){
		const w = $(this).outerWidth(true);
		if( w > s ){ s = w };
	});
	setTimeout(function(){
		$('.col[data-unit="cwp"]').each(function(){
			$(this).css('width', c + 'px')
		});
		$('.col[data-unit="fan"]').each(function(){
			$(this).css('width', f + 'px')
		});
		$('.col[data-unit="switch"]').each(function(){
			$(this).css('width', s + 'px')
		});
	}, 0)
}

$(()=>{
	// ----------------------------
	// COLOR v
	// ----------------------------
	$.ajax({
		type: 'GET',
		url: './data/page1/color.json',
		dataType: 'json',
		success(res){
			mainColor = res.color;

			// ----------------------------
			// THRESHOLD v
			// ----------------------------
			$.ajax({
				type: 'GET',
				url: './data/page1/threshold.json',
				dataType: 'json',
				success(res){
					mainThre = res.threshold;

					// ----------------------------
					// BUILD v
					// ----------------------------
					$.ajax({
						type: 'GET',
						url: './data/page1/main_1.json',
						dataType: 'json',
						success(res){
							mainBuild = res;
							let h = '';
							for( build in res.data ){
								h+='<div class="build">'
								h+=	'<div class="build-title">' + res.data[build].build +'</div>'
								h+=	'<div class="build-body">'
								// G
								h+= fnHtmlGroup(build, 'group')
								// C
								h+= fnHtmlChiller(build, 'chiller')
								// // M
								h+='<div class="col" data-unit="motor">'
								h+= fnHtmlMotor(build, 'cwp')
								h+= fnHtmlMotor(build, 'fan')
								h+='</div>'
								// // P
								h+= fnHtmlPipe(build, 'pipe')
								// // S
								h+= fnHtmlSwitch(build, 'switch')
								// // p
								h+= fnHtmlPhy(build, 'phy')
								// GCMPSP END
								h+=	'</div>' // .build-body
								h+='</div><br>' // .build
								// ----------------------------
								if( Number(build) == mainBuild.data.length - 1 ){
									setTimeout(function(){
										fnBalance();
									}, 0);
								}
							}
				
							$('#wrapper-single').html(h);
						}
					})
				}
			});
		}
	});

})