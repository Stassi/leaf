# Security policy

## Updates

[![npm version](https://img.shields.io/npm/v/%40stassi%2Fleaf)](https://www.npmjs.com/package/@stassi/leaf)

**Always use the latest version of `@stassi/leaf`** via the `npm update` command ([documentation](https://docs.npmjs.com/cli/v10/commands/npm-update)) to ensure the latest security updates are received.

## Reporting

If you discover a **potential vulnerability in the `@stassi/leaf` codebase**, please follow these steps:

1. **Do not publicly disclose any potential vulnerability.** Public disclosure increases the risk of a malicious exploit before a remedy is available.

2. **Contact [security@stassi.net](mailto:security@stassi.net) directly via email.** Please provide detailed information about the potential vulnerability, including steps to reproduce and any relevant code snippets or logs. Additional information or clarification may be requested.

## Maintenance

[![Security](https://github.com/Stassi/leaf/actions/workflows/security.yml/badge.svg)](https://github.com/Stassi/leaf/actions/workflows/security.yml)

Automated security scans are integrated into the [continuous delivery (CD)](https://en.wikipedia.org/wiki/Continuous_delivery) pipeline.

### Advisories

View all [security advisories for `@stassi/leaf`](https://github.com/Stassi/leaf/security/advisories).

### Dependencies

[Dependabot](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide), [Snyk](https://en.wikipedia.org/wiki/Snyk), and the `npm audit` command ([documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)) mitigate upstream security risks by analyzing upstream dependencies. Potential vulnerabilities in third-party libraries like [Leaflet](<https://en.wikipedia.org/wiki/Leaflet_(software)>) are patched during the build process.

### Sanitization

All dynamic HTML content is sanitized using [DOMPurify](https://www.npmjs.com/package/dompurify) to prevent [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

### Static analysis

[CodeQL (Semmle)](https://en.wikipedia.org/wiki/Semmle) and [ESLint](https://en.wikipedia.org/wiki/ESLint) use [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) to detect potential vulnerabilities early.
