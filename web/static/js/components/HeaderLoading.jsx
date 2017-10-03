import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLoading = () => (
  <nav className="navbar navbar-inverse loading">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/" />
      <div className="profile-loading" />
    </div>
  </nav>
);

export default HeaderLoading;
