/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

function RadarChart(id, data, options) {
  var cfg = {
    w: 200, //Width of the circle
    h: 200, //Height of the circle
    margin: { top: 0, right: 10, bottom: 0, left: 10 }, //The margins of the SVG
    levels: 10, //How many levels or inner circles should there be drawn
    maxValue: 100, //What is the value that the biggest circle will represent
    labelFactor: 1.15, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.45, //The opacity of the area of the blob
    dotRadius: 4, //The size of the colored circles of each blog
    opacityCircles: 0.6, //The opacity of the circles of each blob
    opacity: d3.scale.category10(),
    strokeWidth: 2, //The width of the stroke around each blob
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scale.category10(), //Color function
  };

  //Put all of the options into a variable called cfg
  if ("undefined" !== typeof options) {
    for (var i in options) {
      if ("undefined" !== typeof options[i]) {
        cfg[i] = options[i];
      }
    } //for i
  } //if

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(
    cfg.maxValue,
    d3.max(data, function (i) {
      return d3.max(
        i.map(function (o) {
          return o.value;
        })
      );
    })
  );

  var allAxis = data[0].map(function (i, j) {
      return i.axis;
    }), //Names of each axis
    total = allAxis.length, //The number of different axes
    radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
    Format = d3.format("%"), //Percentage formatting
    angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

  //Scale for the radius
  var rScale = d3.scale.linear().range([0, radius]).domain([0, maxValue]);

  /////////////////////////////////////////////////////////
  //////////// Create the container SVG and g /////////////
  /////////////////////////////////////////////////////////

  //Remove whatever chart with the same id/class was present before
  d3.select(id).select("svg").remove();

  //Initiate the radar chart SVG
  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
    .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr("class", "radar" + id);
  //Append a g element
  var g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (cfg.w / 2 + cfg.margin.left) +
        "," +
        (cfg.h / 2 + cfg.margin.top) +
        ")"
    );

  /////////////////////////////////////////////////////////
  /////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////

  //Wrapper for the grid & axes
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  axisGrid
    .append("svg:defs")
    .append("svg:pattern")
    .attr("id", "circle_background")
    .attr("width", cfg.w / 2)
    .attr("height", cfg.h / 2)
    .append("svg:image")
    .attr("xlink:href", "/imgs/huewheel.png")
    .attr("width", cfg.w)
    .attr("height", cfg.h)
    .attr("x", 0)
    .attr("y", 0);

  //Draw the background circles
  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function (d, i) {
      return (radius / cfg.levels) * d;
    })
    // .style("fill", "url(#circle_background)")
    .style("fill", function (d) {
      if (d == cfg.levels) {
        return "url(#circle_background)";
      } else {
        return "transparent";
      }
    })
    .style("stroke", "#eee")
    .style("fill-opacity", cfg.opacityCircles);

  //Text indicating at what % each level is
  axisGrid
    .selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function (d) {
      return (-d * radius) / cfg.levels;
    })
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "#000")
    .text(function (d, i) {
      return Format((maxValue * d) / cfg.levels);
    });

  /////////////////////////////////////////////////////////
  //////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////

  //Create the straight lines radiating outward from the center
  var axis = axisGrid
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");
  //Append the lines
  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr("class", "line")
    .style("stroke", "lightgray")
    .style("stroke-width", "2px");

  //Append the labels at each axis
  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function (d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.cos(angleSlice * i - Math.PI / 2)
      );
    })
    .attr("y", function (d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.sin(angleSlice * i - Math.PI / 2)
      );
    })
    .text(function (d) {
      return d;
    })
    .call(wrap, cfg.wrapWidth);

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  var radarLine = d3.svg.line
    .radial()
    .interpolate("linear-closed")
    .radius(function (d) {
      return rScale(d.value);
    })
    .angle(function (d, i) {
      return i * angleSlice;
    });

  if (cfg.roundStrokes) {
    radarLine.interpolate("cardinal-closed");
  }

  var tooltipA = d3.select(".radarchart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltipA")
    .style("background-color", "white")
    .style("position", "fixed")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("text-align", "left")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("padding", "10px");

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function (d) {
    tooltipA
      .style("opacity", 1)
  }

  var mousemove = function (d) {
    tooltipA
      .html("<strong>Painting: </strong>" + d[0].title + "<br> <strong>Artist: </strong>" + d[0].artist)
      .style("left", (d3.mouse(this)[0] + 300) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1] + 350) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function (d) {
    tooltipA
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  //Create a wrapper for the blobs
  var blobWrapper = g
    .selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  //Append the backgrounds
  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("fill", function (d, i) {
      return cfg.color(i);
    })
    .style("fill-opacity", cfg.opacityArea)
    .on("mouseover", function (d, i) {
      //Dim all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.1);
      
      //Bring back the hovered over blob
      d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
    })
    .on("mouseout", function () {
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  //Create the outlines
  blobWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function (d, i) {
      return cfg.color(i);
    })
    .style("opacity", function (d, i) {
      return cfg.opacity(i);
    })
    .style("fill", "none");

  //Append the circles
  blobWrapper
    .selectAll(".radarCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", function (d, i, j) {
      return cfg.color(j);
    })
    .style("fill-opacity", function (d, i, j) {
      return cfg.opacity(j);
    });

  /////////////////////////////////////////////////////////
  //////// Append invisible circles for tooltip ///////////
  /////////////////////////////////////////////////////////

  var tooltipB = d3.select(".radarchart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltipB")
    .style("background-color", "white")
    .style("position", "fixed")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("text-align", "left")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("padding", "10px");

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseoverA = function (d) {
    tooltipB
      .style("opacity", 1)
  }

  var mousemoveA = function (d, i) {
    tooltipB
      .html("<strong>Painting: </strong>" + d.title + "<br> <strong>Artist: </strong>" + d.artist + "<br><strong>Percentage of " + d.axis + ": </strong>" + Format(d.value))
      .style("left", (d3.mouse(this)[0] + 420) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1] + 350) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleaveA = function (d) {
    tooltipB
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  //Wrapper for the invisible circles on top
  var blobCircleWrapper = g
    .selectAll(".radarCircleWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper
    .selectAll(".radarInvisibleCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", mouseoverA)
    .on("mousemove", mousemoveA)
    .on("mouseleave", mouseleaveA);

  /////////////////////////////////////////////////////////
  /////////////////// Helper Function /////////////////////
  /////////////////////////////////////////////////////////

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text
  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  } //wrap
} //RadarChart

/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////

var margin = { top: 50, right: 100, bottom: 100, left: 100 },
  width = Math.min(600, window.innerWidth - 10) - margin.left - margin.right,
  height = Math.min(
    width,
    window.innerHeight - margin.top - margin.bottom - 20
  );

//////////////////////////////////////////////////////////////
////////////////////////// Data //////////////////////////////
//////////////////////////////////////////////////////////////

var data2;
document.addEventListener('DOMContentLoaded', function() {
  var comparisons = JSON.parse(localStorage.getItem('current-comparisons'));
  data2 = populateRadarData(comparisons);
  populateTitles(comparisons);
  populateSelectionSidebar(comparisons);

  var color = d3.scale.ordinal().range(populateRange(data2.length, "#111", "whitesmoke"));
  var opacity = d3.scale.ordinal().range(populateRange(data2.length, 0.9, 0.7));

  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,
    levels: 10,
    roundStrokes: true,
    color: color,
    opacity: opacity,
  };
  //Call function to draw the Radar chart
  RadarChart(".radarChart", data2, radarChartOptions);
});

// uses the data provided from search page to populate the radar chart's data
function populateRadarData(paintings) {
  var data = [];
  var colorArray = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Black"];

  // JSON values are  ROYGBPG
  // RADAR values are ROYGBPG
  paintings.forEach(p => {
    data.push([
      { axis: colorArray[0], value: p.radar[0], title: p.title, artist: p.author },
      { axis: colorArray[1], value: p.radar[1], title: p.title, artist: p.author },
      { axis: colorArray[2], value: p.radar[2], title: p.title, artist: p.author },
      { axis: colorArray[3], value: p.radar[3], title: p.title, artist: p.author },
      { axis: colorArray[4], value: p.radar[4], title: p.title, artist: p.author },
      { axis: colorArray[5], value: p.radar[5], title: p.title, artist: p.author },
      { axis: colorArray[6], value: p.radar[6], title: p.title, artist: p.author }]);
  });
  data.reverse();

  return data;
}

// used for generating the range of colors and opacities for the radar chart blobs
function populateRange(n, primary, secondary) {
  var range = [];
  for (var i = 0; i < n; i++) {
    if (i != n-1) {
      range.push(secondary);
    } else {
      range.push(primary);
    }
  }

  return range;
}

function populateTitles(paintings) {
  var title = document.getElementById("paintingTitle");
  var artist = document.getElementById("paintingArtist");
  if (paintings[0].selected) {
    title.innerHTML = paintings[0].title;
    artist.innerHTML = paintings[0].author;
  }
}

function populateSelectionSidebar(paintings) {
  var image = document.getElementById("selectedPaintingImage");
  var selectedList = document.getElementById("selectedList");

  if (paintings[0].selected) {
    image.innerHTML = `<img class="selectedImagePreview" src="${paintings[0].local_img}" 
    title="Click to view full" onclick="javascript:window.open('${paintings[0].local_img}', 'Image');" 
    >`
  }
    //onclick="${paintings[0].local_img}"

// TODO: put background color on selected/focus painting (if statement?)
  paintings.forEach(painting => {
    console.log(painting);
    const htmlString = paintings
      .map((painting) => {
        var backgroundColor = "#ffffff";
        if (painting.selected) {
          backgroundColor = "#eee";
        }
        return `
      <li style="background-color: ${backgroundColor}" class="selectedPainting">   
        <p>
          <img class="paintingimg2" src="${painting.local_img}">
          <div class="info">
            <span style="text-overflow:ellipsis; overflow:hidden;">
              <strong>${painting.title}</strong>
            </span> 
            <span style="float:right;">${painting.date}</span>
            <br /> 
            <span style="font-size:0.8rem"><i>${painting.author}</i></span>
            <span style="text-transform:capitalize; float:right;">${painting.painting_type}</span>
          </div>
        </p>
        <div class="palette">
          <div style="background-color:${painting.palette[0]}" class="smallbox" title="${painting.palette[0]}"><span class="tooltiptext">${painting.palette[0]}</span></div>
          <div style="background-color:${painting.palette[1]}" class="smallbox" title="${painting.palette[1]}"><span class="tooltiptext">${painting.palette[1]}</span></div>
          <div style="background-color:${painting.palette[2]}" class="smallbox" title="${painting.palette[2]}"><span class="tooltiptext">${painting.palette[2]}</span></div>
          <div style="background-color:${painting.palette[3]}" class="smallbox" title="${painting.palette[3]}"><span class="tooltiptext">${painting.palette[3]}</span></div>
          <div style="background-color:${painting.palette[4]}" class="smallbox" title="${painting.palette[4]}"><span class="tooltiptext">${painting.palette[4]}</span></div>
        </div>
      </li>
    `;
    })
    .join("");

    selectedList.innerHTML = htmlString;
  });
}

function helpPopupFunction() {
  var popup = document.getElementById("helpPopup");
  popup.classList.toggle("show");
}
