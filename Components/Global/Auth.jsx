import React, { useState } from "react";
import { LoginLogo, IoLogInOutline } from "../SVG/index";
import { REGISTER_USER, LOGIN_USER } from "../../Utils/index";
import { Input, Loader } from "../index";

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

      if (response) {
        setLoader(false);
        setError(response);
      }
    } catch (error) {
      setLoader(false);
      setError(error.response.data.error);
      console.log(error);
    }
  };

  const CALLING_LOGIN_USER = async () => {
    try {
      setLoader(true);
      const response = await LOGIN_USER(login);

      if (response) {
        setLoader(false);
        setError(response);
      }
    } catch (error) {
      setLoader(false);
      setError(error.response.data.error);
      console.log(error);
    }
  };
  return (
    <>
      <div
        className="fixed inset-0 bg-zinc-900 
      bg-opacity-40 z-50"
        style={{
          pointerEvents: "auto",
        }}
      >
        <div
          className="bg-zinc-800 items-center fixed shadow-xl rounded-2xl z-50 px-8 
        py-8 text-sm border border-zinc-700"
          style={{
            top: "50%",
            transform: "translate(-50%, -50%)",
            left: "50%",
            maxWidth: "330px",
            maxHeight: "85vh",
          }}
        >
          <div>
            <div className="flex flex-col text-zinc-200 items-center">
              <LoginLogo />

              {auth ? (
                <div
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  <Input
                    placeholder={"Email Address"}
                    type="email"
                    handleChange={(e) =>
                      setLogin({ ...login, email: e.target.value })
                    }
                  />

                  <Input
                    placeholder={"Password"}
                    type="text"
                    handleChange={(e) =>
                      setLogin({ ...login, password: e.target.value })
                    }
                    styleCss="1rem"
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
