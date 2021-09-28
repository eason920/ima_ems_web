const fnRenderColor = function(data){
	let sys = ''; // 調整用色 SYS LB
	for( unit in data ){
		// console.log(unit, 'unit');
		let nav = ''; // NAV 演示用色
		data[unit].forEach(function(item){
			nav += '<div class="status-item" data-status="' + item.status + '">';
				nav += '<div class="status-color" style="background-color:' + item.color + '"></div>';
				nav += '<div class="status-txt">' + item.name + '</div>';
			nav += '</div>'
	
			// ----------------------------
			sys += '<div class="sys-citem" data-status="' + item.status + '">';
				sys += '<div class="sys-ctxt">' + item.name + '</div>';
				sys += '<div class="sys-sbtn">修改</div>'
				sys += '<input class="minicolors-item" type="text" data-control="wheel" value="' + item.color + '" readonly>'
			sys += '</div>';
		});
		
		// ----------------------------
		$('.status-'+unit).html(nav); // NAV
		//
		if( unit != 'pipe'){ sys += '<hr>'};
	};
	$('.sys-cbox').html(sys);// 改色 LB
};

const setingMinicolor = function(){
	$('.minicolors-item').each( function() {
		$(this).minicolors({
			control: $(this).attr('data-control') || 'hue',
			defaultValue: $(this).attr('data-defaultValue') || '',
			format: $(this).attr('data-format') || 'hex',
			keywords: $(this).attr('data-keywords') || '',
			inline: $(this).attr('data-inline') === 'true',
			letterCase: $(this).attr('data-letterCase') || 'lowercase',
			opacity: $(this).attr('data-opacity'),
			position: $(this).attr('data-position') || 'bottom',
			swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
			change: function(value, opacity) {
				if( !value ) return;
				if( opacity ) value += ', ' + opacity;
				// if( typeof console === 'object' ) {
				// 	console.log(value);
				// }
			}
		});
	});
};

$(()=>{
	$('.log-color').click(function(){
		fnRenderColor(dataCT.color);
		setingMinicolor();
	});

	$('#updateColor').click(function(){
		dataCT.color = {
			motor: [],
			pipe: []
		};
		let i=0;

		$('.sys-citem').each(function(){
			const status = $(this).attr('data-status');
			const name = $(this).find('.sys-ctxt').text();
			const color = $(this).find('.minicolors-item').val();
			
			let key;
			switch(true){
				case i <= 4:
					key = 'motor';
					break;
				case i > 4:
					key = 'pipe'
					break;
				default:
			};
			
			dataCT.color[key].push({name, status, color});
			i++
		});
		console.log('color > ', dataCT);
		// ----------------------------
		$.ajax({
			type: 'POST',
			url: apiPrifix + 'api/single_pump/pump_update/build_id=' + build_id,
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(dataCT),
			success(res){
				console.log(res);
			}
		})

		fnHide();
		// ----------------------------
		fnRenderColor(dataCT.color);
		setingMinicolor();
		//-
		for(i=0;i<dataMain.group.length;i++){
			fnUpdateMotor(i, dataMain.group[i].cwp, 'cwp');
			fnUpdateMotor(i, dataMain.group[i].fan, 'fan');
			fnUpdatePipe(i, dataMain.group[i].pipe);
		}
	});
});