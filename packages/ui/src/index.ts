import toast, { Toaster, useToaster, useToasterStore } from "react-hot-toast";

export * from "./components";
export * from "./hooks";

export { toast, Toaster, useToaster, useToasterStore };

Toaster.defaultProps = {
  position: "top-right",
  toastOptions: {
    style: {},
    success: {
      className: "!ring ring-success !bg-green-100",
    },
    error: {
      className: "!ring ring-error !bg-red-100",
    },
    loading: {},
    className: "",
  },
};
