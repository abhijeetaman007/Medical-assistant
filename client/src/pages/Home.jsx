import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteCall, get, post } from "../utils/requests";
import useInputState from "../hooks/useInputState";
import { useToasts } from "react-toast-notifications";
import useForceUpdate from "../hooks/useForceUpdate";
import { storeFile } from "../utils/utilities";
import Loading from "../components/Loading";
import FriendsList from "./FriendsList";
export default function Home() {
  const auth = useAuth();
  const description = useInputState();
  const address = useInputState();
  const { addToast } = useToasts();
  const addFriendEmail = useInputState();
  const removeFriendEmail = useInputState();

  const itemName = useInputState();
  const itemQuantity = useInputState();
  const itemCost = useInputState();
  const itemDescription = useInputState();
  const itemTags = useInputState();
  const search = useInputState();
  const storeName = useInputState();
  const phoneNo = useInputState();


  const [merchantItems, setMerchantItems] = useState([])

  const [historyLoad, setistoryLoad] = useState(true);
  const [detailsLoad, setDetailsLoad] = useState(true);
  const [myhistory, setMyHistory] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [userFriends, setUserFriends] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [role, setRole] = useState(0); //1 for merchant and 2 for doctor
  const [friends, setFriends] = useState([]);
  const merchantFileRef = React.useRef(null);
  const docFileRef = React.useRef(null);
  const historyFileRef = React.useRef(null);
  const [location, setLocation] = useState(null)

  const [adminDataLoading, setAdminDataLoading] = useState(true)
  const [adminData, setAdminData] = useState([[],[]])

  const [medicine, setMedicine] = useState([])

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

  const handleItemDelete = async (id)=>{
    try{
      const res = await deleteCall(`/user/merchant/deleteitem/${id}`)
      addToast("Deleted Successfully", { appearance: "success" });
      fetchMerchantData();
    } catch (err) {
      addToast("Something Went Wrong", { appearance: "error" });
    }
  };

  const update = useForceUpdate();

  const fetchHistory = async () => {
    try {
      await get(`/user/viewhistory`).then((data) => {
        setMyHistory(data.data);
        setistoryLoad(false);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserDetails = async () => {
    try {
      await get(`/user/viewprofile/${auth.user._id}`).then((data) => {
        console.log(data.data);
        setUserDetails(data.data);
        setUserFriends(data.data.friends);
        setUserRequests(data.data.requests);
        //fetchFriends();
        setDetailsLoad(false);
        console.log(data.data.isDoctor.isVerified);

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
        storeName:storeName.value,
        phoneNumber:phoneNo.value
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
    const imageLink = await handleSaveDocument(
      `user-history-${auth.user._id}`,
      Date.now().toString(),
      historyFileRef
    );

    console.log(imageLink);

    try {
      await post(`/user/updatehistory/${auth.user._id}`, {
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

  const acceptRequest = async ({ requestId }) => {
    try {
      await post(`/user/acceptfriendrequest`, {
        requestId,
      }).then((data) => {
        console.log(data);
        if (data.success) addToast(data.data, { appearance: "success" });
      });
    } catch (err) {
      console.log(err);
      addToast(err.msg, { appearance: "error" });
    }
    fetchUserDetails();
  };
  const rejectRequest = async ({ requestId }) => {
    try {
      await post(`/user/rejectfriendrequest`, {
        requestId,
      }).then((data) => {
        console.log(data);
        if (data.success) addToast(data.data, { appearance: "success" });
      });
    } catch (err) {
      console.log(err);
      addToast(err.msg, { appearance: "error" });
    }
    fetchUserDetails();
  };

  const fetchMerchantData = ()=> get('/user/merchant/items').then((data)=>{
    setMerchantItems(data.data)
  }).catch(err => {
    console.log(err);
  }) 

  const fetchAdminDetails = async ()=>{
    try{
      const data = await Promise.all([get('/user/admin/getmerchant'),get("/user/admin/getdoctor")])
      setAdminData(data)
      setAdminDataLoading(false)
      console.log(data);
    }

    catch(err){
      addToast("Something went wrong",{appearance:"error"})
    }
  }

  const setUserLocation = ()=>{
    navigator.geolocation.getCurrentPosition((loc)=>{
      setLocation([loc.coords.longitude,loc.coords.latitude])
      handleGetStores([loc.coords.longitude,loc.coords.latitude])
    }, ()=>{
      addToast("Something went wrong",{appearance:"error"})
    });
  }

  const handleVerifyDoc = async (id)=>{
    try{
      await get(`/user/admin/verifydoctor/${id}`)
      fetchAdminDetails()
      addToast("Verified Successfully",{appearance:"success"})
    }
    catch(err){
      addToast("Something went wrong",{appearance:"error"})
    }
  }

  const handleVerifyMerchant = async (id)=>{
    try{
      await get(`/user/admin/verifymerchant/${id}`)
      fetchAdminDetails()
      addToast("Verified Successfully",{appearance:"success"})
    }
    catch(err){
      addToast("Something went wrong",{appearance:"error"})
    }
  }

  const handleGetStores = async (coords)=>{
    const res = await post(`/user/getnearestmerchant`, {
      location: coords
    })
    setMedicine(res.data)
  }

  const getFilteredMedicine = ()=>{
    console.log(medicine);
    return medicine.filter(data=>{
      const searchTerm = data.itemName + " " + data.tags.join(" ")
      return searchTerm.toLowerCase().includes(search.value.toLowerCase())
    })
  }
   
  
  
  const addFriend = async ( e) => {
    e.preventDefault();
    addFriendEmail.handleReset();
    try {
      await post(`/user/addfriend`, {
        friendEmail : addFriendEmail.value,
      }).then((data) => {
        console.log(data);
        if (data.success) addToast(data.data, { appearance: "success" });
      });
    } catch (err) {
      console.log(err);
      addToast(err.msg, { appearance: "error" });
    }
    fetchUserDetails();
  };

  const removeFriend = async (e) => {
    e.preventDefault();
    removeFriendEmail.handleReset();
    try {
      await post(`/user/removefriend`, {
        rfriendEmail : removeFriendEmail.value,
      }).then((data) => {
        console.log(data);
        if (data.success) addToast(data.data, { appearance: "success" });
      });
    } catch (err) {
      console.log(err);
      addToast(err.msg, { appearance: "error" });
    }
    fetchUserDetails();
  };

  const handleMerchantSubmit = async (e) => {
    e.preventDefault();
    if (
      !itemName.value ||
      !itemQuantity.value ||
      !itemCost.value ||
      !itemDescription.value ||
      !itemTags.value
    ) {
      return addToast("All fields are required", { appearance: "error" });
    }
    const res = await post("/user/merchant/additem", {
      itemName: itemName.value,
      quantity: parseInt(itemQuantity.value),
      cost: parseInt(itemCost.value),
      description: itemDescription.value,
      tags: itemTags.value.split(" "),
    });
    if (!res.success) {
      addToast("Something went wrong", { appearance: "error" });
    } else {
      addToast("Item Added", { appearance: "success" });
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchHistory();
    fetchMerchantData()
    fetchAdminDetails()
    setUserLocation()
   
  }, []);

  if (detailsLoad === true) return <Loading />;

  return (
    <div className="home">
      <aside>
        <div className="top">
          <h2>
            Medical <br /> Assistant
          </h2>
        </div>
        <div className="bottom">
        <button onClick={() => setRole(5)}>Find Medicine</button>
        { auth.user.isAdmin && <button onClick={() => setRole(4)}>Admin Panel</button>}
       { auth.user.isMerchant.isVerified && <button onClick={() => setRole(3)}><i style={{marginRight:6}} class="fas fa-store"></i>Dashboard</button>}
       { !auth.user.isMerchant.isVerified && <button onClick={() => setRole(1)}><i class="fas fa-store"></i> Become Merchant</button>}
          <button onClick={() => setRole(0)}><i class="far fa-user-circle"></i> Profile</button>
          <button onClick={() => setRole(2)}>
            <i class="fas fa-user-md"></i>{" "}
            {userDetails.isDoctor.isVerified === false ? (
              <>I am a Doctor </>
            ) : (
              <>Doctor's Portal</>
            )}
          </button>
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
                <p>Connected To : {userFriends.length}</p>
                <p>Pending Requests : {userRequests.length}</p>
              </div>
              <div>
                <h3>Pending Requests :</h3>
                {userDetails.requests.map((req, ind) => {
                  return (
                    <p key={ind}>
                      {req.email}
                      <i
                        class="far fa-check-circle"
                        onClick={() => acceptRequest(req.userId)}
                        style={{ color: "green" }}
                      ></i>{" "}
                      <i
                        class="far fa-times-circle"
                        style={{ color: "red" }}
                        onClick={() => rejectRequest(req.userId)}
                      ></i>{" "}
                    </p>
                  );
                })}
              </div>
              <div>
                <h3>Friends : </h3>
                {userDetails.friends.map((req, ind) => {
                  return <p key={ind}>{req.email}</p>;
                })}
              </div>
            </div>
            <div className="textfields">
            <form onSubmit={addFriend}>
              <input
                value={addFriendEmail.value}
                onChange={addFriendEmail.handleChange}
                type="text"
                placeholder="Add Friend"
              />
              <button className="btn">Send</button>
            </form>
            <form onSubmit={removeFriend}>
              <input
                value={removeFriendEmail.value}
                onChange={removeFriendEmail.handleChange}
                type="text"
                placeholder="Remove Friend"
              />
              <button className="btn">Send</button>
            </form>
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
               <input
                value={storeName.value}
                onChange={storeName.handleChange}
                type="text"
                placeholder="Store Name"
              />
                <input
                value={phoneNo.value}
                onChange={phoneNo.handleChange}
                type="text"
                placeholder="Phone Number"
              />
              <button className="btn">Submit</button>
            </form>
            {userDetails.isMerchant && userDetails.isMerchant.isVerified === false ? (
              <h1>Application Status: Not Verified </h1>
            ) : (
              <h1>Verified Merchant</h1>
            )}
          </>
        )}
        {role === 2 && (
          <>
            {userDetails.isDoctor.isVerified === false ? (
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
                <h1>Application Status: Not Verified </h1>
              </>
            ) : (
              <>
                <h1>Patients Details</h1>
                {userFriends.map((friend, ind) => {
                  return (
                    <div className="freindsHistory">
                      <FriendsList user={friend} key={ind} />
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
        {
            role === 3 && <>
              <div className="merchant-dashboard">
                <div className="top">
                <h1>Merchant Dashboard</h1>
                <main>
                { merchantItems.length && <> <h1>Items</h1>
                   <div className="items">
                  {/* <div className="merchant-item">
                          <h3>Test</h3>
                          <span>25</span>
                          <div className="desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate labore veniam, quaerat, ab sunt sequi mollitia velit rem enim accusamus tenetur</div>
                          <div className="cost">{35} /-</div>
                          <div className="delete">Delete Item</div>
                        </div> */}
                    {
                      merchantItems.map(item=>{
                        return <div className="merchant-item">
                          <h3>{item.itemName}</h3>
                          <span>Quantity: {item.quantity}</span>
                          <div className="desc">{item.description}</div>
                          <div className="cost">Cost: {item.cost} /-</div>
                          <div onClick={()=>handleItemDelete(item._id)} className="delete">Delete Item</div>
                        </div>
                      })
                    }
                  </div> </>}
                  
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
                <a href={item.certificateLink}><i className="fa fa-eye"></i></a>
                <div className="name">{item.firstName +" " + item.lastName}</div>
                <button onClick={()=>handleVerifyMerchant(item.merchantId)} className="verify">Verify</button>
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
                <a href={item.certificateLink}><i className="fa fa-eye"></i></a>
                <div className="name">{item.firstName +" " + item.lastName}</div>
                <button onClick={()=>handleVerifyDoc(item.doctorId)} className="verify">Verify</button>
              </div>
              })}
    </div>

            </h1> 
            </section>
            </>}
          </div>
        }

        {
          role ===5 && <div className="find-meds">
            <h1>Find Medicine</h1>
              <input type="text" value={search.value} onChange={search.handleChange} placeholder="Search" />
              
                {
                  !getFilteredMedicine().length &&  <h1 style={{marginTop:30}} >No Medicine found</h1>
                }

              {!!getFilteredMedicine().length && getFilteredMedicine().map(data=>{
               return  <div className="data">
                  <h3>{data.itemName}</h3>
                  <p>{data.description}</p>
                  <div className="quantity">
                    Quantity available: {data.quantity}
                  </div>
                  {data.merchantId.location.city} - <a href={`tel:${data.merchantId.phoneNumber}`} >{data.merchantId.phoneNumber}</a>
                </div>

              })}
          </div>
        }
      </main>
    </div>
  );
}
