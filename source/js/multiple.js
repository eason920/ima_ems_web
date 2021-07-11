let dataMain = new Object();
let dataColor = new Object();
let dataThre = new Object()

const nua = navigator.userAgent;
const isMobile = /iphone | ipad | android/i.test(nua);

let PAGE = 0;

const fnHtmlGroup = function(build, from){
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		const data = dataMain.data[build].group;
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
		h+='<div class="col-limit" data-for="fix" '
		h+='data-id="'+dataMain.data[build].build_id+'"'
		h+='data-build="'+dataMain.data[build].build+'"'
		h+='>異常交界<div class="col-btn">調</div></div>'
	h+='</div>' // col
	return h;
};

const fnHtmlChiller = function(build, from){
	const titleObj = ['正常', '異常']
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		const group = dataMain.data[build].group;
		// normal item v
		h+='<div class="col-item">'
			h+='<div class="col-title">'+titleObj[0]+'</div>'
			group.forEach(function(item, i){
				h+= '<div class="col-row"><span>'+item.chiller.normal+'</span></div>'
			});
		h+='</div>'// item

		// alarm item v
		const thre = dataThre[build].data[from];
		h+='<div class="col-item">'
			h+='<div class="col-title">'+titleObj[1]+'</div>'
			group.forEach(function(item, i){
				const status = item.chiller.alarm < thre? 6 : 7;
				const index = dataColor.chiller.findIndex(function(item){
					return item.status == status;
				});
				const color = dataColor.chiller[index].color;
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
		const group = dataMain.data[build].group;
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
					h+='<div class="col-row">'
						h+='<div class="col-status" data-status="'+status+'" '
						h+='style="background-color:'+color+'"></div>'
						h+='<span>'+value+'</span>'
					h+='</div>' // row
				}
			h+='</div>'// item
		}
	h+='</div>' // col

	if( from == 'fan' ){
		const thre = dataThre[build].data.motor;
		h+='<div class="col-limit">中<span>'+ thre[0] +'</span>kWh / 高 <span>'+thre[1]+'</span>kWh</div>'
	}
	return h;
}

const fnHtmlPipe = function(build, from){
	const titleObj = ['(管線)回水溫', '出水溫', '水壓差']
	let h = '';
	h+='<div class="col" data-unit="' + from + '">'
		let i = 0;
		for( c in dataMain.data[build].group[0][from] ){
			h+='<div class="col-item">'
				h+='<div class="col-title">'+titleObj[i]+'</div>'
				dataMain.data[build].group.forEach(function(item){
					h+='<div class="col-row">'
						if( c == 'in'){
							h+='<span>'+item[from][c]+'</span>'
						}else{
							// const status = item[from][c].status;
							const value = item[from][c].value;
							const status = value >= dataThre[build].data[from][c] ? 14 : 13
							const index = dataColor[from].findIndex( item => item.status == status );
							const color = dataColor[from][index].color;
							h+='<div class="col-status" data-status="'+status+'"'
							h+=' style="background-color:'+color+'"></div>'
							h+='<span>'+value+'</span>'
						}
					h+='</div>' // row
				});
			h+='</div>' // item
			if( i == 2 ){// 每列只會有三 item
				const thre = dataThre[build].data.pipe;
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
		const group = dataMain.data[build].group;
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
		const group = dataMain.data[build].group;
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
						h+=dataMain.data[build].physical[key]
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
};

const fnPageLabel = function(){
	let p ='';
	
	// PREV v
	if( dataMain.prev == false ){
		p+='<a href="" class="mullabel-item muted">Prev</a>'
	}else{
		p+='<a href="multiple.html?page='+PAGE+'" class="mullabel-item">Prev</a>'
	};
	
	// MIDDLE v
	for(i=1;i<=dataMain.page_total;i++){
		// console.log('i', i);
		p+='<a href="multiple.html?page='+i+'" class="mullabel-item'
		if(i==PAGE){
			p+=' active';
		}
		p+='">'+i+'</a>'
	}

	// NEXT v
	if( dataMain.next == false ){
		p+='<a href="" class="mullabel-item muted">Next</a>'
	}else{
		p+='<a href="multiple.html?page='+dataMain.next+'" class="mullabel-item">Next</a>'
	};

	$('#mullabel').html(p);
}

$(()=>{
	if( location.href.split('page=')[1].split('&')[1] == undefined ){
		PAGE = location.href.split('page=')[1];
	}else{
		PAGE = location.href.split('page=')[1].split('&')[0];
	};

	// ----------------------------
	// COLOR v
	// ----------------------------
	$.ajax({
		type: 'GET',
		url: './data/multiple_color.json',
		dataType: 'json',
		success(res){
			dataColor = res.color;
			fnRenderColor(dataColor);
			setingMinicolor();

			// ----------------------------
			// THRESHOLD v
			// ----------------------------
			$.ajax({
				type: 'GET',
				url: './data/page'+PAGE+'/threshold.json',
				dataType: 'json',
				success(res){
					dataThre = res.threshold;

					// ----------------------------
					// BUILD v
					// ----------------------------
					$.ajax({
						type: 'GET',
						url: './data/page'+PAGE+'/main_1.json',
						dataType: 'json',
						success(res){
							dataMain = res;
							
							fnPageLabel();

							// ----------------------------
							// START v
							// ----------------------------
							let h = '';
							for( build in dataMain.data ){
								h+='<div class="build">'
									h+=	'<div class="build-title">' + dataMain.data[build].build +'</div>'
									// ----------------------------
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
									// ----------------------------
									h+='<div class="build-time" data-err="false">'
									h+='<div class="build-time-date">資料更新：<span></span></div>'
									h+='<b class="build-time-text">網路斷訊或伺服資料錯誤</b>'
									h+='</div>'
								h+='</div><br>' // .build
								// ----------------------------
								if( Number(build) == dataMain.data.length - 1 ){
									setTimeout(function(){
										fnBalance();
									}, 0);
									fnInterval();
								}
							}
							$('#wrapper-single').html(h);
							for( build in dataMain.data ){
								fnTime(build, dataMain.data[build].data_time);
							};
						}
					}); // ajax main
				}
			}); // ajax threshold
		}
	}); // ajax color

	// ----------------------------
	// HAMBER v
	// ----------------------------
	if( isMobile ){
		$('#hamber').click(function(){
			$(this).toggleClass('is-open');
			$('#mbbox, #nav-masker').toggle();
		});
	}
})