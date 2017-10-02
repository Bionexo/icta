import { combineReducers } from 'redux';
import { i18nReducer } from 'react-redux-i18n';
import { reducer as notifications } from 'react-notification-system-redux';
import ideas from './ideas';
import newIdea from './newIdea';
import currentIdea from './currentIdea';
import user from './user';
import ideaFilter from './ideaFilter';
import quarantineIdeaFilter from './quarantineIdeaFilter';
import userFilter from './userFilter';
import users from './users';
import configurations from './configurations';

const rootReducer = combineReducers({
  ideas,
  newIdea,
  currentIdea,
  user,
  ideaFilter,
  quarantineIdeaFilter,
  userFilter,
  notifications,
  users,
  configurations,
  i18n: i18nReducer,
});

export default rootReducer;
