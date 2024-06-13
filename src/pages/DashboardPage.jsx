import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";

const DashboardPage = (props) => {
  const [users, setUsers] = React.useState([]);

  const getUsers = () => {
    axios
      .get("http://localhost:4000/api/v1/user/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        console.log(response);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
          console.error("Unexpected response data:", response.data);
        }
      })
      .catch((err) => {
        setTimeout(getUsers, 3000);
      });
  };

  React.useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  const createChatroom = () => {
    const chatroomName = chatroomNameRef.current.value;

    axios
      .post(
        "http://localhost:4000/api/v1/user/",
        {
          name: chatroomName,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((response) => {
        makeToast("success", response.data.message);
        getUsers();
        chatroomNameRef.current.value = "";
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  const chatroomNameRef = React.createRef();

  return (
    <div className="card">
      <div className="cardHeader">Users</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            ref={chatroomNameRef}
            placeholder="ChatterBox Nepal"
          />
        </div>
      </div>
      <button onClick={createChatroom}>Create Chatroom</button>
      <div className="chatrooms">
        {users ? (
          users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="chatroom">
                <div>{user.userName}</div>
                <Link to={"/chatroom/" + user._id}>
                  <div className="join">chat</div>
                </Link>
              </div>
            ))
          ) : (
            <h3>No Users</h3>
          )
        ) : (
          <h2>No users data yet</h2>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
