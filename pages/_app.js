import React, { useState, useEffect } from "react";
import Head from "next/Head";
import Cookies from "js-cookie";

import { Auth } from "../Components/index";

//internal import
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const [auth, setAuth] = useState(true);

  useEffect(() => {
    const storedCookiedValue = Cookies.get("token");

    if (!storedCookiedValue) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Ai Image Art</title>
        <meta
          name="description"
          content="Ai image Art Generator Powered By Natochi Tech"
        />
        <link rel="shortcut" href="/assets/ailogo.png" />
      </Head>
      {auth && <Auth />}

      <Component {...pageProps} />
    </>
  );
}
