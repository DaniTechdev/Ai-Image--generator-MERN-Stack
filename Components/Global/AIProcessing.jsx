import React from "react";

import { LoginLogo } from "../SVG/index";

const AIProcessing = () => {
  return (
    <>
      <div
        className="fixed inset-0 bg-zinc-900 bg-opacity-40 z-50"
        style={{
          pointerEvents: "auto",
        }}
      >
        <div
          className="bg-zinc-800 items-center fixed
        shadow-xl rounded-2xl z-50 px-8 py-8 
        text-sm border border-zinc-700"
          style={{
            top: "50%",
            transform: "translate(-50%,-50%)",
            left: "50%",
            maxWidth: "330px",
            width: "100%",
            maxHeight: "85vh",
          }}
        >
          <div>
            <div className="flex flex-col text-zinc-200 text-center items-center">
              <LoginLogo />
              <div className="new_loader JS_on">
                <span className="binary"> </span>
                <span className="binary"> </span>
                <span className="getting-there">Ai Processing ... </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIProcessing;
