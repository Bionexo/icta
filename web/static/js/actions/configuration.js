import Notifications from 'react-notification-system-redux';
import { I18n } from 'react-redux-i18n';
import { configureSocket, joinChannel } from '../channel';

export const ALL_CONFIGS_REQUESTED = 'ALL_CONFIGS_REQUESTED';
export const ALL_CONFIGS_RECEIVED = 'ALL_CONFIGS_RECEIVED';
export const ALL_CONFIGS_FAILURE = 'ALL_CONFIGS_FAILURE';

export const CONFIG_UPDATE_RECEIVED = 'CONFIG_UPDATE_RECEIVED';

export const CONFIG_UPDATE_REQUEST = 'CONFIG_UPDATE_REQUEST';
export const CONFIG_UPDATE_SUCCESS = 'CONFIG_UPDATE_SUCCESS';
export const CONFIG_UPDATE_FAILURE = 'CONFIG_UPDATE_FAILURE';

const allConfigsRequested = () => ({ type: ALL_CONFIGS_REQUESTED });
const allConfigsReceived = configs => ({ type: ALL_CONFIGS_RECEIVED, configs });
const configUpdateReceived = config => ({ type: CONFIG_UPDATE_RECEIVED, config });

const configUpdateRequest = config => ({ type: CONFIG_UPDATE_REQUEST, config });
const configUpdateSuccess = config => ({ type: CONFIG_UPDATE_SUCCESS, config });
const configUpdateFailure = config => ({ type: CONFIG_UPDATE_FAILURE, config });

const socket = configureSocket();
const configChannel = joinChannel(socket, 'config');

export const getConfigs = () => (
  (dispatch) => {
    dispatch(allConfigsRequested());

    configChannel.push('get', {})
      .receive('ok', (response) => {
        dispatch(allConfigsReceived(response.configs));
      })
      .receive('error', (error) => {
        dispatch(allConfigsError(response));
      });

    configChannel.on('updated', (msg) => {
      dispatch(configUpdateReceived(msg));
    });
  }
);

export const setConfig = (key, value) => (
  (dispatch) => {
    dispatch(configUpdateRequest());

    configChannel.push('set_config', { key, value })
      .receive('ok', () => {
        dispatch(configUpdateSuccess());
        dispatch(Notifications.success({
          title: I18n.t('notifications.config_success.title'),
          message: I18n.t('notifications.config_success.message'),
        }));
      })
      .receive('error', () => {
        dispatch(configUpdateFailure(config));
      });
  }
);
