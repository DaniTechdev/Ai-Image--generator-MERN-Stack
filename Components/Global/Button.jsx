import React from "react";

const Button = ({ icon, name, handleClick, category }) => {
  return (
    <button
      onClick={handleClick}
      className={`text-xs rounded-md sm:text-sm group  mt-4 
     whitespace-nowrap flex-1 flex select-none cursor-pointer
     hover:brightness-110 bg-gradient-to-t w-fit-content justify-content items-center
     px-2.5 drop=shadow ${
       category == name
         ? "from-indigo-900 via-indigo-900 to-indigo-800 py-2.5 active:scale-95 transition-all"
         : "form-zinc-700 via-zinc-900  to-zinc-700 py-2"
     }`}
    >
      {icon} &nbsp; &nbsp; {name}
    </button>
  );
};

export default Button;
