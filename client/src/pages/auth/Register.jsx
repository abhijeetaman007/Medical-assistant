import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Loading from '../../components/Loading'
import { useAuth } from '../../context/AuthContext'
import useInputState from "../../hooks/useInputState"
import { validateEmail } from "../../utils/utilities"
import { useToasts } from 'react-toast-notifications';

export default function Register() {
    const firstName = useInputState()
    const lastName = useInputState()
    const email = useInputState()
    const password = useInputState()
    const confirmPassword = useInputState()
    const [errors, setErrors] = React.useState([])
    const [loading, setLoading] = React.useState(false);
    const auth = useAuth()
    const history = useHistory()
    const { addToast } = useToasts();


    const handleSubmit = async (e)=>{
        e.preventDefault()
        setLoading(true);
        const errors = []
        if (!firstName.value || !lastName.value || !email.value || !password.value) errors.push('All fields are required');
        if (!validateEmail(email.value) && email.value) errors.push('Email is invalid');
        if (password.value.length < 8 && password.value) errors.push('Password must be atleast 8 Characters');
        else if (password.value !== confirmPassword.value) errors.push('Passwords do not match');
        
        if (errors.length === 0) {
            const res = await auth?.register(firstName.value, lastName.value, email.value, password.value);
            setLoading(false);
            if(!res.success) return setErrors([res.data])
            history.replace('/login');
            addToast("Verification Mail Sent" , {appearance:"info"})
          } else {
            setLoading(false);
            setErrors(errors);
        }
    }

    if(loading) {
    return (
        <div className="screen-center">
            <Loading/>
        </div>
    )}

    return (
        <div className="auth" >
            <form onSubmit={handleSubmit} >
                <h1>Register</h1>
                <div className="errors">
                    {errors.map(err=> <div key={err} className="err">{err}</div>)}
                </div>
                <input value={firstName.value} onChange={firstName.handleChange} type="text" placeholder="First Name" />
                <input value={lastName.value} onChange={lastName.handleChange} type="text" placeholder="Last Name" />
                <input value={email.value} onChange={email.handleChange} type="text" placeholder="Email" />
                <input type="password" value={password.value} onChange={password.handleChange} placeholder="Password" />
                <input type="password" value={confirmPassword.value} onChange={confirmPassword.handleChange} placeholder="Confirm Password" />
                <div className="switch">
                    Already a member? <Link to="/login" >Login</Link>
                </div>
                <button className="btn">Submit</button>
            </form>
        </div>
    )
}