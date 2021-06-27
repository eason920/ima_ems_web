const fnHide = function(){
	$('#sys-masker, .sys-color, .sys-area, .sys-login').hide();
};

$(()=>{
	$('.log-color, .log-area, .log-out, .col-limit[data-for="fix"]').click(function(){
		$('#sys-masker').show();
	});

	$('.log-color').click(function(){
		$('.sys-color').show();
	});

	$('.log-area, .col-limit[data-for="fix"]').click(function(){
		$('.sys-area').show();
	});

	$('.log-out').click(function(){
		$('.sys-login').show();
	});

	$('.sys-close, .sys-btn').click(function(){
		fnHide();
	})

	$('body').on('keydown', function(e){
		if( e.keyCode === 27 ){
			fnHide();
		}
	});
	// ----------------------------
	$('.sys-box.is-color').on('click', '.minicolors-item, .minicolors-swatch', function(){
		$(this).parent().siblings('.sys-sbtn').text('確定').addClass('is-edit');
		$('.sys-bbox').addClass('is-muted');
	});

	$('.sys-box.is-color').on('click', '.sys-sbtn', function(){
		$(this).text('修改').removeClass('is-edit');
		$('.sys-bbox').removeClass('is-muted');
	});


	$('#updateColor, #updateThre').click(function(){
		if( /iphone | ipad | android/i.test(nua) ){
			console.log('is mb');
			$('#hamber').removeClass('is-open');
			$('#mbbox, #nav-masker').hide()
		}
	})
	// ----------------------------
	// demo v
	// ----------------------------
	// $('.log-color.log-btn').click();
})