const fnRenderColor = function(data){
	let nav = ''; // NAV 演示用色
	let fix = ''; // 調整用色 SYS LB
	let total = ''; // 冰機狀態統計(右上)

	data.forEach(function(item){
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
		
		// ----------------------------
		const sumTarget = 's' + item.status;
		total += '<div class="rbox-status-item">'
		total += '<div class="rbox-status-color" data-status="' + item.status + '" style="background-color:' + item.color + '"></div>'
		total += '<div class="rbox-status-info">'
		total += '<div class="rbox-status-num">'+ sum[sumTarget] +'</div>'
		total += '<div class="rbox-status-txt">' + item.name + '</div>'
		total += '</div>'
		total += '</div>'
	});

	$('.status-chill').html(nav); // NAV
	$('.sys-cbox').html(fix);// 改色 LB
	$('.rbox-status.is-total').html(total); // 右中
	// 異常冰機列表 v
	for(i=3;i<=4;i++){
		$('.errbox[data-status="'+i+'"]').find('.rbox-status-color').css('background-color', data[i].color);
		$('.errbox[data-status="'+i+'"] span').text(data[i].name);
	};
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
		console.log('is chiller color update');
		dataColor = [];
		$('.sys-citem').each(function(){
			const status = $(this).attr('data-status');
			const name = $(this).find('.sys-ctxt').text();
			const color = $(this).find('.minicolors-item').val();
			console.log(status, name, color);
			dataColor.push({name, status, color});
		});

		// ----------------------------
		console.log(dataColor);
		const url = apiPrifix + 'api/single_chiller/chill_update/build_id=' + build_id;
		const data = '{"color":{"chiller":' + JSON.stringify(dataColor) + '}}';
		console.log('update api is ', url);
		console.log('data is ', data);
		$.ajax({
			type: 'POST',
			url,
			data,
			contentType: 'application/json',
			dataType: 'json',
			success(res){
				console.log(res);
				fnHide();
			}
		})

		// ----------------------------
		fnRenderColor(dataColor);
		setingMinicolor();
		fnRenderBuild(dataMain);
	});
})