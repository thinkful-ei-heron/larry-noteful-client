import React from 'react';
import PropTypes from 'prop-types';

import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if(this.state.hasError){
      return <h2 className="errorBoun">Error Received During Render</h2>
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.object.isRequired
};
