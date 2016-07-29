$(document).ready(function() {
  $('.section--stylesheet .mdl-menu__item').click(function() {
    var action = $(this).data("action");

    console.log($(this).data("action"));
    if (action === "all") {
      $(this).closest('.section--stylesheet').find('.selector-container').show();
      console.log('done');
    }
    else {
      $(this).closest('.section--stylesheet').find('.selector-container').hide();
      $(this).closest('.section--stylesheet').find('.selector-container[data-count="0"]').show();
    }
  });

  //because i'm lazy
  $('.section--stylesheet .mdl-button').click(function() {
    var action = $(this).data("action");

    if (action === "view-more") {
      $(this).closest('.section--stylesheet').find(".selectors-container").toggle();
    }
  });

});
