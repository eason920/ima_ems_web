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

  $('.sys-close').click(function(){
    $('#sys-masker, .sys-color, .sys-area, .sys-login').hide();
  })

})