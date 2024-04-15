# lonetutora
a JSON Transformer to solve a coding challenge

This JSON transformers validates and converts JSON inputs like this one:
```json
{
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
}
```

to this output: 
```json
[
  {
    "map_1": {
      "list_1": [
        11,
        false
      ],
      "null_1": null
    },
    "number_1": 1.5,
    "string_1": "784498",
    "string_2": 1405544146
  }
]
```

## Execution

This project requires a NodeJS (plus NPM) environment. You can install NodeJS from [here](https://nodejs.org/en/download) or you can use online tools like [Replit](https://replit.com/).

To execute the project simply run `node index.js {path/to/json/file}` or `npm run start` which runs the script with provided `sample.json` at the root of this directory.


## Testing
Install the testing dependency (`jest`) using `npm install`.

Just run:
```
npm test

```