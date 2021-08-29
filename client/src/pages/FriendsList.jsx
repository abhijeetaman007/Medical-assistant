import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { get, post } from "../utils/requests";
import useForceUpdate from "../hooks/useForceUpdate";
import { storeFile } from "../utils/utilities";
import useInputState from "../hooks/useInputState";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../context/AuthContext";



function FriendsList({ user }) {
  const [userDetails, setUserDetails] = useState({});
  const [detailsLoad, setDetailsLoad] = useState(true);
  const historyFileRef = React.useRef(null);
  const update = useForceUpdate();
  const description = useInputState();
  const { addToast } = useToasts();
  const auth = useAuth();



  const fetchUserDetails = async () => {
    try {
      await get(`/user/viewprofile/${user.userId}`).then((data) => {
        console.log(data.data);
        setUserDetails(data.data);
        setDetailsLoad(false);
        console.log(data.data.isDoctor.isVerified);

        // if(data.data.isMerchant.isVerified)fetchMerchants();
      });
    } catch (err) {
      console.log(err);
    }
  };
  



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
      await post(`/user/updatehistory/${userDetails._id}`, {
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
    fetchUserDetails();
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const [collpase, setCollpase] = useState(false);

  if (detailsLoad === true) return <Loading />;

  return (
    <div>
      <span>
      <i class="fas fa-user-md fa-2x"></i>
      <button type="button" onClick={() => setCollpase(!collpase)}>
        {userDetails.firstName + " " + userDetails.lastName}
      </button>
      </span>
      {collpase === true ? (
        <>
          <div class="friendscontent">
            
            
            <div className="historyWrapper">
            <p>Patient History</p>
              {userDetails.history.map((his, index) => {
                return (
                  <div className="history">
                    <img src={his.imageLink} alt="history-img" />
                    <p>{his.description}</p>
                  </div>
                );
              })}
              <form onSubmit={postHistory}>
              <h3>Upload for {userDetails.firstName}</h3>
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
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default FriendsList;
