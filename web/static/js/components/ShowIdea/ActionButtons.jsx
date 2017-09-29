import React from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';

const confirmDelete = (onDeleteIdea) => {
  // TODO: Y U CONFIRM?
  if (confirm(I18n.t('confirm_message'))) { // eslint-disable-line no-alert
    onDeleteIdea();
  }
};


const ActionButtons = ({ ideaId, canEditIdea, canDeleteIdea, onDeleteIdea }) => (
  <div className="row">
    <div className="col-xs-4">
      <p>
        <Link className="btn btn-sm btn-primary" to="/">
          <i className="fa fa-chevron-left" /> &nbsp;
          <Translate value="back" />
        </Link>
      </p>
    </div>
    <div className="col-xs-8 text-right">
      <p>
        { canEditIdea ?
          <Link className="btn btn-sm btn-primary" to={`/ideas/edit/${ideaId}`}>
            <i className="fa fa-pencil" /> &nbsp;<Translate value="edit" />
          </Link>
          : ''
        }
        &nbsp; { canDeleteIdea ? <button
          onClick={() => { confirmDelete(onDeleteIdea); }}
          className="btn btn-sm btn-danger"
        >
          <i className="fa fa-trash" /> &nbsp;<Translate value="delete" />
        </button> : '' }
      </p>
    </div>
  </div>
);

ActionButtons.propTypes = {
  ideaId: PropTypes.number.isRequired,
  canEditIdea: PropTypes.bool.isRequired,
  canDeleteIdea: PropTypes.bool.isRequired,
  onDeleteIdea: PropTypes.func.isRequired,
};

export default ActionButtons;
