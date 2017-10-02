import React from 'react';
import PropTypes from 'prop-types';

import { Translate } from 'react-redux-i18n';

const ConfigurationListItem = ({config}) => (
  <div className="configuraion card">
    <div className="card-body">
      <h4 className="card-title"><Translate value={`configurations.names.${config.key}`} /></h4>
      <p className="card-text">{config.value}</p>
      <a href="#" className="btn btn-primary" type="button"> Editar </a>
    </div>
  </div>
);

export default ConfigurationListItem;
