import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const ChatroomPage = ({ socket }) => {
  const { id: reciverId } = useParams();
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");

  const getMessage = async () => {
        axios
          .get("http://localhost:4000/api/v1/chat/messages", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("CC_Token"),
            },
            body:{
              senderId: socket.userId,
              reciverId: reciverId
            }
          })
          .then((response) => {
            console.log(response);
            if (Array.isArray(response.data)) {
              setMessages(response.data);
            } else {
              setMessages([]);
              console.error("Unexpected response data:", response.data);
            }
          })
          .catch((err) => {
            setTimeout(setMessages, 3000);
          });
  }
  const sendMessage = () => {
    if (socket) {
      console.log({ reciverId, message: messageRef.current.value }); // Log the values
      socket.emit("sendMessage", {
        reciverId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", { chatroomId: reciverId });
    }
    return () => {
      if (socket) {
        socket.emit("leaveRoom", { chatroomId: reciverId });
      }
    };
  }, [socket, reciverId]);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom</div>
        <div className="chatroomContent">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                userId === message.userId ? "ownMessage" : "otherMessage"
              }
            >
              <span className="messageSender">{message.name}:</span>{" "}
              {message.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <input
            type="text"
            name="message"
            placeholder="Type a message..."
            ref={messageRef}
          />
          <button className="join" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatroomPage;
