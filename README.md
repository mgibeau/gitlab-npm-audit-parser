# GitLab parser for NPM Audit

```
Usage: gitlab-npm-audit-parser [options]

Options:

  -V, --version     output the version number
  -o, --out <path>  output filename, defaults to gl-dependency-scanning-report.json
  -h, --help        output usage information
```

## How to use

Install this package.

```
npm install --save-dev @elpete/gitlab-npm-audit-parser
```

Add the following job to _.gitlab-ci.yml_

```yaml
dependency scanning:
  image: node:10-alpine
  script:
    - npm ci
    - npm audit --json | npx gitlab-npm-audit-parser -o gl-dependency-scanning.json
  artifacts:
    reports:
      dependency_scanning: gl-dependency-scanning.json
```
NOTE: If you use a `npm run-script` to call `npm audit` You must add the option `--silent` to `npm run` or have `.npmrc` set the NPM loglevel to silent otherwise the shell output will conflict with the stdin piping to this parser and cause an error.

## Test

```sh
$ npm test
```

### V1 Report
`cat test/v1_report.json | ./parse.js -o report.json`

### V2 Report
`cat test/v2_report.json | ./parse.js -o report.json`
