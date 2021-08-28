import React from 'react'
import { Link } from 'react-router-dom'
import useInputState from "../../hooks/useInputState"
import { useAuth } from '../../context/AuthContext'
import { useToasts } from 'react-toast-notifications';


export default function Login() {
    const email = useInputState()
    const password = useInputState()
    const auth = useAuth()
    const { addToast } = useToasts();


    const handleSubmit = async (e)=>{
        e.preventDefault()
        if (!email.value || !password.value) return
        const res = await auth?.login(email.value, password.value);
        if(!res.success) addToast(res.data,{appearance:"error"})
    }

    return (
        <div className="auth" >
            <form onSubmit={handleSubmit} >
                <h1>Login</h1>
                <input value={email.value} onChange={email.handleChange} type="text" placeholder="Email" />
                <input type="password" value={password.value} onChange={password.handleChange} placeholder="Password" />
                <div className="switch">
                    Not a member? <Link to="/register">Register</Link>
                </div>
                <button className="btn">Submit</button>
            </form>
        </div>
    )
}
