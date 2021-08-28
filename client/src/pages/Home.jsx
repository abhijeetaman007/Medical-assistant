import React from 'react'
import DoctorApplication from '../components/DoctorApplication'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    const auth = useAuth()
    const [docModalOpen, setDocModalOpen] = React.useState(false)

    return (
        <>
        <DoctorApplication open={docModalOpen} handleClose={()=>setDocModalOpen(false)}  />
        <div className="home">
            <aside>
                <div className="top">
                <h2>
                    Medical <br/> Assistant
                </h2>
                </div>
                <div className="bottom">
                <button> 
                  I am a Merchant
                </button>
                <button onClick={()=>setDocModalOpen(true)} > 
                  I am a Doctor
                </button>
                <button className="logout" onClick={auth.logout} > 
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
                </div>
            </aside>
            <main>

            </main>
        </div>
        </>
    )
}
