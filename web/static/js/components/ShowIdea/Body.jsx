import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Body = ({ title, body }) => (
  <div className="col-md-10">
    <h1>{title}</h1>
    <hr />
    <ReactMarkdown source={body} />
  </div>
);

Body.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Body;

