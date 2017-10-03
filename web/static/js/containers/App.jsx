import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';

import { Router, Route } from 'react-router-dom';
import Notifications from 'react-notification-system-redux';

import { showIdeas } from '../actions/ideas';
import { getUser as fetchUser } from '../actions/users';
import { getConfigs as fetchConfigs } from '../actions/configuration';

import ApprovedIdeasListContainer from './ApprovedIdeasListContainer';
import QuarantineIdeasListContainer from './QuarantineIdeasListContainer';
import MyIdeasListContainer from './MyIdeasListContainer';
import NewIdeaContainer from './NewIdeaContainer';
import ShowIdeaContainer from './ShowIdeaContainer';
import EditIdeaContainer from './EditIdeaContainer';
import UserListContainer from './UserListContainer';
import HeaderContainer from '../containers/HeaderContainer';
import ConfigurationListContainer from '../containers/ConfigurationListContainer';
import EditConfigurationContainer from '../containers/EditConfigurationContainer';
import Home from '../components/Home';

const history = createBrowserHistory();

class App extends Component {
  componentWillMount() {
    const { getIdeas, getUser, getConfigs } = this.props;
    getIdeas();
    getUser();
    getConfigs();
  }

  render() {
    const { notifications } = this.props;

    return (
      <div>
        <Router history={history}>
          <div>
            <Notifications notifications={notifications} />
            <HeaderContainer />
            <div className="container-fluid">
              <main role="main">
                <Route exact path="/" component={Home} />
                <Route path="/quarantine" component={QuarantineIdeasListContainer} />
                <Route path="/my_ideas" component={MyIdeasListContainer} />
                <Route exact path="/ideas" component={ApprovedIdeasListContainer} />
                <Route path="/ideas/new" component={NewIdeaContainer} />
                <Route path="/ideas/show/:id" component={ShowIdeaContainer} />
                <Route path="/ideas/edit/:id" component={EditIdeaContainer} />
                <Route path="/users" component={UserListContainer} />
                <Route exact path="/configurations" component={ConfigurationListContainer} />
                <Route path="/configurations/edit/:key" component={EditConfigurationContainer} />
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
  getConfigs: PropTypes.func.isRequired,
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
  getConfigs: () => {
    dispatch(fetchConfigs());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
