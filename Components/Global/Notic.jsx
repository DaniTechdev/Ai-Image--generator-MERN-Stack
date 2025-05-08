import React, { useState, useEffect } from "react";
import { Tick, ArrowDown } from "../SVG/index";

const Notic = () => {
  const [openNotic, setOpenNotic] = useState(false);
  const [activeModel, setActiveModel] = useState("AI Image Dall-e-v2");

  const AI_MODEL = ["AI Image Dall-e-v2", "AI Image Dall-e-v3"];

  const [aiModel, setAiModel] = useState("AI Image Dall-e-v2");

  const changeModel = (model) => {
    setAiModel(model);

    localStorage.setItem("Active_MODEL", model);
    setActiveModel(model);
    setOpenNotic(false);
    window.location.reload();
  };

  useEffect(() => {
    var value = localStorage.getItem("Active_MODEL");
    if (value) {
      setAiModel(value);
      setActiveModel(value);
    }
  }, []);

  return (
    <div
      className="flex w-full max-w-[600px] px-4 md:ml-[48px]
       pl-5 md:px-5 "
      Style={{
        position: "relative",
      }}
    >
      {openNotic && (
        <div
          Style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "238.492px",
            top: "0",
            bottom: "0px",
            minHeight: "72px",
            maxHeight: "753px",
            zIndex: "auto",
            position: "absolute",
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              outline: "none",
              pointerEvents: "auto",
            }}
          >
            <div
              className="bg-zinc-800 p-1 drop-shadow-md border border-zinc-700 rounded-md"
              style={{
                position: "relative",
                flex: "1 1 0%",
                overflow: "auto",
              }}
            >
              <div className="select-none">
                {AI_MODEL.map((model, index) => {
                  <div
                    key={model}
                    onClick={() => changeModel(model)}
                    className="flex space-x-2 items-center px-4 pl-8 py-2
                  cursor-pointer hover:bg-zinc-700 rounded text-xs relative 
                  focus:outline-none"
                  >
                    <span>{model}</span>
                    {aiModel == model && (
                      <span className="w-6 left-0 absolute"></span>
                    )}
                  </div>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notic;
