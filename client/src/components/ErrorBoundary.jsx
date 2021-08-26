import React, { Component } from 'react';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';
import animation from '../assets/animations/error.json';
import { lottieOptions } from '../utils/utilities';

export default class ErrorBoundary extends Component {
  state = {
    error: false,
  };

  static getDerivedStateFromError(error) {
    return { error: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary screen-center">
          <Lottie options={lottieOptions(animation)} height={400} width={400} />
          <h1>Something went wrong</h1>
          <Link className="btn" to="/">
            Back to Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}
