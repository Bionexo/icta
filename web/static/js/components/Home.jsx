import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ReactMarkdown from 'react-markdown';

const Home = ({ text }) => (
  <div>
    <ReactMarkdown source={text} />
  </div>
);

Home.propTypes = {
  text: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  text: (state.configurations.find(c => c.key === 'home') || { value: '' }).value,
});

export default connect(mapStateToProps)(Home);
