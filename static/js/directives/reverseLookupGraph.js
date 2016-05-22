app.directive('reverseLookupGraph', function($window) {
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


			function dateStrToDate(dateStr) {
				var dateComponents = dateStr.split('-');
				date = new Date(dateComponents[0],dateComponents[1]-1,dateComponents[2]);
				//return date.getTime()/1000;
				return date;
			}	

			function getLowestPosition() {
				var lowestPosition = chartEntries[0].position;
				for (var i = 0; i < chartEntries.length; i++) {
					if (chartEntries[i].position > lowestPosition)
						lowestPosition = chartEntries[i].position;
				}
				return lowestPosition;
			}

			function setChartParameters() {

				xScale = d3.time.scale()
					.domain([
						dateStrToDate(chartEntries[0].date),
						dateStrToDate(chartEntries[chartEntries.length-1].date),
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
						return xScale(dateStrToDate(d.date));
					})
					.y(function(d) {
						return yScale(d.position);
					})
					.interpolate("linear")
					.defined(
						function(d) {
							return d.position != null;
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

			}

			function initialize() {
				d3.select("svg").selectAll("*").remove();
				chartData = scope[attrs.chartData];
				chartEntries = scope.fillMissingData(chartData.entries.slice(0));	
			}

			scope.drawChart = function() {
				initialize();
				drawLineChart();
			}

		}
	}
});