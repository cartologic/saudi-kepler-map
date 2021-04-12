import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import BarChart from "./BarChart/BarChart";
import classes from "./BarChartViewer.module.css";
import config from "../../configurations/config.json";

const BarChartViewer = props => {
  const [saudiData, setSaudiData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestParams = {
      srsName: "EPSG:3857",
      outputFormat: "json",
      service: "WFS",
      srs: "EPSG:3857",
      request: "GetFeature",
      version: "1.0.0"
    };
    const { covidHostedView } = config && config.layersNames;

    axios
      .get(`${config.SiteURL}/geoserver/ows`, {
        params: {
          ...requestParams,
          typename: covidHostedView
        }
      })
      .then(response => {
        setSaudiData(response.data.features);
        setLoading(false);
      });
  }, []);

  return (
    <div className={classes.BarChartLayout}>
      {
        !loading ? (
          <div className={classes.BarChart}>
            <BarChart
              data={saudiData}
              regionName={props.regionName}
              caseType="confirmed"
            />
            <BarChart
              data={saudiData}
              regionName={props.regionName}
              caseType="deaths"
            />
            <BarChart
              data={saudiData}
              regionName={props.regionName}
              caseType="tested"
            />
          </div>
        ) : (
          <Loader type="Oval" color="#4BAE53" height={50} width={50} />
        )
      }
    </div>
  );
};

export default BarChartViewer;
