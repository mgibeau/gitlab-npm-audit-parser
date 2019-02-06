var capitalize = require('./utils').capitalize;
var getCWEId = require('./utils').getCWEId;

var priorityMap = [
  'Low',
  'Medium',
  'High',
  'Critical'
]

var convert = function (json) {
  parsedData = JSON.parse(json);
  report = {};
  report.version = "2.0";
  report.vulnerabilities = [];
  report.remediations = [];

  for (var id in parsedData.advisories) {
    var advisory = parsedData.advisories[id];
    var cwe_id = getCWEId(advisory.cwe);

    report.vulnerabilities.push({
      "tool": "npm_audit",
      "category": "dependency_scanning",
      "name": advisory.module_name,
      "namespace": advisory.module_name,
      "message": advisory.title,
      "cve": "package.json" + advisory.module_name + ":cve_id:" + advisory.cves[0],
      "description": advisory.overview,
      "severity": capitalize(advisory.severity),
      "fixedby": advisory.reported_by.name,
      "confidence": "High",
      "scanner": {
        "id": "npm_audit_advisories",
        "name": "NPM Audit"
      },
      "location": {
        "file": "package.json",
        "dependency": {
          "package": {
            "name": advisory.module_name
          },
          "version": advisory.vulnerable_versions
        }
      },
      "identifiers": [
        {
          "type": "cve_id",
          "name": advisory.cves[0],
          "value": advisory.cves[0],
          "url": `https://nvd.nist.gov/vuln/detail/${advisory.cves[0]}`
        },
        {
          "type": "cwe_id",
          "name": advisory.cwe,
          "value": advisory.cwe,
          "url": `https://cwe.mitre.org/data/definitions/${cwe_id}.html`
        }
      ],
      "solution": advisory.recommendation,
      "instances": advisory.findings[0].paths.map(value => ({ method: value })),
      "links": [{
        "url": `https://npmjs.com/advisories/${advisory.id}`
      }]
    });
  }

  return JSON.stringify(report, null, '  ');
}

module.exports = convert;
