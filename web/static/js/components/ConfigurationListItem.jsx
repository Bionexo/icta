import React from 'react';
import PropTypes from 'prop-types';

import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';

const ConfigurationListItem = ({ config }) => (
  <div className="configuration panel panel-default">
    <div className="panel-heading">
      <h4 className="panel-title"><Translate value={`configurations.names.${config.key}`} /></h4>
    </div>
    <div className="panel-body">
      { config.value ? <p className="card-text">{config.value.substring(0, 100)} {config.value.length > 100 ? '...' : ''}</p> : '' }
    </div>
    <div className="panel-footer text-right">
      <Link to={`/configurations/edit/${config.key}`} className="btn btn-primary">
        <Translate value="configurations.edit" />
      </Link>
    </div>
  </div>
);

ConfigurationListItem.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string,
  }).isRequired,
};

export default ConfigurationListItem;
