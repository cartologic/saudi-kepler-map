import React, { Component, createRef } from "react";
import Chart from "chart.js";
import * as d3 from "d3-array";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
  }

  preprocessData = (regionName) => {
    let regionValues = [];
    // 1. Filter data by region
    regionValues = this.props.data.filter(
      (d) => {
        return d.properties.RegionName_EN ? (
          d.properties.RegionName_EN === regionName
        ) : (
          d.properties.regionname_en === regionName
        )
      } 
    );

    // To fix the usually change of date property to lowercase/uppercase format.
    const REPORTED_DATE = regionValues[0].properties.hasOwnProperty('Reportdt') ? 'Reportdt' : 'reportdt'

    // 2. Sorting filtered by region data
    regionValues = regionValues
      .slice()
      .sort((a, b) =>
        d3.ascending(a.properties[REPORTED_DATE], b.properties[REPORTED_DATE])
      );

    // 3. Format the date to be yyyy-mm-dd instead of the current
    const labelDates = regionValues.map((d) =>
      d.properties[REPORTED_DATE].slice(0, 10)
    );
    regionValues.map((d, i) => (d.properties[REPORTED_DATE] = labelDates[i]));

    // 4. Create total cases for each day. The output should be something like this:
    // date: Array of dates, totalCases: Array of cases as each case corresponding to each date index.
    let totalDatesCases = {
      dates: this.removeDuplicateDates(labelDates),
      totalCases: this.generateValidCases(regionValues, this.props.caseType, REPORTED_DATE),
    };
    return totalDatesCases;
  };

  removeDuplicateDates = (dates) => {
    let duplicateDates = [];
    let normalDates = [];

    for (let i = 0; i < dates.length - 1; i++) {
      if (dates[i + 1] === dates[i] && !duplicateDates.includes(dates[i])) {
        duplicateDates.push(dates[i]);
      } else if (duplicateDates.includes(dates[i]) === false) {
        normalDates.push(dates[i]);
      }
    }

    return normalDates.concat(duplicateDates);
  };

  generateValidCases = (data, caseType, reportedDate) => {
    let validCases = [];
    let sumCasesforDate = 0;

    for (let i = 0; i < data.length - 1; i++) {
      if (data[i + 1].properties[reportedDate] !== data[i].properties[reportedDate]) {
        if (
          data[i - 1] &&
          data[i].properties[reportedDate] === data[i - 1].properties[reportedDate]
        ) {
          sumCasesforDate = sumCasesforDate + data[i].properties[caseType];
          validCases.push(sumCasesforDate);
          sumCasesforDate = 0;
          continue;
        }
        validCases.push(data[i].properties[caseType]);
      } else {
        sumCasesforDate = sumCasesforDate + data[i].properties[caseType];
      }
    }
    
    return validCases;
  };

  prepareChart = () => {
    const graphData = this.preprocessData(this.props.regionName);

    this.customChart = new Chart(this.chartRef.current, {
      type: "bar",
      data: {
        labels: graphData.dates,
        datasets: [
          {
            label: this.props.caseType,
            data: graphData.totalCases,
            backgroundColor: "#4BAE53",
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
              },
              display: false,
            },
          ],
        },
      },
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.regionName !== this.props.regionName) {
      this.prepareChart();
    }
  }

  componentDidMount() {
    this.prepareChart();
  }

  render() {
    return <canvas ref={this.chartRef} />;
  }
}

export default BarChart;
