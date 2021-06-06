const fnHCol = function(from){
	let h = '';
	h+=		'<div class="col" data-unit="' + from + '">'
	h+=			'<div class="col-item"></div>'
	h+=			'<div class="col-limit"></div>'
	h+=		'</div>' // from
	return h
}

$(()=>{
	console.log('got multiple.js');
	$.ajax({
		type: 'GET',
		url: './data/page1/main_1.json',
		dataType: 'json',
		success: function(res){
			console.log(res);

			let h = '';
			for( build in res.data ){
				h+='<div class="build">'
				h+=	'<div class="build-title">' + res.data[build].build +'</div>'
				h+=	'<div class="build-body">'
				// G
				h+= fnHCol('from')
				// C
				h+= fnHCol('chiller')
				// M
				h+= fnHCol('motor')
				// P
				h+= fnHCol('pipe')
				// S
				h+= fnHCol('switch')
				// p
				h+= fnHCol('phy')
				// GCMPSP END
				h+=	'</div>' // .build-body
				h+='</div><br>' // .build
			}

			$('#wrapper-single').html(h);
		}
	})
})