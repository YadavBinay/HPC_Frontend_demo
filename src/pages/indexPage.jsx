import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
    //eslint-disable-next-line
  }, []);

  return <div>INDEX</div>;
};

export default IndexPage;
