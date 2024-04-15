const transformer = require("./transformer.js");

const sampleInput = {
    "number_1": {
      "N": "1.50"
    },
    "string_1": {
      "S": "784498 "
    },
    "string_2": {
      "S": "2014-07-16T20:55:46Z"
    },
    "map_1": {
      "M": {
        "bool_1": {
          "BOOL": "truthy"
        },
        "null_1": {
          "NULL ": "true"
        },
        "list_1": {
          "L": [
            {
              "S": ""
            },
            {
              "N": "011"
            },
            {
              "N": "5215s"
            },
            {
              "BOOL": "f"
            },
            {
              "NULL": "0"
            }
          ]
        }
      }
    },
    "list_2": {
      "L": "noop"
    },
    "list_3": {
      "L": [
        "noop"
      ]
    },
    "": {
      "S": "noop"
    }
  };

test('testing the sample input provided in the challenge description', () => {
  const output = transformer.transformJSON(sampleInput);
  expect(output.number_1).toBe(1.5);
  expect(output.string_1).toBe("784498");
  expect(output.string_2).toBe(1405544146);
});

test('testing a Null value', () => {
  const output = transformer.transformJSON({ "null_value": { " NULL ": "1"}});
  expect(output.null_value).toBe(null);
});