import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

import QuarantineActions from './QuarantineActions';

const Info = ({ idea, showQuarantineActions, onApprove, onDeny }) => (
  <div className="col-md-2">
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
    { idea.status === 'denied' ? <p>
      <strong><Translate value="idea.deny_reason" />: &nbsp;</strong><br />
      { idea.deny_reason }
    </p> : '' }
    { showQuarantineActions ? <QuarantineActions onApprove={onApprove} onDeny={onDeny} /> : '' }
  </div>
);

Info.propTypes = {
  idea: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    deny_reason: PropTypes.string,
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
  }).isRequired,
  showQuarantineActions: PropTypes.bool.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
};

export default Info;
