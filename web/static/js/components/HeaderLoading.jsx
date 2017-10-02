import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

const HeaderLoading = () => (
  <nav className="navbar navbar-inverse loading">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/" />
      <div className="profile-loading"></div>
    </div>
  </nav>
);

export default HeaderLoading;
