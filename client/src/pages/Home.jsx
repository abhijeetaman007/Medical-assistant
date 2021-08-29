import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteCall, get, post } from "../utils/requests";
import useInputState from "../hooks/useInputState";
import { useToasts } from "react-toast-notifications";
import useForceUpdate from "../hooks/useForceUpdate";
import { storeFile } from "../utils/utilities";
import Loading from "../components/Loading";

export default function Home() {
  const auth = useAuth();
  const description = useInputState();
  const address = useInputState();
  const { addToast } = useToasts();

  const itemName = useInputState();
  const itemQuantity = useInputState();
  const itemCost = useInputState();
  const itemDescription = useInputState();
  const itemTags = useInputState();
  const merchantNewAddress = useInputState();
  const [merchantItems, setMerchantItems] = useState([])

  const [historyLoad, setistoryLoad] = useState(true);
  const [myhistory, setMyHistory] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [userFriends, setUserFriends] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [role, setRole] = useState(0); //1 for merchant and 2 for doctor
  const [patients, setPatients] = useState([]);
  const merchantFileRef = React.useRef(null);
  const docFileRef = React.useRef(null);
  const historyFileRef = React.useRef(null);
  const [location, setLocation] = useState(null)

  const [adminDataLoading, setAdminDataLoading] = useState(true)
  const [adminData, setAdminData] = useState([[],[]])

  const handleSaveDocument = async (folderName, fileName, ref) => {
    if (!ref || !ref.current) return;
    const file = ref.current.files[0];
    try {
      const url = await storeFile(folderName, fileName, file);
      return url.toString();
    } catch (err) {
      addToast("Something Went Wrong", { appearance: "error" });
      return "";
    }
  };

  const handleItemDelete = (id)=>{
    try{
      deleteCall(`/user/merchant/${id}`)
      addToast("Deleted Successfully", { appearance: "success" });
      fetchMerchantData()
    }
    catch (err) {
      addToast("Something Went Wrong", { appearance: "error" });
    }
}

  const update = useForceUpdate();

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
        if (data.data.isDoctor.isVerified) fetchPatients();
        // if(data.data.isMerchant.isVerified)fetchMerchants();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const applyforDoc = async (e) => {
    e.preventDefault();
    description.handleReset();
    const certificateLink = await handleSaveDocument(
      "doc-applications",
      auth.user._id,
      docFileRef
    );
    try {
      await post(`/user/applydoctor`, {
        certificateLink,
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
    const certificateLink = await handleSaveDocument(
      "merchant-applications",
      auth.user._id,
      merchantFileRef
    );

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

  const fetchPatients = async () => {
    try {
      await get(`/user/doctor/viewpatients`).then((data) => {
        console.log(data.data);
        // setPatients(data.data);
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  const postHistory = async (e) => {
    e.preventDefault();
    description.handleReset();
    const imageLink = await handleSaveDocument(
      `user-history-${auth.user._id}`,
      Date.now().toString(),
      historyFileRef
    );

    console.log(imageLink);

    try {
      await post(`/user/updatehistory`, {
        imageLink: imageLink,
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

  const handleMerchantSubmit = async (e)=>{
    e.preventDefault()
    if(!itemName.value || !itemQuantity.value || !itemCost.value || !itemDescription.value || !itemTags.value){
      return addToast("All fields are required",{appearance:"error"})
    }
    const res = await post('/user/merchant/additem',{
      itemName:itemName.value,
      quantity: parseInt(itemQuantity.value),
      cost:parseInt(itemCost.value),
      description:itemDescription.value,
      tags:itemTags.value.split(" ")
    })
    if(!res.success){
      addToast("Something went wrong",{appearance:"error"})
    }
    else{
      addToast("Item Added",{appearance:"success"})
    }
  }

  const fetchMerchantData = ()=> get('/user/merchant/items').then((data)=>{
    setMerchantItems(data)
    console.log(data);
  }).catch(err => {
    console.log(err);
  }) 

  const fetchAdminDetails = async ()=>{
    try{
      const data = await Promise.all([get('/user/admin/merchants'),get("/user/admin/doctors")])
      setAdminData(data)
      setAdminDataLoading(false)
    }

    catch(err){
      addToast("Something went wrong",{appearance:"error"})
    }
  }

  const setUserLocation = ()=>{
    navigator.geolocation.getCurrentPosition((loc)=>{
      setLocation([loc.coords.longitude,loc.coords.latitude])
    }, ()=>{
      addToast("Something went wrong",{appearance:"error"})
    });
  }
  

  useEffect(() => {
    fetchUserDetails();
    fetchHistory();
    fetchMerchantData()
    fetchAdminDetails()
    setUserLocation()
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
        { auth.user.isAdmin && <button onClick={() => setRole(4)}>Admin Panel</button>}
       { auth.user.isMerchant.isVerified && <button onClick={() => setRole(3)}><i style={{marginRight:6}} class="fas fa-store"></i>Dashboard</button>}
       { !auth.user.isMerchant.isVerified && <button onClick={() => setRole(1)}><i class="fas fa-store"></i> Become Merchant</button>}
        { !auth.user.isDoctor.isVerified && <button onClick={() => setRole(2)}><i class="fas fa-user-md"></i> Become Doctor</button>}
          <button onClick={() => setRole(0)}><i class="far fa-user-circle"></i> Profile</button>
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
              <input
                ref={historyFileRef}
                onChange={update}
                type="file"
                name="file"
                accept="file/*"
              />
              <input
                value={description.value}
                onChange={description.handleChange}
                type="text"
                placeholder="Description"
              />
              <button className="btn">Submit</button>
            </form>
            <h1>My History </h1>
            <div className="historyWrapper">
              {myhistory.map((his, index) => {
                return (
                  <div className="history">
                    <img src={his.imageLink} alt="background-img" />
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
              <input
                ref={merchantFileRef}
                onChange={update}
                type="file"
                name="file"
                accept="file/*"
              />
              <input
                value={address.value}
                onChange={address.handleChange}
                type="text"
                placeholder="Location"
              />
              <button className="btn">Submit</button>
            </form>
            {userDetails.isMerchant.isVerified === false ? (
              <h1>Application Status: Not Verified </h1>
            ) : (
              <p>Verified</p>
            )}
           
          </>
        )}
        {role === 2 && (
          <>
            <form onSubmit={applyforDoc}>
              <h3>Verify Doc Details</h3>
              <input
                ref={docFileRef}
                onChange={update}
                type="file"
                name="file"
                accept="file/*"
              />

              <button className="btn">Submit</button>
            </form>
            {userDetails.isDoctor.isVerified === false ? (
              <h1>Application Status: Not Verified </h1>
            ) : (
              <p>Verified</p>
            )}
          </>
        )}
        {
            role === 3 && <>
              <div className="merchant-dashboard">
                <div className="top">
                <h1>Merchant Dashboard</h1>
                      <section>
                  <form>
                  <h3>Edit Address</h3>
                                      <input className="input" type="text" value={merchantNewAddress.value} onChange={merchantNewAddress.handleChange} />
                  <button className="btn">Submit</button>
                  </form>

                </section>
                <main>
                  <h1>Items</h1>
                  <div className="items">
                  <div className="merchant-item">
                          <h3>Test</h3>
                          <span>25</span>
                          <div className="desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate labore veniam, quaerat, ab sunt sequi mollitia velit rem enim accusamus tenetur</div>
                          <div className="cost">{35} /-</div>
                          <div className="delete">Delete Item</div>
                        </div>
                    {
                      merchantItems.map(item=>{
                        return <div className="merchant-item">
                          <h3>{item.itemName}</h3>
                          <span>{item.quantity}</span>
                          <div className="desc">{item.description}</div>
                          <div className="cost">{item.cost}</div>
                          <div onClick={()=>handleItemDelete(item._id)} className="delete">Delete Item</div>
                        </div>
                      })
                    }
                  </div>
                  
                </main>
                </div>
                <form onSubmit={handleMerchantSubmit} >
                 <h1>Add Item</h1>
                  <input placeholder="Name" value={itemName.value} onChange={itemName.handleChange} type="text" />
                  <input placeholder="Quantity" value={itemQuantity.value} onChange={itemQuantity.handleChange} type="text" />
                  <input placeholder="Cost" value={itemCost.value} onChange={itemCost.handleChange} type="text" />
                  <input placeholder="Description" value={itemDescription.value} onChange={itemDescription.handleChange} type="text" />
                  <input placeholder="Tags (Space Separated)" value={itemTags.value} onChange={itemTags.handleChange} type="text" />
                  <button className="btn">Submit</button>
                </form>
              </div>
            </>
        }
        {
          role === 4 && <div className="admin">
            {
            adminDataLoading && 
            <div className="screen-center">
              <Loading/>
            </div> }
            {
             !adminDataLoading &&  
            <>
            <section>
            <h1>
            Merchant Applications
            <div className="applications">
              {adminData[0].data.map(item=>{
                return           <div className="item">
                <a href=""><i className="fa fa-eye"></i></a>
                <div className="name">{item.firstName +" " + item.lastName}</div>
                <button className="verify">Verify</button>
              </div>
              })}
            </div>
            </h1>
            </section>
            <section>
            <h1>
            Doctor Applications
            <div className="applications">
            {adminData[1].data.map(item=>{
                return   <div className="item">
                <a href=""><i className="fa fa-eye"></i></a>
                <div className="name">{item.firstName +" " + item.lastName}</div>
                <button className="verify">Verify</button>
              </div>
              })}
    </div>

            </h1> 
            </section>
            </>}
          </div>
        }
      </main>
    </div>
  );
}
