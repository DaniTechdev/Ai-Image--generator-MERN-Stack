import React from "react";

const Subscription = ({ activeUser }) => {
  return (
    <div
      className="flex flex-colum w-full flex-1 
  items-center justify-center"
      style={{
        position: "relative",
      }}
    >
      <div className="max-w-[800px]">
        <div
          className="my-4 mb-8 text-sm 
        bg-indigo-800 relative border-l-4 
        border-l-indigo-500 bg-opacity-10
        rounded-lg border border-indigo-900
        border-opacity-50 shadow-md py-2 
        items-center
         w-full px-4"
        >
          <p className="font-medium text-sm mt-1">
            {activeUser?.credit > 5
              ? ` Welcome @${activeUser?.username}`
              : `${activeUser?.username} 
            : Your Credit left ${activeUser?.credit}`}
          </p>

          <p className="mt-2 text-sm">
            <span>
              {activeUser?.credit
                ? "ut sit accusantium, ipsum illo sapiente quo qui optio vitae nostrum velit tempore voluptas vero quod distinctio?"
                : "         Lorem ipsum dolor sit amet, consectetur adipisicing elit. A voluptate consequuntur eos iusto"}
            </span>
          </p>
          <a href="/account">
            <button
              className="mt-4 mb-2 text-sm px-4
              bg-gradient-to-t
            from-indigo-700 via-indigo-700 
            to-indigo-700 rounded-md drop-shadow
            text-md shadow active:scale-95 
            transition-all hover:brightness-110"
            >
              view plans
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
