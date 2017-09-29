import Notifications from 'react-notification-system-redux';
import { I18n } from 'react-redux-i18n';
import { configureSocket, joinChannel } from '../channel';

export const SHOW_IDEAS_REQUEST = 'SHOW_IDEAS_REQUEST';
export const SHOW_IDEAS_SUCCESS = 'SHOW_IDEAS_SUCCESS';
export const SHOW_IDEAS_FAILURE = 'SHOW_IDEAS_FAILURE';

export const ADD_IDEA_REQUEST = 'ADD_IDEA_REQUEST';
export const ADD_IDEA_SUCCESS = 'ADD_IDEA_SUCCESS';
export const ADD_IDEA_FAILURE = 'ADD_IDEA_FAILURE';

export const EDIT_IDEA_REQUEST = 'EDIT_IDEA_REQUEST';
export const EDIT_IDEA_SUCCESS = 'EDIT_IDEA_SUCCESS';
export const EDIT_IDEA_FAILURE = 'EDIT_IDEA_FAILURE';

export const VOTE_REQUEST = 'VOTE_REQUEST';
export const VOTE_SUCCESS = 'VOTE_SUCCESS';
export const VOTE_FAILURE = 'VOTE_FAILURE';

export const VOTE_REMOVE_REQUEST = 'VOTE_REMOVE_REQUEST';
export const VOTE_REMOVE_SUCCESS = 'VOTE_REMOVE_SUCCESS';
export const VOTE_REMOVE_FAILURE = 'VOTE_REMOVE_FAILURE';

export const FETCH_IDEA_SUCCESS = 'FETCH_IDEA_SUCCESS';
export const FETCH_IDEA_REQUEST = 'FETCH_IDEA_REQUEST';
export const FETCH_IDEA_FAILURE = 'FETCH_IDEA_FAILURE';

export const DELETE_IDEA_SUCCESS = 'DELETE_IDEA_SUCCESS';
export const DELETE_IDEA_REQUEST = 'DELETE_IDEA_REQUEST';
export const DELETE_IDEA_FAILURE = 'DELETE_IDEA_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const NEW_IDEA_RECEIVED = 'NEW_IDEA_RECEIVED';
export const EDIT_IDEA_RECEIVED = 'EDIT_IDEA_RECEIVED';
export const CHANGE_MY_VOTE = 'CHANGE_MY_VOTE';
export const CHANGE_FILTER_TEXT = 'CHANGE_FILTER_TEXT';
export const CHANGE_FILTER_STATUS = 'CHANGE_FILTER_STATUS';

export const CHANGE_QUARANTINE_FILTER_TEXT = 'CHANGE_QUARANTINE_FILTER_TEXT';
export const CHANGE_QUARANTINE_FILTER_STATUS = 'CHANGE_QUARANTINE_FILTER_STATUS';

export const ALL_USERS_RECEIVED = 'ALL_USERS_RECEIVED';

export const APPROVE_IDEA_SUCCESS = 'APPROVE_IDEA_SUCCESS';
export const APPROVE_IDEA_REQUEST = 'APPROVE_IDEA_REQUEST';
export const APPROVE_IDEA_FAILURE = 'APPROVE_IDEA_FAILURE';

export const DENY_IDEA_SUCCESS = 'DENY_IDEA_SUCCESS';
export const DENY_IDEA_REQUEST = 'DENY_IDEA_REQUEST';
export const DENY_IDEA_FAILURE = 'DENY_IDEA_FAILURE';

const voteRequest = () => ({ type: VOTE_REQUEST });
const voteSuccess = idea => ({ type: VOTE_SUCCESS, idea });

const voteRemoveRequest = () => ({ type: VOTE_REMOVE_REQUEST });

const showIdeasRequest = () => ({ type: SHOW_IDEAS_REQUEST });
const showIdeasSuccess = ideas => ({ type: SHOW_IDEAS_SUCCESS, ideas });
const showIdeasFailure = error => ({ type: SHOW_IDEAS_FAILURE, error });

