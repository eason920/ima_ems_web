const fnRenderColor = function(data){
	let fix = ''; // 調整用色 SYS LB
	for( unit in data ){
		let nav = ''; // NAV 演示用色
		data[unit].forEach(function(item){
			nav += '<div class="status-item" data-status="' + item.status + '">';
				nav += '<div class="status-color" style="background-color:' + item.color + '"></div>';
				nav += '<div class="status-txt">' + item.name + '</div>';
			nav += '</div>'
	
			// ----------------------------
			fix += '<div class="sys-citem" data-status="' + item.status + '">';
				fix += '<div class="sys-ctxt">' + item.name + '</div>';
				fix += '<div class="sys-sbtn">修改</div>'
				fix += '<input class="minicolors-item" type="text" data-control="wheel" value="' + item.color + '" readonly>'
			fix += '</div>';
		});
		
		// ----------------------------
		if( unit == 'chiller' ){ unit = 'chillm' };
		$('.status-'+unit).html(nav); // NAV
		//
		if( unit != 'pipe'){ fix += '<hr>'};
	};
	$('.sys-cbox').html(fix);// 改色 LB
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
    fnRenderColor(dataColor);
    setingMinicolor();
  });

	$('#updateColor').click(function(){
		dataColor = {
			chiller: [],
			motor: [],
			pipe: []
		};
		let i=0
		$('.sys-citem').each(function(){
			const status = $(this).attr('data-status');
			const name = $(this).find('.sys-ctxt').text();
			const color = $(this).find('.minicolors-item').val();
			
			let key;
			switch(true){
				case i <=1:
					key = 'chiller';
					break;
				case i <= 6:
					key = 'motor';
					break;
				case i > 6:
					key = 'pipe'
					break;
				default:
			};
			
			dataColor[key].push({name, status, color});
			i++
		});

		// ----------------------------
		console.log(dataColor);
		// $.ajax({
		// 	type: 'POST',
		// 	url: '',
		// 	contentType: 'application/json',
		// 	data: JSON.stringify(data),
		// 	success(res){}
		// })

		// ----------------------------
		fnRenderColor(dataColor);
		setingMinicolor();
		//-
		dataMain.data.forEach(function(item, index){
			fnUpdateChiller(index, 'chiller');
			fnUpdateMotor(index, 'cwp');
			fnUpdateMotor(index, 'fan');
			fnUpdatePipe(index, 'pipe');
		});
	});
});