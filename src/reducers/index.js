import keplerGlReducer from "kepler.gl/reducers"


const customKeplerGlReducer = keplerGlReducer.initialState({
    uiState: {
      // Hide side panel when mounted
      activeSidePanel: null
    }
})

export default customKeplerGlReducer