const addIdeaRequest = (title, body, category) => ({
  type: ADD_IDEA_REQUEST,
  title,
  body,
  category,
});

const addIdeaSuccess = idea => ({ type: ADD_IDEA_SUCCESS, idea });
const addIdeaFailure = (title, error) => ({ type: ADD_IDEA_FAILURE, title, error });

const editIdeaRequest = () => ({ type: EDIT_IDEA_REQUEST });
const editIdeaSuccess = () => ({ type: EDIT_IDEA_SUCCESS });
const editIdeaFailure = error => ({ type: EDIT_IDEA_FAILURE, error });

const fetchIdeaRequest = () => ({ type: FETCH_IDEA_REQUEST });
const fetchIdeaSuccess = idea => ({ type: FETCH_IDEA_SUCCESS, idea });
const fetchIdeaFailure = error => ({ type: FETCH_IDEA_FAILURE, error });

const addCommentRequest = () => ({ type: ADD_COMMENT_REQUEST });
const addCommentSuccess = () => ({ type: ADD_COMMENT_SUCCESS });
const addCommentFailure = error => ({ type: ADD_COMMENT_FAILURE, error });

const deleteIdeaRequest = () => ({ type: DELETE_IDEA_REQUEST });
const deleteIdeaSuccess = ideaId => ({ type: DELETE_IDEA_SUCCESS, ideaId });
const deleteIdeaFailure = error => ({ type: DELETE_IDEA_FAILURE, error });

const approveIdeaSuccess = ideaId => ({ type: APPROVE_IDEA_SUCCESS, ideaId });
const approveIdeaFailure = error => ({ type: APPROVE_IDEA_FAILURE, error });

const denyIdeaSuccess = ideaId => ({ type: DENY_IDEA_SUCCESS, ideaId });
const denyIdeaFailure = error => ({ type: DENY_IDEA_FAILURE, error });

const newIdeaReceived = idea => ({ type: NEW_IDEA_RECEIVED, idea });
const editIdeaReceived = idea => ({ type: EDIT_IDEA_RECEIVED, idea });

const changeMyVote = (ideaId, myVote) => ({ type: CHANGE_MY_VOTE, ideaId, myVote });

export const changeQuarantineFilterText = filter => ({
  type: CHANGE_QUARANTINE_FILTER_TEXT,
  filter,
});

export const changeQuarantineFilterStatus = status => ({
  type: CHANGE_QUARANTINE_FILTER_STATUS,
  status,
});

export const changeFilterText = filter => ({ type: CHANGE_FILTER_TEXT, filter });
export const changeFilterStatus = status => ({ type: CHANGE_FILTER_STATUS, status });

const socket = configureSocket();
const ideaChannel = joinChannel(socket, 'idea');
const quarantineChannel = joinChannel(socket, 'quarantine');

export const removeVote = ideaId => (
  (dispatch) => {
    dispatch(voteRemoveRequest());
    const payload = { idea_id: ideaId };

    ideaChannel.push('vote:remove', payload)
      .receive('ok', () => {
        dispatch(changeMyVote(ideaId, null));
      })
      .receive('error', (error) => {
        dispatch(addIdeaFailure(null, error));
      });
  }
);

export const vote = (ideaId, voteValue) => (
  (dispatch) => {
    dispatch(voteRequest());

    const payload = { idea_id: ideaId, vote: voteValue };

    ideaChannel.push('vote:new', payload)
      .receive('ok', () => {
        dispatch(changeMyVote(ideaId, voteValue));
      })
      .receive('error', (error) => {
        dispatch(addIdeaFailure(null, error));
      });
  }
);

export const fetchIdea = ideaId => (
  (dispatch) => {
    dispatch(fetchIdeaRequest());

    const payload = { idea_id: ideaId };

    ideaChannel.push('get', payload)
      .receive('ok', (response) => {
        const comments = [...response.comments];
        const idea = { ...response.idea, comments };
        dispatch(fetchIdeaSuccess(idea));
      })
      .receive('error', (error) => {
        dispatch(fetchIdeaFailure(error));
      });
  }
);

