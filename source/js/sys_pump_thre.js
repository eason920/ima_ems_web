

$(()=>{
	$('.log-area').click(function(){
		// const build = $(this).attr('data-build');
		// const build_id = $(this).attr('data-id');
		// const index = dataThre.findIndex( item => item.build_id == build_id );
		// const data = dataThre[index].data;

		// // HTML v
		// const target_parent = '.sys.sys-area';
		let h = '';
		// $(target_parent).find('.sys-title').text('交界-'+build);
		const data = dataCT.threshold
		for( unit in data ){
			//motor v
			if( unit == 'motor'){
				h+='<div class="sys-item">'
					h+='<div class="sys-txt">數據逹</div>'
					h+='<input class="sys-ipt" type="text" value="'+data[unit][0]+'">'
					h+='<div class="sys-txt">時為開機頻率(中)</div>'
				h+='</div>'// item
				h+='<div class="sys-item">'
					h+='<div class="sys-txt">數據逹</div>'
					h+='<input class="sys-ipt" type="text" value="'+data[unit][1]+'">'
					h+='<div class="sys-txt">時為開機頻率(高)</div>'
				h+='</div>'// item
				h+='<hr>';
			};

			// pipe v
			if( unit == 'pipe'){
				h+='<div class="sys-item">'
					h+='<div class="sys-txt">數據逹</div>'
					h+='<input class="sys-ipt" type="text" value="'+data[unit].out+'">'
					h+='<div class="sys-txt">時為出水溫(高)</div>'
				h+='</div>'// item
				h+='<div class="sys-item">'
					h+='<div class="sys-txt">數據逹</div>'
					h+='<input class="sys-ipt" type="text" value="'+data[unit].p+'">'
					h+='<div class="sys-txt">時為水壓差(高)</div>'
				h+='</div>'// item
			}
		};
		$('.sys-ibox').html(h);
		$('#sys-masker').show();

		// BTN v
		// $('#updateThre').attr('data-index', index).attr('data-build-id', build_id);
	});

	$('#updateThre').click(function(){
		// const index = $(this).attr('data-index');
		// const build_id = $(this).attr('data-build-id');

		// if( dataThre[index].build_id == build_id ){
			// console.log(index, build_id);
			let ary = [];
			$('.sys.sys-area .sys-ipt').each(function(){
				ary.push( $(this).val() );
			});

			// ----------------------------
			const newData = {
				"motor": [ ary[0], ary[1]],
				"pipe": {
					"out": ary[2],
					"p": ary[3]
				}
			};

			console.log(ary, newData);
		
			dataCT.threshold = newData;
			// $.ajax({
			// 	type: 'POST',
			// 	url: '',
			// 	contentType: 'application/json',
			// 	data: JSON.stringify(data),
			// 	success(res){}
			// })

			// VALUE v
			for(i=0;i<dataMain.group.length;i++){
				fnUpdateMotor(i, dataMain.group[i].cwp, 'cwp');
				fnUpdateMotor(i, dataMain.group[i].fan, 'fan');
				fnUpdatePipe(i, dataMain.group[i].pipe);
			}
		// }
	})
})