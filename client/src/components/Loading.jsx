import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = ({ fullScreen = false }) => {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed top-0 left-0 w-full h-full z-50 bg-white/70 flex justify-center items-center"
          : "flex justify-center items-center"
      }`}
    >
      <ClipLoader size={40} color="#0d6efd" />
    </div>
  );
};

export default Loading;
