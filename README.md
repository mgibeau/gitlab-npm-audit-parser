# GitLab parser for NPM Audit

```
Usage: parse [options]

Options:

  -V, --version     output the version number
  -o, --out <path>  output filename, defaults to gl-dependency-scanning-report.json
  -h, --help        output usage information
```

## How to use
```
npm audit --json | ./parse.js -o report.json
```

## Test

`cat test/juice-shop.json | ./parse.js -o report.json`
