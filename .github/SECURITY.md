# Security Policy



### Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

### Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Email the maintainer directly with details:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. Allow up to 48 hours for initial response
4. Work with maintainers to understand and address the issue

### Security Update Process

1. Security issue is received and assigned a priority
2. Fix is developed and tested in a private repository
3. Security advisory is drafted
4. Patch is released with security advisory
5. Users are notified through GitHub releases and security advisories

### Security Best Practices for Users

When using this GitHub Action:

1. **Token Permissions**: Use tokens with minimum required permissions
2. **Dependency Updates**: Keep the action up to date with latest version
3. **Review Generated Files**: Check generated SVG/GIF files before deploying
4. **Branch Protection**: Use branch protection rules for output branches
5. **Monitor Dependencies**: Watch for Dependabot alerts

### Known Security Considerations

- This action requires `contents: write` permission to push generated files
- GitHub token is used to fetch contribution data via GraphQL API
- Generated files are committed to repository (review carefully)
- Docker image contains native dependencies (canvas, gifsicle)

### Third-Party Dependencies

We regularly update dependencies to address security vulnerabilities:

- Automated: Dependabot for security patches
- Automated: Renovate for version updates
- Manual: Regular security audits of dependencies

### Acknowledgments

We thank security researchers and community members who responsibly disclose vulnerabilities.