export const addComment = (ideaId, body, isPublic) => (
  (dispatch) => {
    dispatch(addCommentRequest());

    const payload = { idea_id: ideaId, body, public: isPublic };

    ideaChannel.push('comment:new', payload)
      .receive('ok', () => {
        dispatch(addCommentSuccess());
        dispatch(fetchIdea(ideaId));
      })
      .receive('error', (error) => {
        dispatch(addCommentFailure(error));
      });
  }
);

export const showIdeas = () => (
  (dispatch) => {
    dispatch(showIdeasRequest());

    ideaChannel.push('get_all', null)
      .receive('ok', (messages) => {
        dispatch(showIdeasSuccess(messages.ideas));
      })
      .receive('error', (reason) => {
        dispatch(showIdeasFailure(reason));
      });

    ideaChannel.on('new', (msg) => {
      dispatch(newIdeaReceived(msg));
    });

    ideaChannel.on('edit', (msg) => {
      dispatch(editIdeaReceived(msg));
    });

    ideaChannel.on('vote:new', (msg) => {
      dispatch(voteSuccess(msg));
    });

    quarantineChannel.on('new', (msg) => {
      dispatch(newIdeaReceived(msg));
    });

    ideaChannel.on('quarantine:approved', (msg) => {
      dispatch(newIdeaReceived(msg));
    });

    ideaChannel.on('quarantine:denied', (msg) => {
      dispatch(newIdeaReceived(msg));
    });
  }
);

export const addIdea = (title, body, category, history) => (
  (dispatch) => {
    dispatch(addIdeaRequest(title, body, category));

    const payload = { title, body, category };

    ideaChannel.push('new', payload)
      .receive('ok', (response) => {
        dispatch(addIdeaSuccess(response));

        dispatch(Notifications.success({
          title: I18n.t('notifications.new_idea_success.title'),
          message: I18n.t('notifications.new_idea_success.message'),
        }));

        history.push('/');
      })
      .receive('error', (error) => {
        dispatch(addIdeaFailure(title, error));
      });
  }
);

export const editIdea = (ideaId, attributes, history) => (
  (dispatch) => {
    dispatch(editIdeaRequest());

    const payload = { idea_id: ideaId, attributes };

    ideaChannel.push('edit', payload)
      .receive('ok', () => {
        dispatch(editIdeaSuccess());

        dispatch(Notifications.success({
          title: I18n.t('notifications.edit_idea_success.title'),
          message: I18n.t('notifications.edit_idea_success.message'),
        }));

        history.push(`/ideas/show/${ideaId}`);
      })

      .receive('error', (error) => {
        dispatch(editIdeaFailure(error));
      });
  }
);

const simpleAction = (channel, action, onSuccess, onError) => (ideaId, history) => (
  (dispatch) => {
    dispatch(deleteIdeaRequest());

    const payload = { idea_id: ideaId };

    channel.push(action, payload)
      .receive('ok', () => {
        dispatch(onSuccess(ideaId));
        dispatch(Notifications.success({
          title: I18n.t(`notifications.${action}_idea_success.title`.replace(':', '_')),
          message: I18n.t(`notifications.${action}_idea_success.message`.replace(':', '_')),
        }));

        history.push('/');
      })
      .receive('error', (error) => {
        dispatch(onError(error));
      });
  }
);

const simpleIdeaAction = (action, onSuccess, onError) =>
  simpleAction(ideaChannel, action, onSuccess, onError);
const simpleQuarantineAction = (action, onSuccess, onError) =>
  simpleAction(quarantineChannel, action, onSuccess, onError);

export const approveIdea = simpleQuarantineAction('quarantine:approve', approveIdeaSuccess, approveIdeaFailure);
export const denyIdea = simpleQuarantineAction('quarantine:deny', denyIdeaSuccess, denyIdeaFailure);
export const deleteIdea = simpleIdeaAction('delete', deleteIdeaSuccess, deleteIdeaFailure);
