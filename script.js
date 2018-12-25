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
}
