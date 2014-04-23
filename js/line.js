  function processData(data) {
    var timeLs = [],
      ls1 = [],
      ls2 = [],
      ls3 = [],
      ls4 = [],
      ls = [];
    timeLs.push('x');
    ls1.push('rating');
    ls2.push('budget(m)');
    ls3.push('gross(m)');
    ls4.push('vote(k)');
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
      data: {
        x: 'x',
        columns: ls,
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            fit: true,
            format: '%Y'
          }
        }
      },
      subchart: {
        show: true
      },
      zoom: {
        enabled: true
      },
      tooltip: {
        format: {
          value: function(d) {
            return d;
          }
        }
      },
      color: {
        pattern: ["#abd9e9", "#f49779", "#fdae61", "#66c2a5"]
      }
    });
  }

  $(document).ready(function() {
    var all_data;
    d3.json("data/average.json", function(data) {
      all_data = $.extend(true, {}, data);
      initChart(data);
    });
    $('#sidebar_toggle').sidr({
      name: 'sidr-left',
      source: '#sidr'
    });
    console.log($('g.c3-brush').next());
  });