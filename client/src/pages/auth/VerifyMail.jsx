import React from 'react'
import animation from '../../assets/animations/tick.json';
import { lottieOptions } from '../../utils/utilities';
import Lottie from 'react-lottie';

export default function VerifyMail() {
    return (
        <div className="auth">
             <Lottie
                options={lottieOptions(animation)}
                height={200}
                width={200}
            />
            <h1>Mail Verified</h1>
            <Link claas to="/login">Login</Link>
        </div>
    )
}
