function processData(_path) {
  var path = 'data/' + _path + '.json';
  d3.json(path, function(data) {
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
      ls1.push(parseFloat(val.Average[0]).toFixed(2));
      ls2.push(parseFloat(val.Average[1]).toFixed(2));
      ls3.push(parseFloat(val.Average[2]).toFixed(2));
      ls4.push((parseFloat(val.Average[3] / 1000)).toFixed(2));
    });
    ls.push(timeLs);
    ls.push(ls1);
    ls.push(ls2);
    ls.push(ls3);
    ls.push(ls4);
    initChart(ls);
  });
}

function initChart(data) {
  var chart = c3.generate({
    size: {
      height: 500,
    },
    data: {
      x: 'year',
      x_format: '%Y',
      columns: data,
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
    if (i % 9 == 0) {
      $(text[i]).show();
    }
  };
  $($($('.c3-axis-x')[1]).find('text')[0]).show();
  $('li#line').on('click', function(event) {
    event.preventDefault();
    chart.toLine();
  });
  $('li#area').on('click', function(event) {
    event.preventDefault();
    chart.toArea();
  });
  $('li#spline').on('click', function(event) {
    event.preventDefault();
    chart.toSpline();
  });
  $('li#spline-area').on('click', function(event) {
    event.preventDefault();
    chart.toAreaSpline();
  });
}

$(document).ready(function() {
  processData('all');
  $('button#all').on('click', function(event) {
    event.preventDefault();
    console.log('all');
    processData('all');    
  });
  $('button#nominee').on('click', function(event) {
    event.preventDefault();
    console.log('nominee');
    processData('nominee');
  });
});