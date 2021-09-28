let dataMain = new Object();
let dataCT = new Object();

const nua = navigator.userAgent;
const isMobile = /iphone | ipad | android/i.test(nua);

const apiPrifix= 'https://dash.ima-ems.com/';
const build_id = location.href.split('?build_id=')[1].split('&')[0];

let ii = 1

const fnHtmlTitle = function(data, name){
	// console.log('title ', data, name);
	let h ='';
	h+='<div class="title">'
		h+='<div class="title-txt">'+name+'</div>'
		h+='<div class="title-switch"> '
			data.forEach(function(item, i){
				if( item.machine.trim() != ''){
					h+='<div class="title-item"> '
					h+='<div class="title-machine">'+item.machine+'：</div>'
					h+='<div class="title-status" data-status="'+item.status+'">'+item.status+'</div>'
					h+='</div>'// item
				};
				if( item.machine.trim() == '' && i == 0){
					h+='(no switch in this group)'
				}
			});
		h+='</div>'
	h+='</div>' // title
	return h
};

const fnHtmlCwp = function(data, gindex){
	// console.log('pump ', data);
	let h = '';
	let picStatus = 'is-nor';
	h+='<div class="card-item" data-type="cwp">'
		h+='<div class="card-left">'
			h+='<div class="left-img @@"><img class="is-nor" src="./images/cwp_nor.png"><img class="is-err" src="./images/cwp_err.png"></div>'
			h+='<div class="left-name">水泵浦</div>'
		h+='</div>'
		h+='<div class="card-right">'
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
				const color= dataCT.color.motor[index].color;
				h+='<div class="right-item" data-group-index="'+gindex+'" data-from="cwp" data-machine-index="'+i+'">'
				h+='<div class="right-name">'+item.machine+'：</div>'
				h+='<div class="right-color" data-status="'+status+'" style="background-color:'+color+'">'+value+'</div>'
				h+='<div class="right-btn">詳細</div>'
				h+='</div>' // item
			});
		h+='</div>'
	h+='</div>' // chill 1/3
	h = h.replace('@@', picStatus);
	return h
};

const fnHtmlFan = function(data, gindex){
	// console.log('fan ', data);
	let h = '';
	let picStatus = 'is-nor';
	h+='<div class="card-item" data-type="fan">'
		h+='<div class="card-left">'
			h+='<div class="left-img @@"><img class="is-nor" src="./images/fan_nor.png"><img class="is-err" src="./images/fan_err.png"></div>'
			h+='<div class="left-name">水塔風扇</div>'
		h+='</div>'
		h+='<div class="card-right">'
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
				const color= dataCT.color.motor[index].color;
				h+='<div class="right-item" data-group-index="'+gindex+'" data-from="fan" data-machine-index="'+i+'">'
				h+='<div class="right-name">'+item.machine+'：</div>'
				h+='<div class="right-color" data-status="'+status+'" style="background-color:'+color+'">'+value+'</div>'
				h+='<div class="right-btn">詳細</div>'
				h+='</div>' // item
			});
		h+='</div>'
	h+='</div>' // pump 2/3
	h = h.replace('@@', picStatus);
	return h
};

const fnHtmlPipe = function(data){
	// console.log('pipe ', data);
	let h = '';
	let picStatus = 'is-nor';
	h+='<div class="card-item" data-type="pipe">'
		h+='<div class="card-left">'
			h+='<div class="left-img @@"><img class="is-nor" src="./images/pipe_nor.png"><img class="is-err" src="./images/pipe_err.png"></div>'
			h+='<div class="left-name">水溫/水壓</div>'
		h+='</div>'
		h+='<div class="pipe"> '
			h+='<div class="pipe-box">'
				h+='<div class="pipe-item">'
					h+='<div class="pipe-name">回水溫：</div>'
					h+='<div class="pipe-num">'+data.in+'</div>'
				h+='</div>'
				h+='<div class="pipe-item" data-pipe="out">'
					h+='<div class="pipe-name">出水溫：</div>'
					const outValue = data.out.value;
					const outLimit = dataCT.threshold.pipe.out;
					const outStatus = outValue >= outLimit ? 14 : 13;
					const outIndex = dataCT.color.pipe.findIndex( item => item.status == outStatus );
					const outColor = dataCT.color.pipe[outIndex].color;
					h+='<div class="pipe-num" data-status="'+outStatus+'" style="background-color:'+outColor+'">'+outValue+'</div>'
				h+='</div>'
				h+='<div class="pipe-item" data-pipe="p">'
					h+='<div class="pipe-name">水壓差：</div>'
					const pValue = data.p.value;
					const pLimit = dataCT.threshold.pipe.p;
					const pStatus = pValue >= pLimit ? 14 : 13;
					const pIndex = dataCT.color.pipe.findIndex( item => item.status == pStatus );
					const pColor = dataCT.color.pipe[pIndex].color;
					h+='<div class="pipe-num" data-status="'+pStatus+'" style="background-color:'+pColor+'">'+pValue+'</div>'
				h+='</div>'
			h+='</div>'
			h+='<div class="pipe-board">'
				const deg = Math.round( 180 * ( pValue / 2 ) / 10 ) * 10;
				h+='<div class="pipe-guide" style="transform: rotate('+deg+'deg)"></div>'
			h+='</div>'
		h+='</div>'
	h+='</div>' // pipe 3/3
	if( outStatus == 14 || pStatus == 14 ){ picStatus = 'is-err' }
	h = h.replace('@@', picStatus);
	return h
}

$(()=>{
	$.ajax({
		// url: './data/'+build_id+'/pump/pump_setting.json',
		url: apiPrifix + 'api/single_pump/pump_setting/build_id=' + build_id,
		type: 'GET',
		dataType: 'json',
		success(res){
			dataCT = res;
			fnRenderColor(dataCT.color);
			setingMinicolor();
			
			$.ajax({
				// url: './data/'+build_id+'/pump/main_'+ii+'.json',
				url: apiPrifix + 'api/single_pump/build_id=' + build_id,
				type: 'GET',
				dataType: 'json',
				success(res){
					dataMain = res;
					$('#location span').text(dataMain.build)
					if( !dataMain.have_chiller ){ $('.navlabel-item[data-unit="chiller"]').hide(); }
					fnTime(dataMain.data_time);
					let h = '<div id="mb-btn">省電詳細</div>';
					dataMain.group.forEach(function(item, i){
						h+='<div class="block">'
							h+=fnHtmlTitle(item.switch, item.show_name);
							h+='<div class="card">'
								h+=fnHtmlCwp(item.cwp, i);
								h+=fnHtmlFan(item.fan, i);
								h+=fnHtmlPipe(item.pipe);
							h+='</div>' // card
						h+='</div>' // block
					});
					$('#wrapper-single').html(h);

					fnInterval();
				}
			})
		}
	});

	$('.navlabel-item[data-unit="chiller"]').attr('href', 'single_chiller.html?build_id=' + build_id);

	if( isMobile ){
		$('#hamber').click(function(){
			$(this).toggleClass('is-open');
			$('#mbbox, #nav-masker').toggle();
		});
	}
});