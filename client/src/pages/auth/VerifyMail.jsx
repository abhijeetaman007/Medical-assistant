import React from 'react'
import animation from '../../assets/animations/tick.json';
import { lottieOptions } from '../../utils/utilities';
import Lottie from 'react-lottie';
import Loading from '../../components/Loading';
import { get } from '../../utils/requests';
import { useToasts } from 'react-toast-notifications';
import {Link} from "react-router-dom"

export default function VerifyMail({match}) {

    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(false)
    const {addToast} = useToasts()

    React.useEffect(() => {
        get(`/auth/verifyemail/${match.params.token}`).then(()=>{
            setLoading(false)
        }).catch(()=>{
            addToast("Something went wrong",{appearance:"error"})
            setError(true)
        })
        
    }, [])

    if(error) return <div className="verify-email">
        <h1 className="error" >Something Went Wrong</h1>
    </div>

    if(loading) {
        return <div className="screen-center">
            <Loading/>
        </div>
    }

    return (
        <div className="verify-email">
             <Lottie
                options={lottieOptions(animation)}
                height={300}
                width={300}
            />
            <h1>Mail Verified</h1>
            <Link className="btn" to="/login">Login</Link>
        </div>
    )
}
