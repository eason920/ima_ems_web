$(()=>{
  $('.log-color, .log-area, .log-out').click(function(){
    $('#sys-masker').show();
  });

  $('.log-color').click(function(){
    $('.sys-color').show();
  });

  $('.log-area').click(function(){
    $('.sys-area').show();
  });

  $('.log-out').click(function(){
    $('.sys-login').show();
  });

  $('.sys-close, .sys-btn').click(function(){
    $('#sys-masker, .sys-color, .sys-area, .sys-login').hide();
  })

  // ----------------------------
  $('.sys-box.is-color').on('click', '.minicolors-item, .minicolors-swatch', function(){
    $(this).parent().siblings('.sys-sbtn').text('確定').css({'z-index': 999});
  });

  $('.sys-box.is-color').on('click', '.sys-sbtn', function(){
    $(this).text('修改').removeAttr('style');
  });

	// ----------------------------
	// demo v
	// ----------------------------
	// $('.log-color.log-btn').click();
})