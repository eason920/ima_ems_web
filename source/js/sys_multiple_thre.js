

$(()=>{
	$('body').on('click', '.col-limit[data-for="fix"]', function(){
		// if( isMobile ){
		// 	switchControl.o2c();
		// 	switchControl.mb.o2c();
		// }else{
		// 	switchControl.o2c();
		// 	switchControl.pc.o2c();
		// };

		// ----------------------------
		const build = $(this).attr('data-build');
		const build_id = $(this).attr('data-id');
		const index = dataThre.findIndex( item => item.build_id == build_id );
		const data = dataThre[index].data;

		// HTML v
		const target_parent = '.sys.sys-area';
		let h = '';
		$(target_parent).find('.sys-title').text('交界-'+build);
		for( unit in data ){
			//chiller v
			if( unit == 'chiller'){
				h+='<div class="sys-item">'
					h+='<div class="sys-txt">數據逹</div>'
					h+='<input class="sys-ipt" type="text" value="'+data[unit]+'">'
					h+='<div class="sys-txt">時為異常(多)</div>'
				h+='</div>'// item
				h+='<hr>'
			};

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
				h+='<hr>'
			}
		};
		$(target_parent).find('.sys-ibox').html(h);
		$(target_parent + ', #sys-masker').show();

		// BTN v
		$('#updateThre').attr('data-index', index).attr('data-build-id', build_id);
	});

	$('#updateThre').click(function(){
		const index = $(this).attr('data-index');
		let build_id = $(this).attr('data-build-id');

		if( dataThre[index].build_id == build_id ){
			console.log(index, build_id);
			if( build_id.length == 1 ){ build_id = "0" + build_id}
			console.log('bid is ', build_id);

			let ary = [];
			$('.sys.sys-area .sys-ipt').each(function(){
				ary.push( $(this).val() );
			});

			// ----------------------------
			const newData = {
				"build_id": build_id,
				"data": {
					"motor": [ ary[0], ary[1]],
					"pipe": {
						"out": ary[2],
						"p": ary[3]
					},
					"chiller": ary[4]
				}
			};

			console.log(ary, 'new date 98>',newData, JSON.stringify(newData));
		
			dataThre[index].data = newData.data;

			$.ajax({
				type: 'POST',
				// url: '',
				url: apiPrifix + 'api/multiple/multiple_update_threshold/build_id=' + nowPage,
				contentType: 'application/json',
				data: JSON.stringify(newData),
				// data: newData,
				success(res){
					console.log(res);
				}
			})
			
			// VALUE v
			fnUpdateChiller(index, 'chiller');
			fnUpdateMotor(index, 'cwp');
			fnUpdateMotor(index, 'fan');
			fnUpdatePipe(index, 'pipe');
			fnUpdateSwitch(index, 'switch');
			fnUpdatePhy(index);

			// LIMIT v
			$('.build:eq('+index+') .col[data-unit="chiller"] .col-limit span').text(newData.data.chiller);
			$('.build:eq('+index+') .col[data-unit="motor"] .col-limit span:eq(0)').text(newData.data.motor[0]);
			$('.build:eq('+index+') .col[data-unit="motor"] .col-limit span:eq(1)').text(newData.data.motor[1]);
			$('.build:eq('+index+') .col[data-unit="pipe"] .col-limit span:eq(0)').text(newData.data.pipe.out);
			$('.build:eq('+index+') .col[data-unit="pipe"] .col-limit span:eq(1)').text(newData.data.pipe.p);
		}

		fnHide();
	})
})