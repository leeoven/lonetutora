var fs = require("fs");

const RFC3339Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const NumericRegex = /^-?\d*\.?\d+$/;

function sanitizeKey(key) {
  // Remove leading and trailing whitespace
  return key.trim();
}

function parseString(value) {
  if (typeof value !== "string") {
    throw new Error("invalid string value");
  }
  value = value.trim();

  if (value.length < 1) {
    throw new Error("empty string");
  }
  if (RFC3339Regex.test(value)) {
    return new Date(value).getTime();
  }
  return value.trim();
}

function parseNumber(value) {
  if (typeof value !== "string") {
    throw new Error("invalid numeric value");
  }
  value = value.trim();
  if (NumericRegex.test(value)) {
    return parseFloat(value);
  } else {
    throw new Error("invalid numeric value");
  }
}

function parseBoolean(value) {
  if (typeof value !== "string") {
    throw new Error("invalid boolean value");
  }
  value = value.trim();
  const trues = ["1", "t", "T", "TRUE", "true", "True"];
  const falses = ["0", "f", "F", "FALSE", "false", "False"];
  if (trues.includes(value)) {
    return true;
  } else if (falses.includes(value)) {
    return false;
  } else {
    throw new Error("invalid boolean value");
  }
}

function parseNull(value) {
  if (parseBoolean(value)) return null;
  throw new Error("invalid null value");
}

function parseList(value) {
  if (!Array.isArray(value)) {
    throw new Error("invalid boolean value");
  }
  const tryParseOrNull = (func, value) => {
    try {
      return func(value);
    } catch {
      return null;
    }
  };
  const list = value
    .map((elem) => {
      try {
        if (typeof elem !== "object") {
          throw new Error("invalid list element value");
        }
        if (Object.keys(elem).length < 1) {
          throw new Error("invalid list element value");
        }
        const elementType = Object.keys(elem)[0].trim();
        if (["S", "N", "S", "BOOL"].includes(elementType)) {
          return parseValue(elementType, elem[elementType]);
        }
        throw new Error("invalid list element value");
      } catch {
        return null;
      }
    })
    .filter((elem) => elem !== null && elem !== undefined);

  if (list.length < 1) {
    throw new Error("empty list");
  }
  return list;
}

function parseMap(mapObj) {
  if (typeof mapObj !== "object") {
    throw new Error("invalid map value");
  }
  const result = {};
  const keys = Object.keys(mapObj).sort();
  keys.forEach((elemKey) => {
    if (typeof elemKey !== "string") return;
    elemKey = elemKey.trim();
    if (elemKey.length < 1) return;
    const elemValue = mapObj[elemKey];
    try {
      if (typeof elemValue !== "object") {
        throw new Error("invalid map element value");
      }
      if (Object.keys(elemValue).length < 1) {
        throw new Error("invalid map element value");
      }

      // we are ignoring if an object has other useless field other than the first on which should be the type
      const elementType = Object.keys(elemValue)[0].trim();
      const actualValue = parseValue(elementType, elemValue[elementType]);
      result[elemKey] = actualValue;
    } catch (error) {
      return;
    }
  });

  if (Object.keys(result).length < 1) {
    throw new Error("empty map");
  }
  return result;
}

function parseValue(valueType, value) {
  switch (valueType) {
    case "S":
      return parseString(value);
    case "N":
      return parseNumber(value);
    case "BOOL":
      return parseBoolean(value);
    case "NULL":
      return parseNull(value);
    case "L":
      return parseList(value);
    case "M":
      return parseMap(value);
    default:
      throw new Error("invalid data type");
  }
}

function transformJSON(input) {
  try {
    // every element seems a map at the root
    return parseMap(input);
  } catch (error) {
    console.log("invalid input. detail:", error.message);
  }
}

function print(transformedJson) {
  console.log(JSON.stringify(transformedJson, null, 2));
}

if (process.argv.length < 3) {
  console.log("invalid input. usage: node index.js <input.json>");
  process.exit(1);
}

// TODO: handle big files
const input = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

// we assume it's an object or an array
if (Array.isArray(input)) {
  input.forEach((json) => {
    print(transformJSON(json));
  });
} else {
  print(transformJSON(input));
}
