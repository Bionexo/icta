import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';

import { addComment } from '../actions/ideas';
import Comment from '../components/Comment';
import NewComment from '../components/NewComment';

const CommentsContainer = ({ comments, idea, onAddComment, showPublicFlag }) => (
  <div className="row">
    <div className="col-xs-12">
      <br />
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4><Translate value="comments.title" /></h4>
        </div>
        <div className="panel-body">
          <NewComment
            showPublicFlag={showPublicFlag}
            onAddComment={(body, isPublic) => onAddComment(idea.id, body, isPublic)}
          />
        </div>
        <ul className="list-group">
          { comments.map(c =>
            <Comment key={c.id} comment={c} />) }
        </ul>
      </div>
    </div>
  </div>
);

CommentsContainer.propTypes = {
  comments: PropTypes.array.isRequired,
  onAddComment: PropTypes.func.isRequired,
  showPublicFlag: PropTypes.bool.isRequired,
  idea: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  showPublicFlag: state.user.kind === 'admin',
  idea: state.currentIdea,
});

const mapDispatchToProps = dispatch => ({
  onAddComment: (ideaId, body, isPublic) => {
    dispatch(addComment(ideaId, body, isPublic));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);
