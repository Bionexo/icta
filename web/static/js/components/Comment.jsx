import React from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';

const Comment = ({ comment }) => (
  <li className="list-group-item">
    <div className="media">
      <div className="media-left">
        <img className="profile-image small" src={comment.author.image_url} alt="profile" />
        { !comment.public ? <i className="fa fa-lock private-comment-icon" /> : '' }
      </div>
      <div className="media-body">
        <p>{comment.body}</p>
        <p><Translate value="idea.comments.by" name={comment.author.name} date={I18n.l(comment.createdAt, { dateFormat: 'datetime' })} dangerousHTML /></p>
      </div>
    </div>
  </li>
);

Comment.propTypes = {
  comment: PropTypes.shape({
    author: PropTypes.shape({
      image_url: PropTypes.string,
      name: PropTypes.string.isRequired,
    }).isRequired,
    body: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    public: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Comment;
