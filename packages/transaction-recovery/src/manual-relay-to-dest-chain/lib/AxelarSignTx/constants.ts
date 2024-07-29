export const SignCommandsError = {
  ALREADY_EXECUTED: new Error("Already executed approved batched tx"),
  SIGN_COMMANDS_FAILED: new Error(`Failed to sign commands`),
  SEARCH_BATCH_COMMANDS_FAILED: new Error("Failed to search batched commands"),
};

export const SignCommandsSkipReason = {
  ALREADY_EXECUTED:
    "No need to sign commands because they are already executed",
};
