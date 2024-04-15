const fs = require("fs");
const transformer = require("./transformer.js");

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
    print(transformer.transformJSON(json));
  });
} else {
  print(transformer.transformJSON(input));
}
