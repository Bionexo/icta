import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShowIdea from '../components/ShowIdea';
import ShowQuarantineIdea from '../components/ShowQuarantineIdea';
import { fetchIdea, deleteIdea, approveIdea, denyIdea } from '../actions/ideas';

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

    return (
      idea.status === 'under_review' ? <ShowQuarantineIdea
        idea={idea}
        currentUser={currentUser}
        onApprove={() => onApprove(idea.id, history)}
        onDeny={() => onDeny(idea.id, history)}
        onDeleteIdea={() => onDelete(idea.id, history)}
      /> : <ShowIdea
        idea={idea}
        currentUser={currentUser}
        onDeleteIdea={() => onDelete(idea.id, history)}
      />
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
  onDeny: (ideaId, history) => {
    dispatch(denyIdea(ideaId, history));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowIdeaContainer);
