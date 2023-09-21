/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { camelize, underscore } from "inflection";

export const createAminoTypeNameFromProtoTypeUrl = (typeUrl: string) => {
  if (typeUrl.startsWith("/ibc")) {
    return typeUrl
      .split(".")
      .filter(Boolean)
      .filter((part) => !/applications|v1|transfer/.test(part))
      .map((part) => (part === "/ibc" ? "cosmos-sdk/ibc" : part))
      .join("/");
  }

  const [, cosmosModule, , messageType] = typeUrl.split(".");

  const aminoTypeUrl = `${cosmosModule}/${messageType}`;

  switch (aminoTypeUrl) {
    case "dispensation/CreateUserClaim": {
      return "dispensation/claim";
    }
    case "bank/MsgSend": {
      return "cosmos-sdk/MsgSend";
    }
    default: {
      return aminoTypeUrl;
    }
  }
};

type UnknownRecord = Record<string, unknown>;

export const convertToSnakeCaseDeep = (obj: UnknownRecord): any => {
  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertToSnakeCaseDeep(item));
  }

  const newObj: UnknownRecord = {};

  for (const prop in obj) {
    newObj[underscore(prop)] = convertToSnakeCaseDeep(
      obj[prop] as UnknownRecord
    );
  }

  return newObj;
};

export const convertToCamelCaseDeep = (obj: UnknownRecord): any => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCaseDeep(item));
  }

  const newObj: UnknownRecord = {};

  for (const prop in obj) {
    newObj[camelize(prop, true)] = convertToCamelCaseDeep(
      obj[prop] as UnknownRecord
    );
  }

  return newObj;
};
