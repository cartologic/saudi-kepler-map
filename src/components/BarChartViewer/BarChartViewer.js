import React, { Component } from "react";
import axois from "axios";
import Loader from "react-loader-spinner";
import BarChart from "./BarChart/BarChart";
import classes from "./BarChartViewer.module.css";

class BarChartViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saudiData: [],
      loading: true,
    };
  }

  componentDidMount() {
    axois
      .get(
        "http://datagovsa.mapapps.cloud/geoserver/ows?srsName=EPSG%3A3857&outputFormat=json&service=WFS&srs=EPSG%3A3857&request=GetFeature&typename=geonode%3Ahostedview&version=1.0.0"
      )
      .then((response) => {
        this.setState({
          saudiData: response.data.features,
          loading: false,
        });
      });
  }

  render() {
    const { saudiData, loading } = this.state;
    return (
      <div className={classes.BarChartLayout}>
        {!loading ? (
          <div className={classes.BarChart}>
            <BarChart
              data={saudiData}
              regionName={this.props.regionName}
              caseType="Confirmed"
            />
            <BarChart
              data={saudiData}
              regionName={this.props.regionName}
              caseType="Deaths"
            />
            <BarChart
              data={saudiData}
              regionName={this.props.regionName}
              caseType="Tested"
            />
          </div>
        ) : (
          <Loader type="Oval" color="#4BAE53" height={50} width={50} />
        )}
      </div>
    );
  }
}

export default BarChartViewer;
