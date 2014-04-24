$(document).ready(function() {
  $('#view_selection button').click(function() {
    var view_type = $(this).attr('id');
    $('#view_selection button').removeClass('active');
    $(this).toggleClass('active');
    custom_bubble_chart.toggle_view(view_type);
    return false;
  });

  $('#genre_selection button').click(function() {
    $('#genre_selection button').removeClass('active');
    $(this).toggleClass('active');
    return false;
  });

  $(".chzn-select").chosen();
  $("#genre-select").change(function() {
    var genres = $(this).val();
    var new_options = {
      "genres": genres
    };
    update_options(new_options);
  });
  $('.btn_filter').click(function() {
    var category = $(this).attr('id');
    var new_options = {
      "category": category
    };
    update_options(new_options);
  }); 
});