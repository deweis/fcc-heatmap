/********** Fetch the data to be visualized **********/
fetch(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    updateChart(data);
  });

/********** Create the chart *********/
function updateChart(data) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const dataset = data.monthlyVariance.map(x => ({
    year: x.year,
    month: x.month,
    monthName: months[x.month - 1],
    variance: x.variance.toFixed(1),
    temperature: (8.66 + x.variance).toFixed(1)
  }));

  console.log(dataset);

  const w = 900;
  const h = 450;

  /* Padding between the SVG canvas boundary and the plot */
  const padding = 55;

  /* Create an x and y scale */
  const minX = d3.min(dataset, d => d[0]);
  const maxX = d3.max(dataset, d => d[0]);

  const xScale = d3
    .scaleLinear()
    .domain([minX, maxX])
    .range([0, w - 1.5 * padding]);

  /* Add the SVG */
  const svg = d3
    .select('#chartContainer')
    .append('svg')
    .attr('id', 'chart')
    .attr('width', w)
    .attr('height', h)
    .style('fill', '#757575') // grey darken-1
    /*
    Make it responsive
      Thank you: https://stackoverflow.com/a/9539361 resp. http://jsfiddle.net/shawnbot/BJLe6/
  */
    .attr('viewBox', `0 0 ${w} ${h}`)
    .attr('preserveAspectRatio', 'xMidYMid');
}
