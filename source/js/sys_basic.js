const fnHide = function(){
	$('#sys-masker, .sys-color, .sys-area, .sys-login').hide();
};

const loginFalseUI = ()=>{
	$('.sys-login, #sys-masker').show();
	$('.log-in').css("display","flex")
	$('.log-color, .log-area, .log-out').hide()
};

const loginTrueUI = ()=> {
	$('.log-in, .sys-login, #sys-masker').hide()
	$('.log-msg, .log-out, .log-color, .log-area').css('display','inline-flex');
}

$(()=>{
	// 1101130 登入版本 
	const IMSCK = document.cookie.replace(/(?:(?:^|.*;\s*)IMSgtCK\s*=\s*([^;]*).*$)|^.*$/, '$1');
	console.log('cookie is ', IMSCK, IMSCK === "true");
	
	IMSCK === "true" ? loginTrueUI() : loginFalseUI();
	// if( IMSCK === "true" ){
	// 	loginTrueUI();
	// }else{
	// 	loginFalseUI();
	// }

	$('#sys-btn-login').click(function(){
		const url = 'https://dash.ima-ems.com/api/user/login';
		const email = $('#loginAcc').val();
		const password = $('#loginPW').val();
		const data = JSON.stringify({email,password});
		// console.log('send data is ', data);
		$.ajax({
			type: 'POST',
			url,
			data,
			contentType: 'application/json',
			dataType: 'json',
			success: function(res){
				console.log('success is ', res);
				loginTrueUI();
				const expired = new Date().getTime() + (1000 * 60 * 60 * -8) + (1000 * 10 * 360 * 3) // 1000 = 0:01 // 8 為時差
				document.cookie = `IMSgtCK=true;expires=${new Date(expired)}`
			},
			error: function(err){
				console.log('error is ', err);
			}
		});
	});

	// --------------------------------
	// --------------------------------
	$('.log-color, .log-area, .log-in, .col-limit[data-for="fix"]').click(function(){
		$('#sys-masker').show();
	});

	$('.log-color').click(function(){
		$('.sys-color').show();
	});

	$('.log-area, .col-limit[data-for="fix"]').click(function(){
		$('.sys-area').show();
	});

	$('.log-in').click(function(){
		$('.sys-login').show();
	});

	$('.log-out').click(()=>{
		// loginFalseUI();
		document.cookie = `IMSgtCK=false;expires=Thu, 21 Aug 2014 20:00:00 UTC`
		location.reload();
	})

	$('.sys-close').click(function(){
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