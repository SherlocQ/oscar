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
});

function addCommas(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}