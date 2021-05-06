var capitalize = require("./utils").capitalize;
var getCWEId = require("./utils").getCWEId;

var convert = function (json) {
    return JSON.stringify(convertReportForType(JSON.parse(json)), null, "  ");
};

function convertReportForType(parsedData) {
    switch (getReportType(parsedData)) {
        case 2:
            return convertV2Report(parsedData);
        case 1:
        default:
            return convertV1Report(parsedData);
    }
}

function getReportType(parsedData) {
    return parsedData.auditReportVersion || 1;
}

function convertV2Report(parsedData) {
    let report = {};
    report.version = "2.0";
    report.vulnerabilities = [];
    report.remediations = [];

    for (var id in parsedData.vulnerabilities) {
        var advisory = parsedData.vulnerabilities[id];
        for (var via in advisory.via) {
            if (typeof via !== "object") {
                continue;
            }
            const id = `NPM Audit: ${advisory.name} cve_id: ${via.source}`;
            const solution = typeof advisory.fixAvailable === "object" ? `Upgrade ${advisory.fixAvailable.name} to version >=${advisory.fixAvailable.version}` : null;
            report.vulnerabilities.push({
                id,
                cve: id,
                tool: "npm_audit",
                category: "dependency_scanning",
                name: advisory.name,
                message: via.title,
                description: via.title,
                severity: capitalize(via.severity),
                confidence: "High",
                scanner: {
                    id: "npm_audit_advisories",
                    name: "NPM Audit",
                },
                location: {
                    file: "package-lock.json",
                    dependency: {
                        package: {
                            name: advisory.name,
                        },
                        version: via.range,
                    },
                },
                identifiers: [
                    {
                        type: "cve",
                        name: via.title,
                        value: via.source,
                        url: via.url
                    }
                ],
                solution,
                links: [
                    {
                        url: via.url,
                    },
                ],
            });

            if (solution) {
                report.remediations.push({
                    fixes: [{ id }],
                    summary: solution
                })
            }
        }
    }

    return report;
}

function convertV1Report(parsedData) {
    let report = {};
    report.version = "1.0";
    report.vulnerabilities = [];
    report.remediations = [];

    for (var id in parsedData.advisories) {
        var advisory = parsedData.advisories[id];
        var cwe_id = getCWEId(advisory.cwe);

        report.vulnerabilities.push({
            tool: "npm_audit",
            category: "dependency_scanning",
            name: advisory.module_name,
            namespace: advisory.module_name,
            message: advisory.title,
            cve:
                "package.json" + advisory.module_name + ":cve_id:" + advisory.cves[0],
            description: advisory.overview,
            severity: capitalize(advisory.severity),
            fixedby: advisory.reported_by.name,
            confidence: "High",
            scanner: {
                id: "npm_audit_advisories",
                name: "NPM Audit",
            },
            location: {
                file: "package.json",
                dependency: {
                    package: {
                        name: advisory.module_name,
                    },
                    version: advisory.vulnerable_versions,
                },
            },
            identifiers: [
                {
                    type: "cve_id",
                    name: advisory.cves[0],
                    value: advisory.cves[0],
                    url: `https://nvd.nist.gov/vuln/detail/${advisory.cves[0]}`,
                },
                {
                    type: "cwe_id",
                    name: advisory.cwe,
                    value: advisory.cwe,
                    url: `https://cwe.mitre.org/data/definitions/${cwe_id}.html`,
                },
            ],
            solution: advisory.recommendation,
            instances: advisory.findings[0].paths.map((value) => ({ method: value })),
            links: [
                {
                    url: `https://npmjs.com/advisories/${advisory.id}`,
                },
            ],
        });
    }

    return report;
}

module.exports = convert;
