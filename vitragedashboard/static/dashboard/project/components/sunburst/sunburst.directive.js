angular
    .module('horizon.dashboard.project.vitrage')
    .directive('hzSunburst', hzSunburst);

function hzSunburst() {
    var directive = {
        link: link,
        scope: {
            name: '@'
        },
        templateUrl: STATIC_URL+'dashboard/project/components/sunburst/sunburst.html',
        restrict: 'E'
    };
    return directive;

    function link(scope, element, attrs) {

        // We have to init the d3 after the div element has dynamic id
        scope.$watch('name', function(newValue, oldValue) {
            init();
        });

        function init() {
            var width = 500,
              height = 500,
              radius = Math.min(width, height) / 2;

            var x = d3.scale.linear()
              .range([0, 2 * Math.PI]);

            var y = d3.scale.sqrt()
              .range([0, radius]);

            var color = d3.scale.category20c();

            var svg = d3.select('#' + scope.name).append('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')
              .attr('transform', 'translate(' + width / 2 + ',' + (height / 2 + 10) + ')');

            var partition = d3.layout.partition()
              .value(function (d) {
                  return d.size;
              });

            var arc = d3.svg.arc()
              .startAngle(function (d) {
                  return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
              })
              .endAngle(function (d) {
                  return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
              })
              .innerRadius(function (d) {
                  return Math.max(0, y(d.y));
              })
              .outerRadius(function (d) {
                  return Math.max(0, y(d.y + d.dy));
              });

            d3.json('/static/dashboard/project/topology/graph.json', function (error, root) {
                if (error) throw error;

                var path = svg.selectAll('path')
                  .data(partition.nodes(root))
                  .enter().append('path')
                  .attr('d', arc)
                  .style('fill', function (d) {
                      return color((d.children ? d : d.parent).name);
                  })
                  .on('click', click);

                function click(d) {
                    path.transition()
                      .duration(750)
                      .attrTween('d', arcTween(d));
                }
            });

            d3.select(self.frameElement).style('height', height + 'px');

            // Interpolate the scales!
            function arcTween(d) {
                var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                  yd = d3.interpolate(y.domain(), [d.y, 1]),
                  yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                return function (d, i) {
                    return i
                      ? function (t) {
                        return arc(d);
                    }
                      : function (t) {
                        x.domain(xd(t));
                        y.domain(yd(t)).range(yr(t));
                        return arc(d);
                    };
                };
            }
        }

    }
}
