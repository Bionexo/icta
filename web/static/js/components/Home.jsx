import React from 'react';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1><Translate value='idea.home.header' dangerousHTML /></h1>
    <Translate value='idea.home.body' dangerousHTML />
    <strong>
      <Link to="/ideas">
        <Translate value="idea.home.link" />
      </Link>
    </strong>
  </div>
);

export default Home;
