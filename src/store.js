import { createStore, combineReducers, applyMiddleware } from "redux"
import { taskMiddleware } from "react-palm/tasks"
import customKeplerGlReducer from './reducers/index'


const reducers = combineReducers({
    keplerGl: customKeplerGlReducer
  });

export default createStore(reducers, {}, applyMiddleware(taskMiddleware))
