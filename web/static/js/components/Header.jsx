import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Translate } from 'react-redux-i18n';

const LinkWrapper = ({ to, value, renderCondition }) => (
  renderCondition === undefined || renderCondition ?
    <li>
      <Link to={to}>
        <Translate value={value} />
      </Link>
    </li> : null
);

LinkWrapper.propTypes = {
  to: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  renderCondition: PropTypes.bool,
};

LinkWrapper.defaultProps = {
  renderCondition: true,
};

const Header = ({ userName, userImage, isAdmin }) => (
  <nav className="navbar navbar-inverse">
    <div className="container-fluid">
      <div className="navbar-header">
        <button
          type="button"
          className="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#navbar"
          aria-expanded="false"
          aria-controls="navbar"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        <Link className="navbar-brand" to="/" />
        <div className="pull-right">
          <img className="profile-image visible-xs" src={userImage} alt="profile" />
        </div>
      </div>
      <div id="navbar" className="navbar-collapse collapse">
        <ul className="nav navbar-nav">
          <LinkWrapper to="/ideas" value="header.list" />
          <LinkWrapper to="/quarantine" value="header.quarantine" renderCondition={isAdmin} />
          <LinkWrapper to="/my_ideas" value="header.my_ideas" />
          <LinkWrapper to="/ideas/new" value="header.new" />
          <LinkWrapper to="/users" value="header.users" renderCondition={isAdmin} />
        </ul>
        <ul className="nav navbar-nav navbar-right hidden-xs">
          <li>
            <p className="navbar-text"><Translate value="header.welcome" name={userName} /></p>
            <img className="profile-image" src={userImage} alt="profile" />
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

const mapStateToProps = state => ({
  isAdmin: state.user.kind === 'admin',
  userName: state.user.name,
  userImage: state.user.image_url,
});

Header.propTypes = {
  userName: PropTypes.string,
  userImage: PropTypes.string,
  isAdmin: PropTypes.bool.isRequired,
};

Header.defaultProps = {
  userName: '',
  userImage: '',
};

export default connect(mapStateToProps)(Header);
