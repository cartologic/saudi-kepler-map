// React and Redux
import React, {useEffect} from 'react';
import { createStore, combineReducers, applyMiddleware } from "redux"
import { taskMiddleware } from "react-palm/tasks"
import { Provider, useDispatch } from "react-redux"
// Kepler required libraries
import KeplerGl from "kepler.gl"
import keplerGlReducer from "kepler.gl/reducers"
import { addDataToMap } from "kepler.gl/actions"
import Processors from "kepler.gl/processors"
// For fetching the data from API and solving the memoizing issue.
import useSWR from "swr";


const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

const Map = () => {
  const dispatch = useDispatch();

  // The data thats is used here is just a test for running kepler and won't be used in the future.

  const {data} = useSWR("covid", async () => {
    const response = await fetch("http://datagovsa.mapapps.cloud/geoserver/ows?srsName=EPSG%3A4326&outputFormat=json&service=WFS&srs=EPSG%3A4326&request=GetFeature&typename=geonode%3Ar&version=1.0.0");

    const data_json = await response.json();
    const data = Processors.processGeojson(data_json)
    return data;
  });

  useEffect(() => {
    if (data){
      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: 'Saudi Regions',
              id: 'covid'
            },
            data: data
          },
          option: {
            centerMap: true,
            readOnly: false
          },
          config: {}
        })
      );
    }
  }, [dispatch, data])


  return (
    <KeplerGl
      id="covid"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
      width={window.innerWidth}
      height={window.innerHeight}
      appName="Saudi COVID-19"
    />
  )
}

function App() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  );
}

export default App;
