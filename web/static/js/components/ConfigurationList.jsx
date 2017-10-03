import React from 'react';
import PropTypes from 'prop-types';

import ConfigurationListItem from './ConfigurationListItem';

const ConfigurationList = ({ configurations }) => (
  <div className="container-fluid">
    { configurations.map(config => <ConfigurationListItem key={config.key} config={config} />)}
  </div>
);

ConfigurationList.propTypes = {
  configurations: PropTypes.array.isRequired,
};

export default ConfigurationList;
