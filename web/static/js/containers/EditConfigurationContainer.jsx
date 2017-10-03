import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setConfig } from '../actions/configuration';
import MarkdownConfiguration from '../components/MarkdownConfiguration';

const configurationComponent = (config, updateConfig) => ({
  markdown: <MarkdownConfiguration config={config} setConfig={updateConfig} />,
}[config.kind]);

const EditConfigurationContainer = ({ config, updateConfig }) => (
  <div> { config ? configurationComponent(config, (value) => { updateConfig(config.key, value); }) : ''} </div>
);

EditConfigurationContainer.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
  }),
  updateConfig: PropTypes.func.isRequired,
};

EditConfigurationContainer.defaultProps = {
  config: null,
};

const mapStateToProps = (state, ownProps) => ({
  config: state.configurations.find(c => c.key === ownProps.match.params.key),
});

const mapDispatchToProps = dispatch => ({
  updateConfig: (key, value) => {
    dispatch(setConfig(key, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditConfigurationContainer);
