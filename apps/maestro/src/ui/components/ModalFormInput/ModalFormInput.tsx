import { TextInput } from "@axelarjs/ui";

const ModalFormInput = Object.assign({}, TextInput, {
  defaultProps: {
    ...TextInput.defaultProps,
    className: "bg-base-200",
    bordered: true,
  },
}) as typeof TextInput;

export default ModalFormInput;
