# Security policy

## Updates

[![The project's latest version published to the npm registry.](https://img.shields.io/npm/v/%40stassi%2Fleaf 'npm latest version badge')](https://www.npmjs.com/package/@stassi/leaf)

**Always use the latest version of `@stassi/leaf`** via the `npm update` command ([documentation](https://docs.npmjs.com/cli/v10/commands/npm-update)) to ensure the latest security updates are received.

## Reporting

If you discover a **potential vulnerability in the `@stassi/leaf` codebase**, please follow these steps:

1. **Do not publicly disclose any potential vulnerability.** Public disclosure increases the risk of a malicious exploit before a remedy is available.

2. **Contact [security@stassi.net](mailto:security@stassi.net) directly via email.** Please provide detailed information about the potential vulnerability, including steps to reproduce and any relevant code snippets or logs. Additional information or clarification may be requested.

## Maintenance

[![Displays the pass-fail status of the project's automated security scans via GitHub Actions.](https://github.com/Stassi/leaf/actions/workflows/security.yml/badge.svg 'Automated security analysis status badge')](https://github.com/Stassi/leaf/actions/workflows/security.yml)

Automated security scans are integrated into the [continuous delivery (CD)](https://en.wikipedia.org/wiki/Continuous_delivery) pipeline.

### Advisories

View all [security advisories for `@stassi/leaf`](https://github.com/Stassi/leaf/security/advisories).

### Dependencies

[Dependabot](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide), [Snyk](https://en.wikipedia.org/wiki/Snyk), and the `npm audit` command ([documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)) mitigate upstream security risks by analyzing upstream dependencies. Potential vulnerabilities in third-party libraries like [Leaflet](<https://en.wikipedia.org/wiki/Leaflet_(software)>) are patched during the build process.

### Sanitization

All dynamic HTML content is sanitized using [DOMPurify](https://www.npmjs.com/package/dompurify) to prevent [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

### Static analysis

[CodeQL (Semmle)](https://en.wikipedia.org/wiki/Semmle) and [ESLint](https://en.wikipedia.org/wiki/ESLint) use [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) to detect potential vulnerabilities early.

## Disclosures

The following potential vulnerabilities were **resolved** after detection.

### DOM clobbering gadget in `rollup` bundled scripts leading to XSS

- **Detected by:** Dependabot
- **Vulnerable package:** [rollup](https://www.npmjs.com/package/rollup)
- **Detection time:** 2024-09-24 19:48
- **Resolution time:** 2024-09-25 4:41
- **Resolution version (`@stassi/leaf`):** [v0.0.30](https://github.com/Stassi/leaf/releases/tag/v0.0.30)
- **CVSS (severity):** 8.3 (high)
- **Advisory:** [GHSA-gcx4-mw62-g8wm](https://github.com/advisories/GHSA-gcx4-mw62-g8wm)
- **CVE:** [CVE-2024-47068](https://nvd.nist.gov/vuln/detail/CVE-2024-47068)
- **CWEs:**
  - **CWE-79**: [Cross-site scripting (XSS)](https://cwe.mitre.org/data/definitions/79.html)
  - **CWE-116**: [Improper encoding or escaping of output](https://cwe.mitre.org/data/definitions/116.html)

### Regular expression denial of service (ReDoS) in `path-to-regexp`

- **Detected by:** Dependabot & Snyk
- **Vulnerable package:** [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) (via [serve](https://www.npmjs.com/package/serve))
- **Detection times:**
  - **Dependabot**: 2024-09-24 19:48
  - **Snyk**: 2024-09-23 19:08
- **Resolution time:** 2024-09-25 5:05
- **Resolution version (`@stassi/leaf`):** [v0.0.31](https://github.com/Stassi/leaf/releases/tag/v0.0.31)
- **CVSS (severity):**
  - **Dependabot**: 7.7 (high)
  - **Snyk**: 6.9 (medium)
- **Advisories:**
  - **Dependabot**: [GHSA-9wv6-86v2-598j](https://github.com/advisories/GHSA-9wv6-86v2-598j)
  - **Snyk**: [SNYK-JS-PATHTOREGEXP-7925106](https://security.snyk.io/vuln/SNYK-JS-PATHTOREGEXP-7925106)
- **CVE:** [CVE-2024-45296](https://nvd.nist.gov/vuln/detail/CVE-2024-45296)
- **CWE:** [CWE-1333](https://cwe.mitre.org/data/definitions/1333.html) (Inefficient regular expression complexity)

### Regular expression denial of service (ReDoS) in `cross-spawn`

- **Detected by:** Snyk
- **Vulnerable package:** [cross-spawn](https://www.npmjs.com/package/cross-spawn) (via [serve](https://www.npmjs.com/package/serve))
- **Detection time:** 2024-11-07 8:43
- **Resolution time:** 2024-11-12 1:13
- **Resolution version (`@stassi/leaf`):** [v0.0.78](https://github.com/Stassi/leaf/releases/tag/v0.0.78)
- **CVSS (severity):** 8.7 (high)
- **Advisory:** [SNYK-JS-CROSSSPAWN-8303230](https://security.snyk.io/vuln/SNYK-JS-CROSSSPAWN-8303230)
- **CVE:** [CVE-2024-21538](https://nvd.nist.gov/vuln/detail/CVE-2024-21538)
- **CWE:** [CWE-1333](https://cwe.mitre.org/data/definitions/1333.html) (Inefficient regular expression complexity)

### Unsafe HTML constructed from `leaflet` library input

- **Detected by:** CodeQL
- **Vulnerable package:** [leaflet](https://www.npmjs.com/package/leaflet)
- **Detection time:** 2024-09-24 16:03
- **Resolution time:** 2024-10-04 03:17
- **Resolution versions (`@stassi/leaf`):**
  - [v0.0.34](https://github.com/Stassi/leaf/releases/tag/v0.0.34)
  - [v0.0.37](https://github.com/Stassi/leaf/releases/tag/v0.0.37)
- **CVSS (severity):** 6.1 (medium)
- **Advisory:** [CodeQL js/html-constructed-from-input](https://codeql.github.com/codeql-query-help/javascript/js-html-constructed-from-input/)
- **CWEs:**
  - **CWE-79**: [Cross-site scripting (XSS)](https://cwe.mitre.org/data/definitions/79.html)
  - **CWE-116**: [Improper encoding or escaping of output](https://cwe.mitre.org/data/definitions/116.html)
