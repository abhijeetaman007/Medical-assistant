import React from 'react'
import animation from '../assets/animations/file.json';
import { lottieOptions } from '../utils/utilities';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="landing">
            <h1>Medical Assistant</h1>
            <h4>Your one stop for all your medical histroy</h4>
            <Lottie
                options={lottieOptions(animation,false)}
                height={300}
                width={300}
            />
            <div className="buttons">
                <Link className="btn" to="/register">Register</Link>
                <Link className="btn" to="/login">Login</Link>
            </div>
        </div>
    )
}
