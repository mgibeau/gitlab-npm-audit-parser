var priorityMap = ['low', 'medium', 'high']

var convert = function (json) {
  parsedData = JSON.parse(json);
  report = [];

  for (var id in parsedData.advisories) {
    var advisory = parsedData.advisories[id];
    var cwe_id = advisory.cwe.replace('CWE-','');

    report.push({
      "tool": "npm_audit",
      "category": "sast",
      "name": advisory.module_name,
      "namespace": advisory.module_name,
      "message": advisory.title,
      "description": advisory.overview,
      // "cve": "https://nvd.nist.gov/vuln/detail/" + advisory.cves[0],
      // "cweid": cwe_id,
      "severity": advisory.severity,
      "fixedby": advisory.reported_by.name,
      "confidence": "High",
      "scanner": {
        "id": "npm_audit_advisories",
        "name": "NPM Audit"
      },
      "location": {
        "file": "package.json"
      },
      "identifiers": [
        // {
        //   "type": "advisoriy_id",
        //   "name": "NPM advisory " + advisory.id,
        //   "value": "NPM advisory " + advisory.id,
        //   "url": "https://npmjs.com/advisories/" + advisory.id
        // },
        {
          "type": "cve_id",
          "name": advisory.cves[0],
          "value": advisory.cves[0],
          "url": "https://nvd.nist.gov/vuln/detail/" + advisory.cves[0]
        },
        {
          "type": "cwe_id",
          "name": advisory.cwe,
          "value": advisory.cwe,
          "url": `https://cwe.mitre.org/data/definitions/${cwe_id}.html`
        }
      ],
      "priority": advisory.metadata.exploitability,
      "solution": advisory.recommendation,
      "instances": advisory.findings[0].paths.map(value => ({ method: value })),
      "links": [{
        "url": "https://npmjs.com/advisories/" + advisory.id
      }]
    });
  }

  return JSON.stringify(report, null, '  ');
}

module.exports = convert;
