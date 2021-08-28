import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    const auth = useAuth()

    return (
        <div className="home">
            <aside>
                <div className="top">
                    
                </div>
                <div className="logout" onClick={auth.logout} > 
                    <i class="fas fa-sign-out-alt"></i> Logout
                </div>
            </aside>
            <main>

            </main>
        </div>
    )
}
