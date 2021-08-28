import React from 'react'
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';
import useForceUpdate from '../hooks/useForceUpdate';
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

export default function DoctorApplication({open,handleClose}) {

    const state = React.useRef(null);
    const auth = useAuth()

    const getFile = () => {
      if (!state) return null;
      if (!state.current) return null;
  
      return state.current.files[0];
    };
    
    const update = useForceUpdate()

    const handleSubmit = async ()=>{
        if(!getFile()) return
        const storage = getStorage();
        const storageRef = ref(storage, `doc-files/doctor-doc-${auth.user._id}`);
        await uploadBytes(storageRef,getFile());
        const fileLink = await getDownloadURL(ref(storage, `doc-files/doctor-doc-${auth.user._id}`))
        console.log(fileLink);
    }


    return (
            <Modal
                onRequestClose={handleClose}
                className="doc-modal"
                overlayClassName="overlay"
                isOpen={open}
            >
                <h1>Apply to be a Doctor</h1>
                <h4>Please upload a relavant document/license so that one of our admins can verify</h4>
                <div className="file" >
                        <div className="choose">
                            <span className="name">
                            {getFile() && getFile().name}
                            </span>
                            <input ref={state} onChange={update} style={{display:"none"}} type="file" id="doc-file" />
                        <label htmlFor="doc-file">Choose File</label>
                    </div>
                </div>
                <button onClick={handleSubmit} className="btn">Submit</button>
            </Modal>
    )
}
