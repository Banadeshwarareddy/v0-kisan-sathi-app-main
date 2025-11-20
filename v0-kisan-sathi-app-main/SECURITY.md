# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Publicly Disclose

Please do not create a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Email security details to: **security@kisansathi.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- **24 hours**: Initial acknowledgment
- **7 days**: Detailed response with assessment
- **30 days**: Fix deployed (for confirmed vulnerabilities)

### 4. Disclosure Policy

- We will work with you to understand and resolve the issue
- We will credit you in our security advisories (unless you prefer anonymity)
- We will notify affected users after the fix is deployed

## Security Best Practices

### For Developers

#### Authentication
- Use strong passwords (min 12 characters)
- Enable two-factor authentication
- Rotate API keys regularly
- Never commit secrets to version control

#### Code Security
```python
# ✅ Good: Use environment variables
SECRET_KEY = os.getenv('SECRET_KEY')

# ❌ Bad: Hardcoded secrets
SECRET_KEY = 'my-secret-key-123'
```

#### Database
- Use parameterized queries
- Implement proper access controls
- Regular backups
- Encrypt sensitive data

#### API Security
- Rate limiting enabled
- CORS properly configured
- Input validation
- Output sanitization

### For Users

#### Account Security
- Use unique, strong passwords
- Enable two-factor authentication (when available)
- Don't share credentials
- Log out from shared devices

#### Data Protection
- Review privacy settings
- Be cautious with personal information
- Report suspicious activity
- Keep software updated

## Security Features

### Implemented

✅ **Authentication**
- JWT token-based authentication
- Password hashing (PBKDF2)
- Session management
- CSRF protection

✅ **Authorization**
- Role-based access control
- Permission checks
- Resource-level permissions

✅ **Data Protection**
- SQL injection prevention
- XSS protection
- HTTPS enforcement (production)
- Secure cookie flags

✅ **API Security**
- Rate limiting
- CORS configuration
- Input validation
- Error handling

✅ **Infrastructure**
- Regular security updates
- Dependency scanning
- Secure headers
- Content Security Policy

### Planned

🔄 **Two-Factor Authentication**
- SMS-based 2FA
- Authenticator app support

🔄 **Advanced Monitoring**
- Intrusion detection
- Anomaly detection
- Security logging

🔄 **Compliance**
- GDPR compliance
- Data retention policies
- Privacy controls

## Known Security Considerations

### Development Mode

⚠️ **Never use DEBUG=True in production**

```python
# settings.py
DEBUG = False  # Always False in production
ALLOWED_HOSTS = ['yourdomain.com']
```

### API Keys

⚠️ **Protect your API keys**

```bash
# .env file (never commit this)
GROQ_API_KEY=your-secret-key
SECRET_KEY=your-django-secret-key
```

### File Uploads

⚠️ **Validate uploaded files**

```python
# Allowed file types
ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf']

# Max file size
MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5MB
```

## Security Checklist

### Before Deployment

- [ ] DEBUG = False
- [ ] Strong SECRET_KEY
- [ ] HTTPS enabled
- [ ] Secure cookies
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Error pages configured
- [ ] Logging enabled
- [ ] Backups configured
- [ ] Security headers set

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Review access logs weekly
- [ ] Rotate API keys quarterly
- [ ] Security audit annually
- [ ] Backup testing monthly

## Vulnerability Disclosure

We maintain a responsible disclosure policy:

1. **Report received**: We acknowledge within 24 hours
2. **Investigation**: We assess the vulnerability
3. **Fix development**: We develop and test a fix
4. **Deployment**: We deploy the fix to production
5. **Disclosure**: We publicly disclose after fix is deployed

## Security Updates

Subscribe to security updates:
- Email: security-updates@kisansathi.com
- RSS: https://kisansathi.com/security/feed
- GitHub: Watch repository for security advisories

## Contact

- **Security Team**: security@kisansathi.com
- **General Support**: support@kisansathi.com
- **Emergency**: +91-XXX-XXX-XXXX (24/7)

## Bug Bounty Program

We currently do not have a formal bug bounty program, but we appreciate security researchers who responsibly disclose vulnerabilities. We will:

- Acknowledge your contribution
- Credit you in our security advisories
- Provide a letter of appreciation
- Consider rewards for critical vulnerabilities

## Legal

By reporting vulnerabilities, you agree to:
- Not exploit the vulnerability
- Not disclose it publicly before we fix it
- Provide reasonable time for us to address it
- Act in good faith

We commit to:
- Not pursue legal action against good-faith researchers
- Work with you to understand the issue
- Keep you informed of our progress
- Credit you appropriately

---

**Last Updated**: November 20, 2025

Thank you for helping keep Kisan Sathi secure! 🔒
