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

  // console.log("login", login);
  const [signUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // console.log("SignUp", signUp);

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

      console.log("login response from from end", response);

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
      />
      <div
        className="bg-zinc-800 items-center fixed shadow-xl rounded-2xl z-50 px-8
        py-8 text-sm border border-zinc-700  "
        style={{
          top: "50%",
          transform: "translate(-50%, -50%)",
          left: "50%",
          maxWidth: "330px",
          maxHeight: "85vh",
          width: "80%",
        }}
      >
        <div>
          <div className="flex flex-col text-zinc-200  text-center items-center">
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
                <button
                  onClick={() => CALLING_LOGIN_USER(login)}
                  className="hover:brightness-110 bg-gradient-to-t from-indigo-800
                    via-indigo-800 to-indigo-700 border border-indigo-800 px-4 py-1.5
                    rounded-lg shadow h-9 w-64 drop-shadow flex items-center
                    justify-center mt-3"
                >
                  Login{loader && <Loader />}
                </button>
                {error && (
                  <p
                    style={{
                      color: "red",
                      paddingTop: ".5rem",
                    }}
                  >
                    NOTICE:{error}
                  </p>
                )}
                <p
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    gap: ".5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setAuth(false)}
                >
                  SignUp <IoLogInOutline />
                </p>
              </div>
            ) : (
              <div
                style={{
                  marginTop: "1rem",
                }}
              >
                <Input
                  placeholder={"Name"}
                  type="text"
                  handleChange={(e) =>
                    setSignUp({ ...signUp, name: e.target.value })
                  }
                />
                <Input
                  placeholder={"email"}
                  type="email"
                  handleChange={(e) =>
                    setSignUp({ ...signUp, email: e.target.value })
                  }
                  styleCss="1rem"
                />
                <Input
                  placeholder={"Password"}
                  type="text"
                  handleChange={(e) =>
                    setSignUp({ ...signUp, password: e.target.value })
                  }
                  styleCss="1rem"
                />
                <Input
                  placeholder={"Confirm Passsword"}
                  type="text"
                  handleChange={(e) =>
                    setSignUp({ ...signUp, confirmPassword: e.target.value })
                  }
                  styleCss="1rem"
                />
                <button
                  onClick={() => CALLING_REGISTER_USER(signUp)}
                  className="hover:brightness-110 bg-gradient-to-t from-indigo-800
                    via-indigo-800 to-indigo-700 border border-indigo-800 px-4 py-1.5
                    rounded-lg shadow h-9 w-64 drop-shadow flex items-center
                    justify-center mt-3"
                >
                  SignUp{loader && <Loader />}
                </button>
                {error && (
                  <p
                    style={{
                      color: "red",
                      paddingTop: ".5rem",
                    }}
                  >
                    NOTICE:{error}
                  </p>
                )}
                <p
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    gap: ".5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setAuth(true)}
                >
                  Login <IoLogInOutline />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
