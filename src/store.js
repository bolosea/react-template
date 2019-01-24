import { createStore, applyMiddleware } from 'redux';
import rootReducers from './rootReducers';
import fetchMiddleware from './middleware/fetch/index';
import { createLogger } from 'redux-logger';

const logger = createLogger()
const storeWithMiddleware = applyMiddleware(fetchMiddleware, logger)(createStore)

export default () => {
  return storeWithMiddleware(rootReducers)
}