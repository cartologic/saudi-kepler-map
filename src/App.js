// React and Redux
import React, {useState, useEffect} from 'react';
import { createStore, combineReducers, applyMiddleware } from "redux"
import { taskMiddleware } from "react-palm/tasks"
import { Provider, useDispatch } from "react-redux"
// Kepler required libraries
import KeplerGl from "kepler.gl"
import keplerGlReducer from "kepler.gl/reducers"
import { addDataToMap } from "kepler.gl/actions"
import Processors from "kepler.gl/processors"
// For fetching the data from API and solving the memoizing issue.
import axios from "axios";


const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

const Map = () => {
  const [regionsData, setRegionsData] = useState([]);
  const [governatesData, setGovernatesData] = useState([]);
  const dispatch = useDispatch();

  // Fetch Saudi regions & governates data
  useEffect(() => {
    const requestregions = axios.get("http://datagovsa.mapapps.cloud/geoserver/ows?srsName=EPSG%3A4326&outputFormat=json&service=WFS&srs=EPSG%3A4326&request=GetFeature&typename=geonode%3Ar&version=1.0.0")
    
    const requestGovernates = axios.get("http://datagovsa.mapapps.cloud/geoserver/ows?srsName=EPSG%3A4326&outputFormat=json&service=WFS&srs=EPSG%3A4326&request=GetFeature&typename=geonode%3Asagov&version=1.0.0")

    axios.all([requestregions, requestGovernates])
    .then(axios.spread((...responses) => {
      const regionsData = responses[0].data
      const governatesData = responses[1].data

      const validRegionsData = Processors.processGeojson(regionsData)
      const validGovernatesData = Processors.processGeojson(governatesData)

      setRegionsData(validRegionsData)
      setGovernatesData(validGovernatesData)
      console.log(regionsData)
      }
    ))
  }, [])


  // Add Saudi regions & governates to Kepler's map
  useEffect(() => {
    if (regionsData && governatesData){
      dispatch(
        addDataToMap({
          datasets: [
            {
              info: {
                label: 'Saudi Regions',
                id: 'covidRegions'
              },
              data: regionsData
            },
            {
              info: {
                label: 'Saudi Governates',
                id: 'covidGovernates'
              },
              data: governatesData
            }
          ],
          option: {
            centerMap: true,
            readOnly: false
          },
          config: {}
        })
      );
    }
  }, [dispatch, regionsData, governatesData])

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
