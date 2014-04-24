  function processData(data) {
    var timeLs = [],
      ls1 = [],
      ls2 = [],
      ls3 = [],
      ls4 = [],
      ls = [];
    timeLs.push('year');
    ls1.push('rating');
    ls2.push('budget (m)');
    ls3.push('gross (m)');
    ls4.push('vote (k)');
    $.each(data, function(index, val) {
      timeLs.push(index);
      ls1.push(val.Average[0].toFixed(2));
      ls2.push(val.Average[1].toFixed(2));
      ls3.push(val.Average[2].toFixed(2));
      ls4.push((val.Average[3] / 1000).toFixed(2));
    });
    ls.push(timeLs);
    ls.push(ls1);
    ls.push(ls2);
    ls.push(ls3);
    ls.push(ls4);
    return ls;
  }

  function initChart(data) {
    var ls = processData(data);
    var chart = c3.generate({
      size: {
        height: 500,
      },    
      data: {
        x: 'year',
        x_format: '%Y',
        columns: ls,
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            culling: {
              max: 10
            },
            fit: true,
            format: '%Y'
          },
          label: 'Year'
        },
        y: {
          label: 'Count'
        }
      },
      subchart: {
        show: true,
      },
      color: {
        pattern: ["#abd9e9", "#f49779", "#fdae61", "#66c2a5"]
      }
    });
    $($('.c3-axis-x')[1]).find('text').hide();
    var text = $($('.c3-axis-x')[1]).find('text');
    for (var i = 0, len = text.length - 1; i < len; i++) {
      if(i % 9 == 0) {
        $(text[i]).show();
      }
    };
    $($($('.c3-axis-x')[1]).find('text')[0]).show();
  }

  $(document).ready(function() {
    var all_data;
    d3.json("data/average.json", function(data) {
      all_data = $.extend(true, {}, data);
      initChart(data);
    });
  });