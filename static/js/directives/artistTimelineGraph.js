app.directive('artistTimelineGraph', function($window) {
	return {
		restrict: 'EA',
		template: "<svg style='background-color:#f2f2f2;border:1px solid #cccccc;' width='400' height='400'></svg>",
		link: function(scope, elem, attrs) {

			//var chartEntries = scope[attrs.chartData].entries;
			var chartEntries, chartData;
			//var padding = 20;
			var margins = {
				top: 20,
				right: 20,
				bottom: 100,
				left: 35
			};
			var width = 400;
			var height = 400;
			var pathClass = "path";
			var xScale, yScale, xAxisGen, yAxisGen, lineFunction;
				
			var d3 = $window.d3;
			var rawSvg = elem.find("svg")[0];
			var svg = d3.select(rawSvg);

			var xScale;
			var yScale;


			function dateStrToDate(dateStr) {
				var dateComponents = dateStr.split('-');
				date = new Date(dateComponents[0],dateComponents[1]-1,dateComponents[2]);
				//return date.getTime()/1000;
				return date;
			}	

			function getLowestPosition() {
				var lowestPosition = chartEntries[0].peak_position;
				for (var i = 0; i < chartEntries.length; i++) {
					if (chartEntries[i].peak_position > lowestPosition)
						lowestPosition = chartEntries[i].peak_position;
				}
				return lowestPosition;
			}

			function setChartParameters() {

				xScale = d3.time.scale()
					.domain([
						dateStrToDate(chartEntries[0].peak_date),
						dateStrToDate(chartEntries[chartEntries.length-1].peak_date),
					])
					.range([
						margins.left,
						width - margins.right
					]);

				yScale = d3.scale.linear()
					.domain([
						getLowestPosition(),
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

			function drawLineChart() {

				setChartParameters();

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
						d: lineFunction(chartEntries),
						'stroke':'blue',
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

				svg.selectAll("dot")
					.data(chartEntries)
					.enter()
					.append("circle")
					.attr("r", 3.5)
					.attr("cx", function(d) {
						return xScale(dateStrToDate(d.peak_date));
					})
					.attr("cy", function(d) {
						return yScale(d.peak_position);
					})
					.on("mouseover", function(d) {
						tooltipDiv.transition()
							.duration(100)
							.style("opacity", 0.9);
						tooltipDiv.html(d.item_name + "</br>" + d.peak_date + "</br>" + d.peak_position)
							.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY) + "px");
					})
					.on("mouseout", function(d) {
						tooltipDiv.transition()
							.duration(500)
							.style("opacity", 0);
					});
			}

			function getDataFromXPos(xPos) {
				var i = bisectDate(chartEntries, xScale.invert(xPos), 1);
				return chartEntries[i];
			}

			var bisectDate = d3.bisector(function(d) {return dateStrToDate(d.date);}).left;

			function initialize(chartedItems) {
				d3.select("svg").selectAll("*").remove();
				d3.select("body").select("#tooltip").remove();
				var chartedSingles = [];
				for (var i = 0; i < chartedItems.length; i++) {
					chartedItem = chartedItems[i];
					if (chartedItem["chart_type"] === "billboard_singles") {
						chartedSingles.push(chartedItem);
					}
				}
				chartEntries = chartedSingles;
			}

			scope.drawChart = function(chartedItems) {
				initialize(chartedItems);
				drawLineChart();
			}

		}
	}
});