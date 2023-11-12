import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: { fontSize: "14px", backgroundColor: "gray", color: "white" },
      }}
    />
  );
};

export default ToastProvider;
