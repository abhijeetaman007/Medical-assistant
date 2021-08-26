import React from 'react';
import animation from '../assets/animations/loading.json';
import { lottieOptions } from '../utils/utilities';
import Lottie from 'react-lottie';

export default function Loading({
  width = 250,
  height = 250,
}) {
  return (
    <div className="loading">
      <Lottie
        options={lottieOptions(animation)}
        height={height}
        width={width}
      />
    </div>
  );
}
