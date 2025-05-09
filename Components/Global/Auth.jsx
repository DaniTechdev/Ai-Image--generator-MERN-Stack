import React, { useState } from "react";
import { LoginLogo, Loader } from "../SVG/index";
import { REGISTER_USER, LOGIN_USER } from "../../Utils/index";

const Auth = () => {
  const [auth, setAuth] = useState(true);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [signUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const CALLING_REGISTER_USER = async () => {
    try {
      setLoader(true);
      const response = await REGISTER_USER(signUp);
    } catch (error) {
      console.log(error);
    }
  };
  return <div>Auth</div>;
};

export default Auth;
