/*
 -> Example: https://codepen.io/ttstauss/pen/MqQQWO?editors=0010
*/

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

  const baseValue = 8.66;

  const dataset = data.monthlyVariance.map(x => ({
    year: x.year,
    month: x.month,
    monthName: months[x.month - 1],
    variance: x.variance.toFixed(1),
    temperature: (baseValue + x.variance).toFixed(1)
  }));

  const w = 900;
  const h = 450;

  /* Setup the coloring */
  const colors = [
    '#313695',
    '#4575b4',
    '#74add1',
    '#abd9e9',
    '#e0f3f8',
    '#ffffbf',
    '#fee090',
    '#fdae61',
    '#f46d43',
    '#d73027',
    '#a50026'
  ];

  const minVariance = d3.min(dataset, d => Number(d.variance));
  const maxVariance = d3.max(dataset, d => Number(d.variance));

  const colorScale = d3
    .scaleQuantize()
    .domain([minVariance, maxVariance])
    .range(colors);

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

  // set up heat map cells
  svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.year) + padding + 1)
    .attr('y', d => yScale(d.month - 1)) //(d.month - 1) * (h / 12))
    .attr('width', 2) //w / maxX - minX)
    .attr('height', (h - padding) / 12 - 5)
    .attr('data-month', d => d.month - 1)
    .attr('data-year', d => d.year)
    .attr('data-temp', d => Number(d.temperature))
    .attr('class', 'cell')
    .style('fill', d => colorScale(Number(d.variance)));
}
