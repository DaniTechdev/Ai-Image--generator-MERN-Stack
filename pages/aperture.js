import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

//internal import
import {
  FaInstagram,
  AiOutlineYoutube,
  BsCameraReelsFill,
} from "../Components/SVG/index";

import {
  Header,
  GetStarted,
  SingleImage,
  ApertImageCard,
  Subscription,
  PromptInput,
  Prompt,
  Button,
  AIProcessing,
} from "../Components/index";

import {
  IMAGE_GENERATOR_V2,
  IMAGE_GENERATOR_V3,
  GET_USER_AI_IMAGES,
  GET_AI_IMAGES,
  CHECK_AUTH,
} from "../Utils/index";

const index = () => {
  const [loader, setloader] = useState(false);
  const [activeModel, setActiveModel] = useState(false);
  const [error, setError] = useState();

  const [category, setCategory] = useState("Reel");
  const [singleID, setSingleID] = useState();

  const [activeUser, setActiveUser] = useState();
  const [allAIImages, setAllAIImages] = useState();

  const [search, setSearch] = useState("");
  const [searchItem, setsearchItem] = useState(search);

  //V3
  const [V3_1024x1024, setV3_1024x1024] = useState();
  const [V3_1792x1024, setV3_1792x1024] = useState();
  const [V3_1024x1792, setV3_1024x1792] = useState();

  //V2
  const [V2_256x256, setV2_256x256] = useState();
  const [V2_512x512, setV2_512x512] = useState();
  const [V2_1024x1024, setV2_1024x1024] = useState();

  const [prompv3, setPrompv3] = useState({
    prompt: "",
    nagativePrompt: "",
    size: "1024x1024",
    style: "vivid",
  });

  const [prompv2, setPrompv2] = useState({
    prompt: "",
    nagativePrompt: "",
    size: "256x256",
    n: 3,
  });

  useEffect(() => {
    var value = localStorage.getItem("ACTIVE_MODEL");

    if (value) {
      setActiveModel(value);
    }
  }, [activeModel]);

  const CLICK_V3 = async (promptv3) => {
    try {
      setloader(true);
      const response = await IMAGE_GENERATOR_V3(promptv3);
      if (response == "Data is missing") {
        setError(response);
      } else if (response.status == 201) {
        setloader(false);
        setSingleID(response.data.post._id);
      }
    } catch (error) {
      const errorMesssage =
        error.message || "An unexpected error occured (OpenAi)";
      setloader(false);
      setError(errorMesssage);
    }
  };

  const CLICK_V2 = async (promptv2) => {
    try {
      setloader(true);
      const response = await IMAGE_GENERATOR_V2(promptv2);
      if (response == "Data is missing") {
        setError(response);
      } else if (response.status == 201) {
        setloader(false);
        setSingleID(response.data.post._id);
      }
    } catch (error) {
      const errorMesssage =
        error.message || "An unexpected error occured (OpenAi)";
      setloader(false);
      setError(errorMesssage);
    }
  };

  const changeCategory = (category) => {
    const model = localStorage.getItem("ACTIVE_MODEL");

    if (model == "AI Image Art Dall-e-v2") {
      if (category == "Reel") {
        setAllAIImages(V2_256x256);
        setAllPostCopy(V2_256x256);
        setCategory("Reel");
      } else if (category == "Instagram") {
        setAllAIImages(V2_512x512);
        setAllPostCopy(V2_512x512);
        setCategory("Instagram");
      } else if (category == "YouTube") {
        setAllAIImages(V2_1024x1024);
        setAllPostCopy(V2_1024x1024);
        setCategory("YouTube");
      }
    } else {
      if (category == "Reel") {
        setAllAIImages(V3_1024x1792);
        setAllPostCopy(V3_1024x1792);
        setCategory("Reel");
      } else if (category == "Instagram") {
        setAllAIImages(V3_1024x1024);
        setAllPostCopy(V3_1024x1024);
        setCategory("Instagram");
      } else if (category == "YouTube") {
        setAllAIImages(V3_1792x1024);
        setAllPostCopy(V3_1792x1024);
        setCategory("YouTube");
      }
    }
  };

  const CALLING_ALL_POST = async () => {
    try {
      const response = await GET_AI_IMAGES();

      console.log("all images response", response);
      console.log(response);

      const V2_256x256Temp = [];
      const V2_512x512Temp = [];
      const V2_1024x1024Temp = [];

      const V3_1024x1024Temp = [];
      const V3_1792x1024Temp = [];
      const V3_1024x1792Temp = [];

      response.forEach((el) => {
        if (el.aiModel === "AI Image Art Dall-e-v2") {
          if (el.size === "256x256") {
            V2_256x256Temp.push(el);
          } else if (el.size === "512x512") {
            V2_512x512Temp.push(el);
          } else if (el.size === "1024x1024") {
            V2_1024x1024Temp.push(el);
          }
        } else if (el.aiModel === "AI Image Art Dall-e-v2") {
          if (el.size === "1024x1024") {
            V3_1024x1024Temp.push(el);
          } else if (el.size === "1792x1024") {
            V3_1792x1024Temp.push(el);
          } else if (el.size === "1024x1792") {
            V3_1024x1792Temp.push(el);
          }
        }
      });

      setV2_256x256(V2_256x256Temp);
      setV2_512x512(V2_512x512Temp);
      setV2_1024x1024(V2_1024x1024Temp);

      setV3_1024x1024(V3_1024x1024Temp);
      setV3_1024x1792(V3_1024x1792Temp);
      setV3_1792x1024(V3_1792x1024Temp);

      const model = localStorage.getItem("ACTIVE_MODEL");

      if (model == "AI Image Art Dall-e-v2") {
        setAllAIImages(V2_256x256Temp);
        setAllPostCopy(V2_256x256Temp);
      } else {
        setAllAIImages(V3_1024x1024Temp);
        setAllPostCopy(V3_1024x1792Temp);
      }

      const storedCookiedValue = Cookies.get("token");

      if (storedCookiedValue) {
        const user = await CHECK_AUTH();
        setActiveUser(user);
      }

      console.log(response);
      console.log("all images response", response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    CALLING_ALL_POST();
  }, []);

  //to make sure the first imagess from the array is rendered we will reverse the array

  const arrayRender = [...(allAIImages?.reverse() || [])];

  return (
    <div>
      <Header />
      <div className="mb-[56px] sm:mb-0 sm:mt-[56px]">
        <GetStarted activeUser={activeUser} />

        <div>
          <div className="w-screen overflow-x-hidden ">
            <div className="flex items-center w-full    mt-8  sm:mt-4 md:mt-10">
              <div
                className="px-2 md:px-10 lg:px-16 flex items-center
              flex-col max-w-[1300px] w-full"
              >
                {/* PART 1 */}
                <div className="w-full flex flex-col-reverse md:flex-row">
                  <Prompt
                    promptv3={prompv3}
                    setPrompv3={setPrompv3}
                    promptv2={prompv2}
                    setPrompv2={setPrompv2}
                    loader={loader}
                    error={error}
                    activeUser={activeUser}
                    generateFunction={() =>
                      activeModel == "Ai Image Art Dall-e-v3"
                        ? CLICK_V3(prompv3)
                        : CLICK_V2(prompv2)
                    }
                  />
                  <PromptInput
                    promptv3={prompv3}
                    setPrompv3={setPrompv3}
                    promptv2={prompv2}
                    setPrompv2={setPrompv2}
                    activeModel={activeModel}
                    setActiveModel={setActiveModel}
                    activeUser={activeUser}
                  />
                </div>

                <div
                  className="items-center w-full max-w-[800px] mt-8  px-4 pl-5  md:px-5 
                "
                  style={{
                    minHeight: "1px",
                    position: "relative",
                  }}
                >
                  <div></div>
                </div>
                <Subscription activeUser={activeUser} />
              </div>

              <div className="flex  justify-center">
                <button
                  onClick={() =>
                    openFilter ? setOpenFilter(false) : setOpenFilter(true)
                  }
                  type="button"
                  className="ml-2 h-10 w-10 rounded-full cursor-pointer flex items-center
                   justify-center bg-transparent hover:bg-zinc-900"
                >
                  <Filter />
                </button>
              </div>
            </div>
            <div
              className="flex w-full max-w-[600px] md:ml-[48px] px-4 pl-4 md:px-5 bg-yellow-100 "
              style={{
                position: "relative",
              }}
            />
            {openFilter && <Notic />}

            <div className="mb-8 flex flex-col items-center">
              <div className="flex space-x-2">
                <button
                  className="w-32 sm:w-36 flex items-center text-xs justify-center text-center h-9 rounded-full hover:brightness-110
                  bg-opacity-0 shadow-sm mt-4 bg-gradient-to-t from-indigo-900 via-indigo-900 to-indigo-800"
                >
                  Search
                </button>
                <a href="/aperture">
                  <button
                    className="w-32 sm:w-36 flex items-center text-xs 
                      justify-center text-center h-9 rounded-full
                     hover:brightness-110
                     bg-opacity-0 shadow-sm mt-4 border border-gray-700 hover:bg-zinc-700"
                  >
                    Generate
                  </button>
                </a>
              </div>
            </div>

            <div className="flex space-x-2 px-2">
              <Button
                icon={<BsCameraReelsFill />}
                name={"Reel"}
                handleClick={() => changeCategory("Reel")}
                category={category}
              />

              <Button
                icon={<AiOutlineYoutube />}
                name={"YouTube"}
                handleClick={() => changeCategory("YouTube")}
                category={category}
              />

              <Button
                icon={<FaInstagram />}
                name={"Instagram"}
                handleClick={() => changeCategory("Instagram")}
                category={category}
              />
            </div>

            <div className="mt-2">&nbsp;</div>
            <div className="mt-3 relative px-2 md:px-7 w-full">
              <div
                className="active:outline-none focus:outline-none overflow-hidden
              new-css-style-box"
                role="grid"
                tabIndex="0"
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  gap: "1rem",
                }}
              >
                <>
                  {arrayRender.reverse().map((item, index) => (
                    <ImageCard
                      index={index}
                      item={item}
                      setSingleID={setSingleID}
                      activeUser={activeUser}
                    />
                  ))}
                </>
              </div>
            </div>
          </div>
        </div>
      </div>

      {singleID && (
        <SingleImage setSingleID={setSingleID} singleID={singleID} />
      )}

      {buying && <PaymentProssing buying={buying} setBuying={setBuying} />}
    </div>
  );
};

export default index;
