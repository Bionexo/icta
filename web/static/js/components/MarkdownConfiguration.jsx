import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

import SimpleMDE from 'simplemde';

class MarkdownConfiguration extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.config.value };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const simplemde = new SimpleMDE({ forceSync: true });
    this.simplemde = simplemde;

    const onChangeArea = () => {
      this.setState({ value: simplemde.value() });
    };

    onChangeArea.bind(this);
    simplemde.codemirror.on('change', onChangeArea);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.setConfig(this.state.value);
  }

  render() {
    const config = this.props.config;

    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <h3><Translate value={`configurations.names.${config.key}`} /></h3>
          <textarea rows="4" value={config.value || ''} onChange={() => {}} />
        </div>
        <button type="submit" className="btn btn-primary pull-right">
          <Translate value="configurations.edit" />
        </button>
      </form>
    );
  }
}

MarkdownConfiguration.propTypes = {
  config: PropTypes.shape({
    value: PropTypes.string,
  }).isRequired,
  setConfig: PropTypes.func.isRequired,
};

export default MarkdownConfiguration;
