// React and Redux
import React, {useState, useEffect} from 'react';
import { createStore, combineReducers, applyMiddleware } from "redux"
import { taskMiddleware } from "react-palm/tasks"
import { Provider, useDispatch } from "react-redux"
// Kepler required libraries
import { injectComponents, LoadDataModalFactory, AddDataButtonFactory } from "kepler.gl/components"
import keplerGlReducer from "kepler.gl/reducers"
import { addDataToMap, setExportData } from "kepler.gl/actions"
import Processors from "kepler.gl/processors"
// Other imports
import axios from "axios";
import mapConfig from "./data/config.json";
import LoadingDialog from "./components/LoadingDialog"


const CustomLoadingModal = () => (<LoadingDialog />)
const customLoadingModalFactory = () => CustomLoadingModal;

// TODO: Use the normal "Add data" button again when loading modal fixed.
const CustomDataBtn = () => (<></>)
const customDataBtnFactory = () => CustomDataBtn;

const KeplerGl = injectComponents([
  [LoadDataModalFactory, customLoadingModalFactory],
  [AddDataButtonFactory, customDataBtnFactory]
])

const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

const Map = () => {
  const [regionsData, setRegionsData] = useState([]);
  const [governatesData, setGovernatesData] = useState([]);
  const [mapUpdated, setMapUpdated] = useState(false);
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
