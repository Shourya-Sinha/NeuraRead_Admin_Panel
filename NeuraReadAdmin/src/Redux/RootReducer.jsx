import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import authSlices from "./SlicesFunction/AuthSlice";
import dataSlice from './SlicesFunction/DataSlice';
const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: ["auth"],
  //   blacklist: [],
};

const rootReducer = combineReducers({
  auth: authSlices,
  adminStats:dataSlice
});

export { rootPersistConfig, rootReducer };
