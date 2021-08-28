import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    const auth = useAuth()

    return (
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
                <button > 
                  I am a Doctor
                </button>
                <button className="logout" onClick={auth.logout} > 
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
                </div>
            </aside>
            <main>

            </main>
        </div>
    )
}
