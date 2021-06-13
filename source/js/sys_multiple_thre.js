

$(()=>{
	$('body').on('click', '.col-limit[data-for="fix"]', function(){
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
			}
		};
		$(target_parent).find('.sys-ibox').html(h);
		$(target_parent + ', #sys-masker').show();

		// BTN v
		$('#updateThre').attr('data-index', index).attr('data-build-id', build_id);
	});

	$('#updateThre').click(function(){
		const index = $(this).attr('data-index');
		const build_id = $(this).attr('data-build-id');

		if( dataThre[index].build_id == build_id ){
			console.log(index, build_id);
			let ary = [];
			$('.sys.sys-area .sys-ipt').each(function(){
				ary.push( $(this).val() );
			});

			// ----------------------------
			const newData = {
				"chiller": ary[0],
				"motor": [ ary[1], ary[2]],
				"pipe": {
					"out": ary[3],
					"p": ary[4]
				}
			};

			console.log(ary, newData);
		
			dataThre[index].data = newData;
			// $.ajax({
			// 	type: 'POST',
			// 	url: '',
			// 	contentType: 'application/json',
			// 	data: JSON.stringify(data),
			// 	success(res){}
			// })

			// VALUE v
			fnUpdateChiller(index, 'chiller');
			fnUpdateMotor(index, 'cwp');
			fnUpdateMotor(index, 'fan');
			fnUpdatePipe(index, 'pipe');
			fnUpdateSwitch(index, 'switch');
			fnUpdatePhy(index);

			// LIMIT v
			$('.build:eq('+index+') .col[data-unit="chiller"] .col-limit span').text(ary[0]);
			$('.build:eq('+index+') .col[data-unit="motor"] .col-limit span:eq(0)').text(ary[1]);
			$('.build:eq('+index+') .col[data-unit="motor"] .col-limit span:eq(1)').text(ary[2]);
			$('.build:eq('+index+') .col[data-unit="pipe"] .col-limit span:eq(0)').text(ary[3]);
			$('.build:eq('+index+') .col[data-unit="pipe"] .col-limit span:eq(1)').text(ary[4]);
		}
	})
})