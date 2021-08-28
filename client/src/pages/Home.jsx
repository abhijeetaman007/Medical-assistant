import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { get, post } from "../utils/requests";
import useInputState from "../hooks/useInputState";
import { useToasts } from "react-toast-notifications";
import useForceUpdate from "../hooks/useForceUpdate"
import {storeFile} from "../utils/utilities"

export default function Home() {
  const auth = useAuth();
  const description = useInputState();
  const address = useInputState();
  const { addToast } = useToasts();

  const [historyLoad, setistoryLoad] = useState(true);
  const [myhistory, setMyHistory] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [userFriends, setUserFriends] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [role, setRole] = useState(0); //1 for merchant and 2 for doctor

  const merchantFileRef = React.useRef(null)
  const docFileRef = React.useRef(null)
  const historyFileRef = React.useRef(null)

  const handleSaveDocument = async (folderName,fileName,ref) => {
      if(!ref || !ref.current) return 
      const file = ref.current.files[0];
      try{
        const url = await storeFile(folderName,fileName , file)
        console.log(url);
      }
      catch(err){
        addToast("Something Went Wrong",{appearance:"error"})
      }
  }

  const update = useForceUpdate()

  const fetchHistory = async () => {
    try {
      await get(`/user/viewhistory`).then((data) => {
        console.log(data.data);
        setMyHistory(data.data);
        setistoryLoad(false);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserDetails = async () => {
    try {
      await get(`/user/viewprofile`).then((data) => {
        console.log(data.data);
        setUserDetails(data.data);
        setUserFriends(data.data.friends);
        setUserRequests(data.data.requests);
      });
    } catch (err) {
      console.log(err);
    }
  };
 
  const applyforDoc = async (e) => {
    e.preventDefault();
    description.handleReset();
    const certificateLink = await handleSaveDocument('doc-applications', auth.user._id, docFileRef)
    try {
      await post(`/user/applydoctor`, {
        certificateLink
      }).then((data) => {
        console.log(data);
        if (data.success) addToast(data.msg, { appearance: "success" });
      });
    } catch (err) {
      console.log(err.response);
      addToast(err.response.data.msg, { appearance: "error" });
    }
   
  };
  const applyForMerchant = async (e) => {
    e.preventDefault();
    address.handleReset();
    const certificateLink = await handleSaveDocument('merchant-applications', auth.user._id, merchantFileRef)

    try {
      await post(`/user/applymerchant`, {
        certificateLink,
        address: address.value,
      }).then((data) => {
        console.log(data);
        if (data.success) addToast(data.msg, { appearance: "success" });
      });
    } catch (err) {
      console.log(err.response);
      addToast(err.response.data.msg, { appearance: "error" });
    }
    
  };

  const postHistory = async (e) => {
    e.preventDefault();
    description.handleReset();
    const imageLink = await handleSaveDocument(`user-history-${auth.user._id}`, Date.now().toString(), merchantFileRef)

    try {
      await post(`/user/updatehistory`, {
        imageLink,
        description: description.value,
      }).then((data) => {
        console.log(data);
        if (data.success) addToast(data.msg, { appearance: "success" });
      });
    } catch (err) {
      console.log(err);
      addToast(err.msg, { appearance: "error" });
    }
    fetchHistory();
  };

  useEffect(() => {
    fetchUserDetails();
    fetchHistory();
  }, []);

  return (
    <div className="home">
      <aside>
        <div className="top">
          <h2>
            Medical <br /> Assistant
          </h2>
        </div>
        <div className="bottom">
          <button onClick={() => setRole(1)}>I am a Merchant</button>
          <button onClick={() => setRole(2)}>I am a Doctor</button>
          <button onClick={() => setRole(0)}>Profile</button>
          <button className="logout" onClick={auth.logout}>
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>
      <main>
        {role === 0 && (
          <>
            <div className="userDetails">
              <div className="photo">
                <img
                  className="profile-picture"
                  src="https://unsplash.it/300/300/?random&pic=1(14 kB)"
                  alt="profile-picture"
                />
              </div>
              <div>
                <p>{userDetails.firstName + " " + userDetails.lastName}</p>
                <p class="title">{userDetails.email}</p>
                <p>Followers : {userFriends.length}</p>
                <p>Pending Requests : {userRequests.length}</p>
              </div>
            </div>
            <form onSubmit={postHistory}>
              <h3>Upload History</h3>
              <input ref={historyFileRef} onChange={update} type="file" name="file" accept="file/*" />
              <input
                value={description.value}
                onChange={description.handleChange}
                type="text"
                placeholder="Description"
              />
              <button className="btn" >Submit</button>
            </form>
            <h1>My History </h1>
            <div className="historyWrapper">
              {myhistory.map((his, index) => {
                return (
                  <div className="history">
                    <img
                      src="https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                      alt="background-img"
                    />
                    <p>{his.description}</p>
                  </div>
                );
              })}
            </div>{" "}
          </>
        )}
        {role === 1 && (
          <>
            
            <form onSubmit={applyForMerchant}>
              <h3>Verify Merhcant Details</h3>
              <input ref={merchantFileRef} onChange={update} type="file" name="file" accept="file/*" />
              <input
                value={address.value}
                onChange={address.handleChange}
                type="text"
                placeholder="Location"
              />
              <button className="btn">Submit</button>
            </form>
            
          </>
        )}
        {role === 2 && (
          <>
            
            <form onSubmit={applyforDoc}>
              <h3>Verify Doc Details</h3>
              <input ref={docFileRef} onChange={update} type="file" name="file" accept="file/*" />
              
              <button className="btn" >Submit</button>
            </form>
            
          </>
        )}
      </main>
    </div>
  );
}
