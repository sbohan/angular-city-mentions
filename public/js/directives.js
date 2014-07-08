'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }).
  directive('sbFrequencyMap', function(){
  	return {
	restrict: 'E',
	link: function(scope, elm, attrs){


		var getFrequencyCount = function(city){
			city = city.toLowerCase();
			if(scope.frequency.hasOwnProperty(city)){
				return scope.frequency[city];
			}else{
				return 0;
			}
		};


  		var width = 960,
		    height = 1160;

		var projection = d3.geo.albers()
		    .center([0, 55.4])
		    .rotate([4.4, 0])
		    .parallels([50, 60])
		    .scale(1200 * 5)
		    .translate([width / 2, height / 2]);

		var path = d3.geo.path()
		    .projection(projection)
		    .pointRadius(2);

		var svg = d3.select("#mapView").append("svg")
		.attr("width", width)
    	.attr("height", height);

		// var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		// svg.setAttribute( 'width', width + '' );
		// svg.setAttribute( 'height', height + '' );
		// elm.append( svg );

		d3.json("/json/uk.json", function(error, uk) {
		  var subunits = topojson.feature(uk, uk.objects.subunits),
		      places = topojson.feature(uk, uk.objects.places);

		  svg.selectAll(".subunit")
		      .data(subunits.features)
		    .enter().append("path")
		      .attr("class", function(d) { return "subunit " + d.id; })
		      .attr("d", path);

		  svg.append("path")
		      .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
		      .attr("d", path)
		      .attr("class", "subunit-boundary");

		  svg.append("path")
		      .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
		      .attr("d", path)
		      .attr("class", "subunit-boundary IRL");

		  svg.selectAll(".subunit-label")
		      .data(subunits.features)
		    .enter().append("text")
		      .attr("class", function(d) { return "subunit-label " + d.id; })
		      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		      .attr("dy", ".35em")
		      .text(function(d) { return d.properties.name; });

		  svg.selectAll(".place-label")
		    .data(places.features)
	    	.enter()
		    .append("text")
		      .attr("class", "place-label")
		      .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
		      .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
		      .attr("dy", ".35em")
		      .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
		      .text(function(d) { return d.properties.name; });

		    //.						   .enter()
		svg.selectAll(".place")
		.data(places.features)
		.enter()
		   .append("circle")
		   .attr("cx", function(d) {
			   return projection(d.geometry.coordinates)[0];
		   })
		   .attr("cy", function(d) {
			   return projection(d.geometry.coordinates)[1];
		   })
		   .attr("r", function(d) {
				return Math.sqrt(parseInt(10000) * 0.004);
		   })

		.style("fill", function(d) {
	   		return "#008837";
	  	 })
	   .style("stroke-width", "1")
	   //Set circle stroke color to "type" value
	   .style("stroke", "#222")
	   .style("opacity", 0.8)
		.on("mouseover", function(d) {   //Add tooltip on mouseover for each circle
					//Get this circle's x/y values, then augment for the tooltip
					var xPosition = d3.select(this).attr("cx");
					var yPosition = d3.select(this).attr("cy");

					//Update the tooltip position and value
					d3.select("#tooltip")
						//Show the tooltip above where the mouse triggers the event
						.style("left", (d3.event.pageX) + "px")
    					.style("top", (d3.event.pageY - 90) + "px")
						.select("#city-label")
						//.html("<strong>" + d.place + "</strong>" + "<br/>" + "population: " + d.population + "<br/>" + "pop. / sq mi: " + d.density)
						.html("<strong>"+d.properties.name+"</strong><br/>Mentions: "+getFrequencyCount(d.properties.name));

					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);

			   })
			   .on("mouseout", function() {

					//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);

			   });

		})
  	}
  	};
  });
