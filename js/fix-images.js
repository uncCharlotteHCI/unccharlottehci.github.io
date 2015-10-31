//Needs JQuery

$('.thumbnail img').error(function(){
  $(this).attr('src', '/images/question.png');
  $(this).parent().parent().attr('style', 'opacity:0;')
});
