import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';

import { Router, Route } from 'react-router-dom';
import Notifications from 'react-notification-system-redux';

import { showIdeas } from '../actions/ideas';
import { getUser as fetchUser } from '../actions/users';

import ApprovedIdeasListContainer from './ApprovedIdeasListContainer';
import QuarantineIdeasListContainer from './QuarantineIdeasListContainer';
import MyIdeasListContainer from './MyIdeasListContainer';
import NewIdeaContainer from './NewIdeaContainer';
import ShowIdeaContainer from './ShowIdeaContainer';
import EditIdeaContainer from './EditIdeaContainer';
import UserListContainer from './UserListContainer';
import Header from '../components/Header';
import Home from '../components/Home';

const history = createBrowserHistory();

class App extends Component {
  componentWillMount() {
    const { getIdeas, getUser } = this.props;
    getIdeas();
    getUser();
  }

  render() {
    const { notifications } = this.props;

    return (
      <div>
        <Router history={history}>
          <div>
            <Notifications notifications={notifications} />
            <Header />
            <div className="container-fluid">
              <main role="main">
                <Route exact path="/" component={Home} />
                <Route path="/ideas" component={ApprovedIdeasListContainer} />
                <Route path="/quarantine" component={QuarantineIdeasListContainer} />
                <Route path="/my_ideas" component={MyIdeasListContainer} />
                <Route path="/ideas/new" component={NewIdeaContainer} />
                <Route path="/ideas/show/:id" component={ShowIdeaContainer} />
                <Route path="/ideas/edit/:id" component={EditIdeaContainer} />
                <Route path="/users" component={UserListContainer} />
              </main>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  getIdeas: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  notifications: state.notifications,
});

const mapDispatchToProps = dispatch => ({
  getIdeas: () => {
    dispatch(showIdeas());
  },
  getUser: () => {
    dispatch(fetchUser());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
