import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Header from '../components/Header';
import HeaderLoading from '../components/HeaderLoading';

const HeaderContainer = ({isUserLoaded}) => (
  isUserLoaded ? <Header /> : <HeaderLoading />
);

const mapStateToProps = state => ({
  isUserLoaded: state.user.id !== null,
});

export default connect(mapStateToProps)(HeaderContainer);
