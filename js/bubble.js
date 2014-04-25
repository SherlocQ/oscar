d3.json("data/movie_data.json", function(data) {
  custom_bubble_chart.init(data);
  custom_bubble_chart.toggle_view('all');
});

var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";

  var width = 940,
    height = 600,
    tooltip = CustomTooltip("bubble-tooltip", 240),
    layout_gravity = -0.01,
    damper = 0.1,
    nodes = [],
    vis, force, circles, radius_scale;

  var center = {
    x: width / 2,
    y: height / 2
  };

  var genre_centers = {
    "Biography": {
      x: width / 3,
      y: height / 3
    },
    "Comedy": {
      x: width / 2,
      y: height / 3
    },
    "Adventure": {
      x: 2 * width / 3,
      y: height / 3
    },
    "Drama": {
      x: width / 3,
      y: height / 2
    },
    "Crime": {
      x: width / 2,
      y: height / 2
    },
    "Action": {
      x: 2 * width / 3,
      y: height / 2
    },
    "Animation": {
      x: width / 3,
      y: 2 * height / 3
    },
    "Short": {
      x: width / 2,
      y: 2 * height / 3
    },
    "Western": {
      x: width / 2,
      y: 2 * height / 3
    },
    "Horror": {
      x: width / 2,
      y: 2 * height / 3
    },
    "Musical": {
      x: width / 2,
      y: height
    },
    "Film-Noir": {
      x: width / 2,
      y: 2 * height / 3
    },
    "Fantasy": {
      x: width / 2,
      y: 2 * height / 3
    },
    "Mystery": {
      x: width / 2,
      y: 2 * height / 3
    },
    "Music": {
      x: width / 2,
      y: 2 * height / 3
    },
    "Family": {
      x: width / 2,
      y: 2 * height / 3
    },
    "Romance": {
      x: width / 2,
      y: 2 * height / 3
    },
  };

  var fill_color = d3.scale.ordinal()
    .domain(["Biography", "Comedy", "Adventure", "Drama", "Crime", "Action", "Animation", "Horror", "Music", "Western", "Family", "Mystery", "Fantasy", "Romance", "Film-Noir"])
    .range(["#F1BBBA", "#f49779", "#fee08b", "#abdda4", "#fdae61", "#abd9e9", "#e6f598", "#66c2a5", "#66c2a5", "#66c2a5", "#66c2a5", "#66c2a5", "#66c2a5", "#66c2a5", "#66c2a5"]);

  function custom_chart(data) {
    data = data.slice(1, 504);
    var max_amount = d3.max(data, function(d) {
      return parseInt(d.gross, 10);
    });
    radius_scale = d3.scale.pow().exponent(0.7).domain([0, max_amount]).range([2, 80]);

    data.forEach(function(d) {
      var node = {
        id: d.imdbID,
        radius: radius_scale(d.gross),
        value: d.gross,
        name: d.Title,
        rating: d.imdbRating,
        budget: d.budget,
        gross: d.gross,
        profit: d.gross - d.budget,
        group: d.Genre.split(",")[0],
        year: d.Year,
        poster: d.Img,
        winning: d.Oscar_winner,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
      nodes.push(node);
    });

    nodes.sort(function(a, b) {
      return b.value - a.value;
    });

    vis = d3.select("#bubble").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "svg_vis");

    circles = vis.selectAll("circle")
      .data(nodes, function(d) {
        return d.id;
      });

    circles.enter().append("circle")
      .attr("r", 0)
      .attr("fill", function(d) {
        return fill_color(d.group);
      })
      .attr("stroke-width", function(d) {
        return d.winning == 'YES' ? 2 : 1;
      })
      .attr("stroke", function(d) {
        return d.winning == 'YES' ? '#FFFF81' : d3.rgb(fill_color(d.group)).darker();
      })
      .attr("id", function(d) {
        return "bubble_" + d.id;
      })
      .style("fill-opacity", 0.8)
      .on("mouseover", function(d, i) {
        show_details(d, i, this);
        // d3.select(this)
        //   .attr({
        //     "stroke": function(d) {
        //       return d.winning == 'YES' ? '#FFFF81' : 'black'
        //     }
        //   });
      })
      .on("mouseout", function(d, i) {
        hide_details(d, i, this);
      });

    circles.transition().duration(2000).attr("r", function(d) {
      return d.radius;
    });

    var legend_bubble = d3.select('#legend-bubble')
      .append('ul')
      .attr('class', 'list-inline');

    var keys = legend_bubble.selectAll('li.key')
      .data(fill_color.range().slice(0, 8));
	  
    var genre_ls = ["Biography", "Comedy", "Adventure", "Drama", "Crime", "Action", "Animation", "Others"];
    keys.enter().append('li')
      .attr('class', 'key')
      .style('border-top-color', String)
      .text(function(d, i) {
        return genre_ls[i];
      });
	  
	$('#legend-bubble ul').prepend('<li class="key-winner"></li><div class="winner"><span>Winner</span></div>');  
	$('#legend-bubble ul').prepend('<li class="key-radius"></li><div class="radius"><span>Gross</span></div>');
	
	$(window).scroll(function(){
		if(document.body.scrollTop <= 670){
			$('#legend-bubble').css('position','fixed');
			$('#legend-bubble').css('top','150px');
		}else{
			$('#legend-bubble').css('position','absolute');
			$('#legend-bubble').css('top','820px');
		}
	});

  }

  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  }

  function start() {
    force = d3.layout.force()
      .nodes(nodes)
      .size([width, height]);
  }

  function display_group_all() {
    force.gravity(layout_gravity)
      .charge(charge)
      .friction(0.9)
      .on("tick", function(e) {
        circles.each(move_towards_center(e.alpha))
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
      });
    force.start();
    hide_genres();
  }

  function move_towards_center(alpha) {
    return function(d) {
      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
    };
  }

  function display_by_genre() {
    force.gravity(layout_gravity)
      .charge(charge)
      .friction(0.9)
      .on("tick", function(e) {
        circles.each(move_towards_genre(e.alpha))
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
      });
    force.start();
    display_genres();
  }

  function move_towards_genre(alpha) {
    return function(d) {
      var target = genre_centers[d.group];
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
    };
  }

  function display_genres() {
    var genres_x = {
      "Biography": 240,
      "Comedy": width / 2,
      "Adventure": width - 240,
      "Drama": 240,
      "Crime": width / 2,
      "Action": width - 240,
      "Animation": 240,
      "Others": width / 2
    };
    var genres_y = {
      "Biography": 165,
      "Comedy": 205,
      "Adventure": 185,
      "Drama": 470,
      "Crime": 450,
      "Action": 500,
      "Animation": 600,
      "Others": 580
    };
    var genres_data = d3.keys(genres_x);
    var genres = vis.selectAll(".genres")
      .data(genres_data);

    genres.enter().append("text")
      .attr("class", "genres")
      .attr("x", function(d) {
        return genres_x[d];
      })
      .attr("y", function(d) {
        return genres_y[d];
      })
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d;
      });

  }

  function hide_genres() {
    var genres = vis.selectAll(".genres").remove();
  }

  function show_details(data, i, element) {
    d3.select(element).attr("stroke", "black");
    d3.select(element).attr("stroke-width", "2");
    var content = "<img class=\"name poster\" src=" + data.poster + "></br>";
    content += "<span class=\"name\">Title:</span><span class=\"value\"> " + data.name + "</span><br/>";
    content += "<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span></br>";
    content += "<span class=\"name\">Gross:</span><span class=\"value\"> $" + data.value.formatMoney(2) + "</span><br/>";
    content += "<span class=\"name\">Rating:</span><span class=\"value\"> " + data.rating + "</span><br/>";
    content += "<span class=\"name\">Genre:</span><span class=\"value\"> " + data.group + "</span></br>"
    content += "<span class=\"name\">Winner:</span><span class=\"value\"> " + data.winning + "</span></br>";
    tooltip.showTooltip(content, d3.event);
  }

  function hide_details(data, i, element) {
    d3.select(element)
      .attr("stroke-width", function(d) {
        return d.winning == 'YES' ? 2 : 1;
      })
      .attr("stroke", function(d) {
        return d.winning == 'YES' ? '#FFFF81' : d3.rgb(fill_color(d.group)).darker();
      })
    tooltip.hideTooltip();
  }

  Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
      c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };

  var my_mod = {};
  my_mod.init = function(_data) {
    custom_chart(_data);
    start();
  };

  my_mod.display_all = display_group_all;
  my_mod.display_genre = display_by_genre;
  my_mod.toggle_view = function(view_type) {
    if (view_type == 'genre') {
      display_by_genre();
    } else {
      display_group_all();
    }
  };

  return my_mod;
})(d3, CustomTooltip);