import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfigurationList from '../components/ConfigurationList';

const ConfigurationListContainer = ({ configurations }) => (
  <ConfigurationList configurations={configurations} />
);

ConfigurationListContainer.propTypes = {
  configurations: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  configurations: state.configurations,
});

export default connect(mapStateToProps)(ConfigurationListContainer);
