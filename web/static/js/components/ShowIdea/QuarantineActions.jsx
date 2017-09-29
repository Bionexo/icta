import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

class QuarantineActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { onDenyProgress: false };

    this.denyIdea = this.denyIdea.bind(this);
    this.cancelDeny = this.cancelDeny.bind(this);
  }


  denyIdea() {
    this.setState({ onDenyProgress: true });
  }

  cancelDeny() {
    this.setState({ onDenyProgress: false });
  }

  render() {
    let denyReason;

    const { onApprove, onDeny } = this.props;

    const { onDenyProgress } = this.state;

    const onSubmit = (e) => {
      e.preventDefault();
      if (!denyReason.value) {
        return;
      }

      onDeny(denyReason.value);
    };

    return (
      <div>
        { onDenyProgress ?
          <div className="row">
            <div className="col-xs-12">
              <p> <strong><Translate value="idea.deny.reason" />:</strong> </p>
            </div>
            <div className="col-xs-12">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <textarea
                    ref={(node) => { denyReason = node; }}
                    className="form-control"
                    id="body"
                  />
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-xs-6">
                      <button type="button" className="btn btn-primary" onClick={this.cancelDeny}>
                        <Translate value="idea.deny.cancel" />
                      </button>
                    </div>
                    <div className="col-xs-6 text-right">
                      <button type="submit" className="btn btn-danger">
                        <Translate value="idea.deny.confirm" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          :
          <div className="row">
            <div className="col-xs-12">
              <p> <strong><Translate value="idea.quarantine.approved" />?</strong></p>
            </div>
            <div className="col-lg-4 col-md-5 col-xs-6">
              <button className="btn btn-sm btn-success" onClick={onApprove}>
                <i className="fa fa-check-circle" /> &nbsp;
                <Translate value="idea.quarantine.approve" />
              </button>
            </div>
            <div className="col-md-5 col-xs-6">
              <button className="btn btn-sm btn-danger" onClick={this.denyIdea}>
                <i className="fa fa-times-circle" /> &nbsp;
                <Translate value="idea.quarantine.deny" />
              </button>
            </div>
          </div>
        }
      </div>
    );
  }
}

QuarantineActions.propTypes = {
  onApprove: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
};

export default QuarantineActions;
