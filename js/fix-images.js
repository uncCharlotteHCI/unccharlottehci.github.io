//Needs JQuery

$('.thumbnail img').error(function(){
  $(this).attr('src', 'http://localhost:4000/images/question.png');
  $(this).parent().parent().attr('style', 'opacity:0;')
});
