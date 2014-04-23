d3.json("data/movie_data.json", function(data) {
  custom_bubble_chart.init(data);
  custom_bubble_chart.toggle_view('all');
});

$(document).ready(function() {
  $('#view_selection button').click(function() {
    var view_type = $(this).attr('id');
    $('#view_selection button').removeClass('active');
    $(this).toggleClass('active');
    custom_bubble_chart.toggle_view(view_type);
    return false;
  });

  $('#measure_selection button').click(function() {
    var measure_type = $(this).attr('id');
    $('#measure_selection button').removeClass('active');
    $(this).toggleClass('active');
    custom_bubble_chart.toggle_measure(measure_type);
    return false;
  });

  $('#sidebar_toggle').sidr({
    name: 'sidr-left',
    source: '#sidr'
  });
});