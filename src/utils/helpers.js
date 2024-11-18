import { every, some } from "lodash";

export const createGfKeyFromField = (string) => {
  const fieldName = "input_";
  const field = string.slice(string.indexOf(fieldName) + fieldName.length);
  return field.replace("_", ".");
};

export const doesObjectExist = (obj) => {
  if (typeof obj !== "undefined") {
    return true;
  }
  return false;
};

export const filteredKeys = (obj, filter) => {
  let key,
    keys = [];
  for (key in obj)
    if ({}.hasOwnProperty.call(obj, key) && filter.test(key)) keys.push(key);
  return keys;
};

export const valueToLowerCase = (string) =>
  string ? string.toLowerCase() : "";

const convertConditionalLogic = (fieldValue, operator, value) => {
  const testValue = fieldValue ?? '';
  switch (operator) {
    case 'IS':
      return testValue === value;
    case 'IS_NOT':
      return testValue !== value;
    case 'GREATER_THAN':
      return testValue > value;
    case 'LESS_THAN':
      return testValue < value;
    case 'CONTAINS':
      return testValue?.includes(value);
    case 'STARTS_WITH':
      return testValue?.startsWith(value);
    case 'ENDS_WITH':
      return testValue?.endsWith(value);
    default:
      return false;
  }
}

export const getMatchesConditionalLogic = (values, rules, logicType) =>
    logicType === 'ALL' ?
        every(rules, ({ fieldId, operator, value }, i) => {
          return convertConditionalLogic(values[i], operator, value);
        }) :
        some(rules, ({ fieldId, operator, value }, i) => {
          return convertConditionalLogic(values[i], operator, value);
        })

export const getQueryParam = (name) => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
}