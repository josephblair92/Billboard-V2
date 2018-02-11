app.directive('artistTimelineGraph', function($window) {
	return {
		restrict: 'EA',
		template: "<svg class='graph-svg' width='700' height='500'></svg>",
		link: function(scope, elem, attrs) {

			var margins = {
				top: 20,
				right: 20,
				bottom: 100,
				left: 35
			};
			var width = 700;
			var height = 500;
			var pathClass = "path";
			var xScale, yScale, xAxisGen, yAxisGen, lineFunction;
				
			var d3 = $window.d3;
			var rawSvg = elem.find("svg")[0];
			var svg = d3.select(rawSvg);

			function dateStrToDate(dateStr) {
				var dateComponents = dateStr.split('-');
				date = new Date(dateComponents[0],dateComponents[1]-1,dateComponents[2]);
				//return date.getTime()/1000;
				return date;
			}	

			function getLowestPosition(chartedItems) {
				var lowestPosition = chartedItems[0].peak_position;
				for (var i = 0; i < chartedItems.length; i++) {
					if (chartedItems[i].peak_position > lowestPosition)
						lowestPosition = chartedItems[i].peak_position;
				}
				return lowestPosition;
			}

			function getLowestPositionMultiChart(chartData) {
				var lowestPositions = [];
				for (chartName in chartData) {
					if (chartData.hasOwnProperty(chartName)) {
						var chartedItems = chartData[chartName];
						if (chartedItems.length > 0) {
							lowestPositions.push(getLowestPosition(chartedItems));
						}
					}
				}
				return Math.max.apply(null, lowestPositions);
			}

			function getMinDateMultiChart(chartData) {
				var minDates = [];
				for (chartName in chartData) {
					if (chartData.hasOwnProperty(chartName)) {
						var chartedItems = chartData[chartName];
						if (chartedItems.length > 0) {
							minDates.push(dateStrToDate(chartedItems[0].peak_date).getTime());
						}
					}
				}
				return new Date(Math.min.apply(null, minDates));
			}

			function getMaxDateMultiChart(chartData) {
				var maxDates = [];
				for (chartName in chartData) {
					if (chartData.hasOwnProperty(chartName)) {
						var chartedItems = chartData[chartName];
						if (chartedItems.length > 0) {
							maxDates.push(dateStrToDate(chartedItems[chartedItems.length-1].peak_date).getTime());
						}
					}
				}
				return new Date(Math.max.apply(null, maxDates));
			}			

			function setChartParameters(chartData) {

				xScale = d3.time.scale()
					.domain([
						getMinDateMultiChart(chartData),
						getMaxDateMultiChart(chartData),
					])
					.range([
						margins.left,
						width - margins.right
					]);

				yScale = d3.scale.linear()
					.domain([
						getLowestPositionMultiChart(chartData),
						1
					])
					.range([
						height - margins.bottom,
						margins.top
					]);

				xAxisGen = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.tickSize(1)
					.tickSubdivide(true)
					.tickFormat(d3.time.format('%b %d %Y'));

				yAxisGen = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					.tickSize(1)
					.tickSubdivide(true)

				lineFunction = d3.svg.line()
					.x(function(d) {
						return xScale(dateStrToDate(d.peak_date));
					})
					.y(function(d) {
						return yScale(d.peak_position);
					})
					.interpolate("linear")
					.defined(
						function(d) {
							return d.peak_position != null;
						}
					);

			}

			scope.drawChart = function(chartedItems) {

				clearGraph();
				var chartData = {
					"billboard_singles": [],
					"billboard_albums": []
				};
				for (var i = 0; i < chartedItems.length; i++) {
					chartedItem = chartedItems[i];
					chartData[chartedItem["chart_type"]].push(chartedItem);
				}

				setChartParameters(chartData);

				svg.append("svg:g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height - margins.bottom) + ")")
					.call(xAxisGen)
					.selectAll("text")
						.style("text-anchor","end")
						.attr("dx", "-.8em")
						.attr("dy", ".35em")
						.attr("transform","rotate(-65)");

				svg.append("svg:g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + margins.left + ",0)")
					.call(yAxisGen);

				svg.append("svg:path")		
					.attr({
						d: lineFunction(chartData["billboard_singles"]),
						'stroke':'blue',
						'stroke-width': 2,
						'fill': 'none',
						'class': pathClass
					});

				svg.append("svg:path")		
					.attr({
						d: lineFunction(chartData["billboard_albums"]),
						'stroke':'red',
						'stroke-width': 2,
						'fill': 'none',
						'class': pathClass
					});					

				var tooltipDiv = d3.select("body").append("div")
					.attr("id", "tooltip")
					.style("position", "absolute")
					.style("text-align", "center")
					.style("padding", "5px")
					.style("font", "12px sans-serif")
					.style("background", "#c1d0f0")
					.style("border", "0px")
					.style("border-radius", "8px")
					.style("opacity", "0")
					.style("pointer-events", "none");


				var mouseover = function(d) {
					tooltipDiv.transition()
						.duration(100)
						.style("opacity", 0.9);
					tooltipDiv.html(d.item_name + "</br>" + d.peak_date + "</br>" + d.peak_position)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY) + "px");
				};

				var mouseout = function(d) {
					tooltipDiv.transition()
						.duration(500)
						.style("opacity", 0);
				};

				svg.selectAll("dot")
					.data(chartData["billboard_singles"])
					.enter()
					.append("circle")
					.attr("r", 3.5)
					.attr("cx", function(d) {
						return xScale(dateStrToDate(d.peak_date));
					})
					.attr("cy", function(d) {
						return yScale(d.peak_position);
					})
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);

				svg.selectAll("dot")
					.data(chartData["billboard_albums"])
					.enter()
					.append("circle")
					.attr("r", 3.5)
					.attr("cx", function(d) {
						return xScale(dateStrToDate(d.peak_date));
					})
					.attr("cy", function(d) {
						return yScale(d.peak_position);
					})
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);

			}

			function clearGraph() {
				d3.select("svg").selectAll("*").remove();
				d3.select("body").select("#tooltip").remove();				
			}

		}
	}
});