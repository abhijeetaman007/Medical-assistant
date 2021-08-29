import React, {useEffect , useState} from "react";
import { get, post } from "../utils/requests";

function FriendsList() {
  const fetchFriends = async () => {
    try {
      await get(`/user/getfriends`).then((data) => {
        console.log(data.data);
        // setPatients(data.data);
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const [collpase, setCollpase] = useState(false);

  return (
    <div>
      <button type="button" onClick={() =>setCollpase(!collpase)}>
        Name
      </button>
        {collpase === true ? <> 
            <div class="content">
        <p>Patient History</p>
      </div>
        </> : <></>}
    </div>
  );
}

export default FriendsList;
