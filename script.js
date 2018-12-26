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

  const w = 900;
  const h = 450;

  /* Padding between the SVG canvas boundary and the plot */
  const padding = 80;

  /* Create an x and y scale */
  const minX = d3.min(dataset, d => d.year);
  const maxX = d3.max(dataset, d => d.year);
  const minY = d3.min(dataset, d => d.month);
  const maxY = d3.max(dataset, d => d.month);

  const xScale = d3
    .scaleLinear()
    .domain([minX, maxX])
    .range([0, w - 1.5 * padding]); // [left, right]

  const yScale = d3
    .scaleLinear()
    .domain([maxY, minY])
    .range([h - padding, padding]);

  /* Add the SVG */
  const svg = d3
    .select('#chartContainer')
    .append('svg')
    .attr('id', 'chart')
    .attr('width', w)
    .attr('height', h);

  /* Add the axes */
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('')); // format years as string
  const yAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, ${h - padding})`) // position the axis on the SVG canvas in the right place.
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);
}
