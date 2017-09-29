import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

const NewComment = ({ onAddComment, showPublicFlag }) => {
  let body;
  let isPublic = { checked: true };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!body.value) {
      return;
    }

    onAddComment(body.value, isPublic.checked);
    body.value = '';
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <textarea ref={(node) => { body = node; }} className="form-control" id="body" />
        </div>
        <div className="form-group text-right">
          <div className="row">
            <div className="col-xs-6 col-sm-2 pull-right">
              <button type="submit" className="btn btn-primary">
                <Translate value="idea.comments.new" />
              </button>
            </div>
            { showPublicFlag ?
              <div className="col-xs-6 col-sm-8 pull-right">
                <label htmlFor="is-public">
                  <input
                    ref={(node) => { isPublic = node; }}
                    type="checkbox"
                    defaultChecked
                    id="is-public"
                  />
                  <Translate value="idea.comments.public" />
                </label>
              </div>
              : ''
            }
          </div>
        </div>
      </form>
    </div>
  );
};

NewComment.propTypes = {
  onAddComment: PropTypes.func.isRequired,
  showPublicFlag: PropTypes.bool.isRequired,
};

export default NewComment;
