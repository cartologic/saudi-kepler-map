// React and Redux
import React, {useState, useEffect} from 'react';
import { Provider, useDispatch } from "react-redux"
// Kepler required libraries
import { injectComponents } from "kepler.gl/components"
import { addDataToMap, setExportData } from "kepler.gl/actions"
import Processors from "kepler.gl/processors"
// Other imports
import axios from "axios";
import mapConfig from "./configurations/mapConfig.json";
import config from "./configurations/config.json";
import store from "./store"
import { replaceLoadDataModal } from "./factories/load-data-modal"
import { replaceAddDataBtn } from "./factories/add-data-button"
import { replaceLayerHoverInfo } from "./factories/layer-hover-info"


const KeplerGl = injectComponents([
  replaceLoadDataModal(),
  replaceAddDataBtn(),
  replaceLayerHoverInfo()
])

const Map = () => {
  const [regionsData, setRegionsData] = useState([]);
  const [governatesData, setGovernatesData] = useState([]);
  const [mapUpdated, setMapUpdated] = useState(false);
  const dispatch = useDispatch();

  // Fetch Saudi regions & governates data
  useEffect(() => {
    const requestParams = {
      srsName: "EPSG:4326",
      outputFormat: "json",
      service: "WFS",
      srs: "EPSG:4326",
      request: "GetFeature",
      version: "1.0.0"
    };

    const { covidRegions, covidGovernorates } = config && config.layersNames;

    const requestregions = axios.get(`${config.SiteURL}/geoserver/ows`, {
      params: {
        ...requestParams,
        typename: covidRegions
      }
    });
    
    const requestGovernates = axios.get(`${config.SiteURL}/geoserver/ows`, {
      params: {
        ...requestParams,
        typename: covidGovernorates
      }
    });

    axios.all([requestregions, requestGovernates])
    .then(axios.spread((...responses) => {
      const regionsData = responses[0].data
      const governatesData = responses[1].data

      const validRegionsData = Processors.processGeojson(regionsData)
      const validGovernatesData = Processors.processGeojson(governatesData)

      setRegionsData(validRegionsData)
      setGovernatesData(validGovernatesData)
      }
    ))
    .catch(error => {
      console.log(error);
    });
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
            centerMap: true
          },
          config: mapConfig
        })
      );
      // If map is exported as JSON, export it without the dataset
      dispatch(setExportData(false));
      setMapUpdated(true);
    }
  }, [dispatch, regionsData, governatesData])

  return (
    mapUpdated ? <KeplerGl
      id="covid"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
      width={window.innerWidth}
      height={window.innerHeight}
      appName="Kepler | COVID-19 KSA"
      version="1.0"
    /> : <h1> </h1>
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
