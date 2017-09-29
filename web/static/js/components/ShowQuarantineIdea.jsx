import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Translate, I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';

import CommentsContainer from '../containers/CommentsContainer';

const confirmDelete = (onDeleteIdea) => {
  // TODO: Y U CONFIRM?
  if (confirm(I18n.t('confirm_message'))) { // eslint-disable-line no-alert
    onDeleteIdea();
  }
};

const canEditIdea = (idea, currentUser) => (
  currentUser.kind === 'admin' || (
    idea.status === 'under_review' && (
      idea.author.id === currentUser.id || idea.owner.id === currentUser.id
    )
  )
);

const canDeleteIdea = (idea, currentUser) => (
  idea.author.id === currentUser.id && idea.status === 'under_review'
);

const ShowQuarantineIdea = ({ idea, currentUser, onApprove, onDeny, onDeleteIdea }) => ( // eslint-disable-line max-len
  <div className="show-idea">
    <div className="row">
      <div className="col-xs-4">
        <p>
          <Link className="btn btn-sm btn-default" to="/">
            <i className="fa fa-chevron-left" /> &nbsp;
            <Translate value="back" />
          </Link>
        </p>
      </div>
      <div className="col-xs-8 text-right">
        <p>
          { canEditIdea(idea, currentUser) ?
            <Link className="btn btn-sm btn-primary" to={`/ideas/edit/${idea.id}`}>
              <i className="fa fa-pencil" /> &nbsp;<Translate value="edit" />
            </Link>
            : ''
          }
          &nbsp; { canDeleteIdea(idea, currentUser) ? <button
            onClick={() => { confirmDelete(onDeleteIdea); }}
            className="btn btn-sm btn-danger"
          >
            <i className="fa fa-trash" /> &nbsp;<Translate value="delete" />
          </button> : '' }
        </p>
      </div>
    </div>
    <div className={`well well-sm status-${idea.status.replace('_', '-')}`}>
      <div className="row">
        <div className="col-md-2">
          <div className="row">
            <div className="col-xs-12">
              { idea.owner.id ? <p> <strong><Translate value="idea.owner" />:</strong><br />
                <img className="profile-image small" src={idea.owner.image_url} alt="profile" />
                &nbsp; <strong>{idea.owner.name}</strong>
              </p> : '' }
              <p>
                <strong><Translate value="idea.author" />:</strong><br />
                <img className="profile-image small" src={idea.author.image_url} alt="profile" />
                &nbsp; <strong>{idea.author.name}</strong>
              </p>
              <p>
                <strong><Translate value="idea.status" />: &nbsp;</strong><br />
                <span className={`label status-${idea.status.replace('_', '-')}`}>
                  <Translate value={`idea.statuses.${idea.status}`} dangerousHTML />
                </span>
              </p>
              <p>
                <strong><Translate value="idea.category" />: &nbsp;</strong><br />
                <span className="label category">
                  <Translate value={`idea.categories.${idea.category}`} dangerousHTML />
                </span>
              </p>
              { currentUser.kind === 'admin' ?
                <p> <strong><Translate value="idea.quarantine.approved" />?</strong> </p> : ''
              }
            </div>
          </div>
          { currentUser.kind === 'admin' ?
            <div className="row">
              <div className="col-lg-4 col-md-5 col-xs-2">
                <button className="btn btn-sm btn-success" onClick={onApprove}>
                  <i className="fa fa-check-circle" /> &nbsp;
                  <Translate value="idea.quarantine.approve" />
                </button>
              </div>
              <div className="col-md-5 col-xs-2">
                <button className="btn btn-sm btn-danger" onClick={onDeny}>
                  <i className="fa fa-times-circle" /> &nbsp;
                  <Translate value="idea.quarantine.deny" />
                </button>
              </div>
            </div>
            : ''
          }
        </div>
        <div className="col-md-10">
          <h1>{idea.title}</h1>
          <hr />
          <ReactMarkdown source={idea.body} />
        </div>
      </div>
    </div>
    <CommentsContainer comments={idea.comments} />
  </div>
);

ShowQuarantineIdea.propTypes = {
  idea: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      id: PropTypes.number,
      image_url: PropTypes.string,
      name: PropTypes.string,
    }),
    author: PropTypes.shape({
      id: PropTypes.number.isRequired,
      image_url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      body: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      author: PropTypes.object.isRequired,
    })).isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
  }).isRequired,
  onApprove: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
  onDeleteIdea: PropTypes.func.isRequired,
};

export default ShowQuarantineIdea;
