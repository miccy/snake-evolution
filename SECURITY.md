# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email us at: security@miccy.dev
3. Or use [GitHub Security Advisories](https://github.com/miccy/snake-evolution/security/advisories/new)

We will respond within 48 hours and work with you to:
- Confirm the vulnerability
- Develop a fix
- Release a patched version
- Credit you in the release notes (unless you prefer anonymity)

## Security Considerations

### GitHub Token Handling

- Tokens are **never** stored or logged
- Tokens are only used for GitHub GraphQL API requests
- If no token is provided, we use public HTML scraping (rate-limited)

### SVG Output

- Generated SVGs contain only safe elements (rect, animate, filter)
- No JavaScript or external resources in generated files
- Output is deterministic based on contribution data

### GitHub Action

- Runs with minimal permissions by default
- Only writes to specified output path
- No network requests except GitHub API
