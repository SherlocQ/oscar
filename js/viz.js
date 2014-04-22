var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";

  var width = 940,
    height = 600,
    tooltip = CustomTooltip("tooltip", 240),
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

  var fill_color = d3.scale.category20c();

  function custom_chart(data) {
    data = data.slice(1, 504);
    var max_amount = d3.max(data, function(d) {
      return parseInt(d.imdbVotes, 10);
    });
    radius_scale = d3.scale.pow().exponent(0.9).domain([0, max_amount]).range([2, 56]);

    data.forEach(function(d) {
      var node = {
        id: d.imdbID,
        radius: radius_scale(isNaN(d.imdbVotes) ? parseInt(d.imdbVotes) : 0),
        value: d.imdbVotes,
        name: d.Title,
        rating: d.imdbRating,
        group: d.Genre.split(",")[0],
        year: d.Year,
        poster: d.Poster,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
      nodes.push(node);
    });

    nodes.sort(function(a, b) {
      return b.value - a.value;
    });

    vis = d3.select("#vis").append("svg")
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
      .attr("stroke-width", 1)
      .attr("stroke", function(d) {
        return d3.rgb(fill_color(d.group)).darker();
      })
      .attr("id", function(d) {
        return "bubble_" + d.id;
      })
      .on("mouseover", function(d, i) {
        show_details(d, i, this);
      })
      .on("mouseout", function(d, i) {
        hide_details(d, i, this);
      });

    circles.transition().duration(2000).attr("r", function(d) {
      return d.radius;
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
    // vis.attr('height', '600');
    return function(d) {
      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
    };
  }

  function display_by_genre() {
    // vis.attr('height', '640');
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

  var other_genres = ["Short", "Western", "Horror", "Musical", "File-Noir", "Fantasy", "Mystery", "Music", "Family", "Roamnce"];

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
      "Biography": 160,
      "Comedy": 160,
      "Adventure": 160,
      "Drama": 510,
      "Crime": 510,
      "Action": 510,
      "Animation": 600,
      "Others": 600
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
    var content = "<img class=\"poster\" src=" + data.poster + "></br>";
    content += "<span class=\"name\">Title:</span><span class=\"value\"> " + data.name + "</span><br/>";
    content += "<span class=\"name\">Amount:</span><span class=\"value\"> $" + (addCommas(data.value)) + "</span><br/>";
    content += "<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span></br>";
    content += "<span class=\"name\">Genre:</span><span class=\"value\"> " + data.group + "</span></br>";
    tooltip.showTooltip(content, d3.event);
  }

  function hide_details(data, i, element) {
    d3.select(element).attr("stroke", function(d) {
      return d3.rgb(fill_color(d.group)).darker();
    });
    d3.select(element).attr("stroke-width", "1");
    tooltip.hideTooltip();
  }

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