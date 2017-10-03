import { CONFIG_UPDATE_SUCCESS, CONFIG_UPDATE_FAILURE, CONFIG_UPDATE_REQUEST,
  CONFIG_UPDATE_RECEIVED, ALL_CONFIGS_RECEIVED } from '../actions/configuration';

const replaceConfig = (configs, newConfig, index) =>
  (configs.slice(0, index).concat([newConfig]).concat(configs.slice(index + 1)));

const configurations = (state = [], action) => {
  switch (action.type) {
    case ALL_CONFIGS_RECEIVED:
      return action.configs;
    case CONFIG_UPDATE_RECEIVED:
      console.log(action)
      const updatedIndex = state.map(i => i.key).indexOf(action.config.key);
      return replaceConfig(state, action.config, updatedIndex);
    case CONFIG_UPDATE_FAILURE:
    case CONFIG_UPDATE_REQUEST:
    case CONFIG_UPDATE_RECEIVED:
    default:
      return state;
  }
};

export default configurations;
