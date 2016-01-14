//Needs JQuery

$('.thumbnail img').error(function(){
  $(this).parent().parent().attr('style', 'opacity:0;')
});

$('img').error(function(){
  $(this).attr('style', 'display: none;')
});
