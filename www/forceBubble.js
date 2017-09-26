/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */


// Message to make it "readable" by shiny.
// jsondata is the message name
Shiny.addCustomMessageHandler("jsondata",
function(message){
d3.select("svg").remove();

//var id = '#vizBubble';
// message represents data from R
var data = message;

//function to draw bubble chart
function bubbleChart() {
  // Constants for sizing
  //var width = 940;
  //var height = 500;

  if($( document ).width()<625){
  var width = $( document ).width()*0.90,
  height = $( document ).height()*0.8; }else {
    var width = $( document ).width()*0.90,
    height = $( document ).height()*0.7;
  }

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('gates_tooltip', 240);


  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  if($( document ).height()<625){
     var center = { x: width / 2, y: 1 * height / 9 };
  }else{
   var center = { x: width / 2, y: 3 * height / 9 };
   }





  // 1 and 0 represent the different values to separate centers
  if($( document ).width()<625){
  var neighborsCenters = {
    1: { x: width / 3, y: 2 * height / 6 },
    0: { x: 2 * width / 3, y: 2 * height / 6 }
  };}else{
    var neighborsCenters = {
      1: { x: width / 3, y: 2 * height / 4 },
      0: { x: 2 * width / 3, y: 2 * height / 4 }
    };}

  }

  // X locations of the year titles.
  if($( document ).width()<625){
    var neighborsTitleX = {
    "Neighbors": width / 3,
    "Others": 2 * width / 3
  };
  }else{
  var neighborsTitleX = {
    "Luxembourg's Neighbors": width / 3,
    "Other Countries": 2 * width / 3
  };}

  // @v4 strength to apply to the position forces
  var forceStrength = 0.08;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
   function charge(d) {
     return -Math.pow(d.radius, 2.0) * forceStrength;
   }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  // if($( document ).width()<625){

  //   var simulation = d3.forceSimulation()
  //     .velocityDecay(0.2)
  //     .force('x', d3.forceX().strength(forceStrength).x(center.x))
  //     .force('y', d3.forceY().strength(forceStrength).y(center.y))
  //     .force('charge', d3.forceManyBody().strength(charge))
  //     .force('collide', d3.forceCollide(function(d){return(d.radius+d.radius/4)}))
  //     .on('tick', ticked);
  // }else{

    var simulation = d3.forceSimulation()
      .velocityDecay(0.2)
      .force('x', d3.forceX().strength(forceStrength).x(center.x))
      .force('y', d3.forceY().strength(forceStrength).y(center.y))
      .force('charge', d3.forceManyBody().strength(charge))
      .force('collide', d3.forceCollide(function(d){return(d.radius+d.radius/4)}))
      .on('tick', ticked);

  // }

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  //immigration et emmigration



  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */


  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, vnodes) {
    // convert raw data into nodes data

    // Create a SVG element inside the provided selector
    // with desired size.

    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);


         if($( document ).width()<625){
           var label = svg.append("text")
                .attr("class", "year")
                .attr("text-anchor", "end")
                .attr("z-index", 100)
                .attr("y", height - 60)
                .attr("x", width- $( document ).width()*0.15)
       		 .attr("font-size", "7em")
                .text(1995);
	  var warn1 = svg.append("text")
         .attr("class", "warn")
         .attr("text-anchor", "end")
         .attr("y", height - 45)
         .attr("x", width- $( document ).width()*0.15)
		 .attr("font-size", "0.8em")
         .text("Mouseover the year to move forward");
	  var warn2 = svg.append("text")
	     .attr("class", "warn")
         .attr("text-anchor", "end")
         .attr("y", height-30 )
         .attr("x", width- $( document ).width()*0.18)
		 .attr("font-size", "0.8em")
         .text("and backwards through time.");}else{
           var label = svg.append("text")
                .attr("class", "year")
                .attr("text-anchor", "end")
                .attr("y", height - 60)
                .attr("x", width- $( document ).width()*0.15)
       		 .attr("font-size", "8em")
                .text(1995);
           var warn1 = svg.append("text")
                .attr("class", "warn")
                .attr("text-anchor", "end")
                .attr("y", height - 45)
                .attr("x", width- $( document ).width()*0.15)
       		 .attr("font-size", "1em")
                .text("Mouseover the year to move forward");
       	  var warn2 = svg.append("text")
       	     .attr("class", "warn")
                .attr("text-anchor", "end")
                .attr("y", height -30)
                .attr("x", width- $( document ).width()*0.18)
       		 .attr("font-size", "1em")
                .text("and backwards through time.");
         }


	 var nodes = vnodes.filter(function(d){return d.year==d3.select(".year").text();});

		   // Add an overlay for the year label.
  var box = label.node().getBBox();
  // if($( document ).width()<625){
  //   var overlay = svg.append("rect")
  //         .attr("class", "overlay")
  //         .attr("x", box.x)
  //         .attr("y", box.y)
  //         .attr("width", box.width)
  //         .attr("height", box.height)
  // 		.attr("fill", "transparent")
  //         .on("mouseover", enableInteraction);
  // }else{
  var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
		.attr("fill", "transparent")
        .on("mouseover", enableInteraction);
		// }


		 // After the transition finishes, you can mouseover to change the year.
  function enableInteraction() {
    var yearScale = d3.scaleLinear()
        .domain([1982, 2009])
        .range([box.x + 10, box.x + box.width - 10])
        .clamp(true);

    // Cancel the current transition, if any.
    svg.transition().duration(0);

    overlay
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)
        .on("touchmove", mousemove);

    function mouseover() {
      label.classed("active", true);
    }

    function mouseout() {
      label.classed("active", false);
    }

    function mousemove() {
      displayYear(yearScale.invert(d3.mouse(this)[0]));
    }
  }
  if($( document ).width()<625){
    function displayYear(year) {
	      label.text(d3.format(".0f")(year));
		  d3.selectAll('.bubble')
		      .data(data.filter(function(d){return d.year==d3.format(".0f")(year);}), function (d) { return d.country; })
		      .attr('r', function (d) { return d.radius/1.5; })
			  .attr('value', function (d) { return d.value; })
			  .data(data.filter(function(d){return d.year==1995;}), function (d) { return d.country; })
		//chart(selector, data.filter(function(d){return d.year==label.text();}));

	  }
  function position(bubbles) {
    bubbles .attr('r', function (d) { return d.radius/1.5; });
  }
  }else{
      function displayYear(year) {
  	      label.text(d3.format(".0f")(year));
  		  d3.selectAll('.bubble')
  		      .data(data.filter(function(d){return d.year==d3.format(".0f")(year);}), function (d) { return d.country; })
  		      .attr('r', function (d) { return d.radius; })
  			  .attr('value', function (d) { return d.value; })
  			  .data(data.filter(function(d){return d.year==1995;}), function (d) { return d.country; })
  		//chart(selector, data.filter(function(d){return d.year==label.text();}));

  	  }
    function position(bubbles) {
      bubbles .attr('r', function (d) { return d.radius; });
    }}






    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.country; });



    svg.append("defs")
        .selectAll("country-pattern")
        .data(nodes, function (d) { return d.country; })
        .enter()
        .append("pattern")
        .attr("class", "country-pattern")
        .attr("id",function(d){return d.country.toLowerCase().replace(/ /g, "_").replace("(", "").replace(")", "_");})
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("position", "fixed")
        //.attr("max-width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://www.w#.org/1999/xlink")
        .attr("xlink:href", function(d){return d.pathPhoto})

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('value', function (d) { return d.value; })
      .attr('fill', function (d) { return "url(#"+d.country.toLowerCase().replace(/ /g, "_").replace("(", "").replace(")", "_")+")"; })
      .attr('stroke', "white")
      .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles
    //.transition()
    //.duration(3000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  /*
   * Provides a x value for each node to be used with the split by year
   * x force.
   */
  function nodeNeighborsPos(d) {
    return neighborsCenters[d.isNeighbor].x;
  }


  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideNeighborsTitles();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Sets visualization in "split by year mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * yearCenter of their data's year.
   */
  function splitBubbles() {
    showNeighborsTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeNeighborsPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  /*
   * Hides Year title displays.
   */
  function hideNeighborsTitles() {
    svg.selectAll('.neighbors').remove();
  }

  /*
   * Shows Year title displays.
   */
  function showNeighborsTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var neighborsData = d3.keys(neighborsTitleX);
    var neighbors = svg.selectAll('.neighbors')
      .data(neighborsData);

    neighbors.enter().append('text')
      .attr('class', 'neighbors')
      .attr('x', function (d) { return neighborsTitleX[d]; })
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">From: </span><span class="value">' +
                  d.country +
                  '</span><br/>' +
                  '<span class="name">Population: </span><span class="value">' +
                  addCommas(d3.select(this).attr('value')) +
                  '</span><br/>'; //+
                  //'<span class="name">Year: </span><span class="value">' +
                  //d.year +
                  //'</span>';

    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', "white");

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by country" modes.
   *
   * displayName is expected to be a string and either 'split' or 'all'.
   */

  chart.toggleDisplay = function (displayName) {
    if (displayName === 'all') {
      splitBubbles();
	  var e = document.getElementById('all');
          e.id = 'split'
    } else {
      groupBubbles();
	  var e = document.getElementById('split');
          e.id = 'all'

    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();
myBubbleChart('#vizBubble', data);


/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.slider')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.slider').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}



// setup the buttons.
setupButtons();
})
