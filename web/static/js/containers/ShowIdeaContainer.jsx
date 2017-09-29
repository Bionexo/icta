import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchIdea, deleteIdea, approveIdea, denyIdea } from '../actions/ideas';

import ActionButtons from '../components/ShowIdea/ActionButtons';
import Body from '../components/ShowIdea/Body';
import Info from '../components/ShowIdea/Info';
import CommentsContainer from '../containers/CommentsContainer';

class ShowIdeaContainer extends Component {
  componentWillMount() {
    const { getIdea, ideaId } = this.props;
    getIdea(ideaId);
  }

  render() {
    const { idea, history, onDelete, currentUser, onApprove, onDeny } = this.props;

    if (idea === null || idea.loading) {
      return null;
    }

    const canEditIdea = currentUser.kind === 'admin' || (
      idea.status === 'under_review' && (
        idea.author.id === currentUser.id || idea.owner.id === currentUser.id
      )
    );

    const canDeleteIdea =
      idea.author.id === currentUser.id && idea.status === 'under_review';

    const showQuarantineActions = idea.status === 'under_review' && currentUser.kind === 'admin';

    return (
      <div className="show-idea">
        <ActionButtons
          ideaId={idea.id}
          canEditIdea={canEditIdea}
          canDeleteIdea={canDeleteIdea}
          onDeleteIdea={() => onDelete(idea.id, history)}
        />
        <div className={`well well-sm status-${idea.status.replace('_', '-')}`}>
          <div className="row">
            <Info
              idea={idea}
              showQuarantineActions={showQuarantineActions}
              onApprove={() => onApprove(idea.id, history)}
              onDeny={reason => onDeny(idea.id, reason, history)}
            />
            <Body
              title={idea.title}
              body={idea.body}
            />
          </div>
        </div>
        <CommentsContainer comments={idea.comments} />
      </div>
    );
  }
}

ShowIdeaContainer.propTypes = {
  ideaId: PropTypes.string.isRequired,
  idea: PropTypes.shape({
    id: PropTypes.number,
    loading: PropTypes.bool,
  }),
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  getIdea: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
};

ShowIdeaContainer.defaultProps = {
  idea: null,
};

const mapStateToProps = (state, ownProps) => ({
  idea: state.currentIdea,
  ideaId: ownProps.match.params.id,
  currentUser: state.user,
});

const mapDispatchToProps = dispatch => ({
  getIdea: (ideaId) => {
    dispatch(fetchIdea(ideaId));
  },
  onDelete: (ideaId, history) => {
    dispatch(deleteIdea(ideaId, history));
  },
  onApprove: (ideaId, history) => {
    dispatch(approveIdea(ideaId, history));
  },
  onDeny: (ideaId, reason, history) => {
    dispatch(denyIdea(ideaId, reason, history));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowIdeaContainer);
