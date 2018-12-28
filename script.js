/*
 -> Example: https://codepen.io/ttstauss/pen/MqQQWO?editors=0010
*/

/*
- animate?
- responsive?

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

  // get the unique years in the dataset to calculate the cell width
  const years = dataset.map(x => x.year);
  const uniqueYears = [...new Set(years)];

  // SVG Sizing
  const w = 900;
  const h = 500;

  /* To Place the chart within the SVG */
  const marginTop = h / 6;
  const marginRight = w / 7;
  const marginBottom = h / 6;
  const marginLeft = w / 15;
  const cellWidth = (w - marginRight - marginLeft) / uniqueYears.length;

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

  /* Create an x and y scale */
  const minX = d3.min(dataset, d => d.year);
  const maxX = d3.max(dataset, d => d.year);
  const minY = d3.min(dataset, d => d.month);
  const maxY = d3.max(dataset, d => d.month);

  const xScale = d3
    .scaleLinear()
    .domain([minX, maxX])
    .range([0, w - marginRight]);

  const yScale = d3
    .scaleLinear()
    .domain([maxY, minY])
    .range([h - marginBottom, marginTop]);

  /* Add the SVG */
  const svg = d3
    .select('#chartContainer')
    .append('svg')
    .attr('id', 'chart')
    .attr('width', w)
    .attr('height', h);

  /* Add the axes */
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('')); // format years as string
  const yAxis = d3.axisLeft(yScale).tickFormat((d, i) => `${months[d - 1]}`); // use month names for the y-axis;

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('class', 'axis')
    .attr('transform', `translate(${marginLeft}, ${h - marginBottom})`) // position the axis on the SVG canvas in the right place.
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('class', 'axis')
    .attr('transform', `translate(${marginLeft}, -14)`)
    .call(yAxis);

  /* Define the div for the tooltip 
Thank you: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369  */
  const divTooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  // set up heat map cells
  svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.year) + marginLeft + 1)
    .attr('y', d => yScale(d.month - 1)) //(d.month - 1) * (h / 12))
    .attr('width', cellWidth) //w / maxX - minX)
    .attr('height', (h - 1.7 * marginBottom) / 12)
    .attr('data-month', d => d.month - 1)
    .attr('data-year', d => d.year)
    .attr('data-temp', d => Number(d.temperature))
    .attr('class', 'cell')
    .style('fill', d => colorScale(Number(d.variance)))
    .on('mouseover', d => {
      // Show the tooltip when hovering
      divTooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9)
        .attr('data-year', d.year);

      divTooltip
        .html(
          `
          ${d.monthName} ${d.year}<br>
          Temperature: ${d.temperature} ℃<br>
          Variance: ${d.variance} ℃
          `
        )
        .style('left', d3.event.pageX + 5 + 'px')
        .style('top', d3.event.pageY - 5 + 'px');
    })
    .on('mouseout', d => {
      /* Hide the tooltip when hovering out */
      divTooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });

  // Add the legend using the d3-legend package
  svg
    .append('g')
    .attr('class', 'legend')
    .attr('id', 'legend')
    .attr(
      'transform',
      `translate(${1.15 * marginLeft}, ${h - 0.5 * marginBottom})`
    );

  const legendLinear = d3
    .legendColor()
    .shape('rect')
    .shapeWidth(66)
    .orient('horizontal')
    .scale(colorScale);

  svg.select('.legend').call(legendLinear);
}
