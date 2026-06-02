# Waitlist API Integration Guide

## Overview

The Halo DEK Issuance waitlist API allows you to collect early access signups from your landing page or marketing site.

**Base URL:** `https://dek-issuance-40198490972.us-central1.run.app`

**Endpoint:** `POST /v2/waitlist`

**Authentication:** None required (public endpoint)

**CORS:** Enabled for all origins

---

## Request Format

### Endpoint
```
POST /v2/waitlist
```

### Headers
```
Content-Type: application/json
```

### Request Body

```json
{
  "email": "user@example.com",      // Required: valid email address
  "name": "John Doe",                // Optional: user's name
  "source": "landing_page",          // Optional: signup source/campaign
  "referrer": "https://example.com"  // Optional: referrer URL
}
```

#### Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ Yes | Valid email address (case-insensitive, auto-trimmed) |
| `name` | string | ❌ No | User's display name |
| `source` | string | ❌ No | Signup source (e.g., "landing_page", "blog_cta", "twitter") |
| `referrer` | string | ❌ No | Referrer URL or campaign identifier |

---

## Response Format

### Success Response (200 OK)

```json
{
  "message": "Thank you for signing up!",
  "email": "user@example.com",
  "already_subscribed": false
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Confirmation message |
| `email` | string | Normalized email address that was registered |
| `already_subscribed` | boolean | `true` if email was already in waitlist, `false` for new signup |

### Error Responses

#### 400 Bad Request - Invalid Email
```json
{
  "code": "VALIDATION_FAILED",
  "message": "invalid email format"
}
```

#### 400 Bad Request - Missing Email
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "email"],
      "msg": "Field required"
    }
  ]
}
```

#### 429 Too Many Requests
```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "too many requests"
}
```

**Rate Limit:** 20 requests per minute per IP address

---

## Integration Examples

### JavaScript (Fetch API)

```javascript
async function joinWaitlist(email, name = null, source = null) {
  const response = await fetch('https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      name: name,
      source: source,
      referrer: document.referrer || null
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }

  return await response.json();
}

// Usage
try {
  const result = await joinWaitlist('user@example.com', 'John Doe', 'landing_page');
  
  if (result.already_subscribed) {
    console.log('Already signed up!');
  } else {
    console.log('Successfully joined waitlist!');
  }
} catch (error) {
  console.error('Error:', error.message);
}
```

### React Hook Example

```jsx
import { useState } from 'react';

function useWaitlistSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (email, name = '', source = '') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: name || null,
            source: source || null,
            referrer: document.referrer || null
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}

// Component usage
function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { signup, loading, error } = useWaitlistSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await signup(email, '', 'landing_page');
      setSubmitted(true);
      
      if (result.already_subscribed) {
        alert('You are already on the waitlist!');
      } else {
        alert('Successfully joined the waitlist!');
      }
    } catch (err) {
      // Error is already set by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Joining...' : 'Join Waitlist'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Python (requests)

```python
import requests

def join_waitlist(email: str, name: str = None, source: str = None, referrer: str = None):
    """
    Join the Halo waitlist.
    
    Args:
        email: Valid email address (required)
        name: User's name (optional)
        source: Signup source/campaign (optional)
        referrer: Referrer URL (optional)
    
    Returns:
        dict: Response with message, email, and already_subscribed flag
    
    Raises:
        requests.HTTPError: If the request fails
    """
    url = 'https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist'
    
    payload = {'email': email}
    if name:
        payload['name'] = name
    if source:
        payload['source'] = source
    if referrer:
        payload['referrer'] = referrer
    
    response = requests.post(url, json=payload)
    response.raise_for_status()
    
    return response.json()

# Usage
try:
    result = join_waitlist(
        email='user@example.com',
        name='John Doe',
        source='python_script'
    )
    
    if result['already_subscribed']:
        print('Email already on waitlist')
    else:
        print('Successfully joined waitlist!')
        
except requests.HTTPError as e:
    print(f'Error: {e.response.text}')
```

### cURL

```bash
# Basic signup
curl -X POST https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# With all optional fields
curl -X POST https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "source": "landing_page",
    "referrer": "https://halo.ai"
  }'
```

### TypeScript

```typescript
interface WaitlistRequest {
  email: string;
  name?: string;
  source?: string;
  referrer?: string;
}

interface WaitlistResponse {
  message: string;
  email: string;
  already_subscribed: boolean;
}

interface ErrorResponse {
  code: string;
  message: string;
}

async function joinWaitlist(request: WaitlistRequest): Promise<WaitlistResponse> {
  const response = await fetch(
    'https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message || 'Signup failed');
  }

  return response.json();
}

// Usage
joinWaitlist({
  email: 'user@example.com',
  name: 'John Doe',
  source: 'landing_page',
  referrer: document.referrer || undefined
})
  .then(result => {
    if (result.already_subscribed) {
      console.log('Already on waitlist');
    } else {
      console.log('Successfully joined!');
    }
  })
  .catch(error => {
    console.error('Signup error:', error.message);
  });
```

---

## Best Practices

### 1. Email Validation

Always validate email format on the client side before submitting:

```javascript
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### 2. Handle Duplicate Signups Gracefully

```javascript
const result = await joinWaitlist(email, name, source);

if (result.already_subscribed) {
  // Show a friendly message instead of treating it as an error
  showMessage('You're already on the waitlist! We'll be in touch soon.');
} else {
  showMessage('Thanks for joining! Check your email for confirmation.');
}
```

### 3. Track Signup Sources

Use the `source` field to identify which campaigns are most effective:

```javascript
// Landing page
await joinWaitlist(email, name, 'landing_page_hero');

// Blog CTA
await joinWaitlist(email, name, 'blog_post_cta');

// Twitter campaign
await joinWaitlist(email, name, 'twitter_campaign_2026_q2');
```

### 4. Capture Referrer Automatically

```javascript
const referrer = document.referrer || window.location.href;
await joinWaitlist(email, name, source, referrer);
```

### 5. Error Handling

```javascript
try {
  const result = await joinWaitlist(email, name, source);
  // Success handling
} catch (error) {
  if (error.message.includes('rate limit')) {
    showError('Too many requests. Please try again in a minute.');
  } else if (error.message.includes('invalid email')) {
    showError('Please enter a valid email address.');
  } else {
    showError('Something went wrong. Please try again.');
  }
}
```

### 6. Rate Limiting

The endpoint allows 20 requests per minute per IP. For high-traffic sites:

- Implement client-side debouncing
- Show loading states to prevent double-submissions
- Cache successful submissions locally

```javascript
// Debounce example
let lastSubmission = 0;

async function throttledSignup(email, name, source) {
  const now = Date.now();
  if (now - lastSubmission < 3000) { // 3 second cooldown
    throw new Error('Please wait before submitting again');
  }
  
  lastSubmission = now;
  return await joinWaitlist(email, name, source);
}
```

---

## Security Considerations

1. **No Authentication Required:** The endpoint is intentionally public for easy integration
2. **Email Normalization:** Emails are automatically lowercased and trimmed
3. **Idempotent:** Submitting the same email multiple times is safe (returns `already_subscribed: true`)
4. **Rate Limited:** 20 requests/minute per IP to prevent abuse
5. **Input Validation:** Email format is validated server-side
6. **CORS Enabled:** Can be called from any domain

---

## Testing

### Test Endpoints

Use these test emails to verify your integration:

```bash
# New signup
curl -X POST https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "test+new@example.com"}'

# Expected: {"message": "Thank you for signing up!", "email": "test+new@example.com", "already_subscribed": false}

# Duplicate signup (run twice)
curl -X POST https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "test+duplicate@example.com"}'

# First time: already_subscribed: false
# Second time: already_subscribed: true

# Invalid email
curl -X POST https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "not-an-email"}'

# Expected: {"code": "VALIDATION_FAILED", "message": "invalid email format"}
```

---

## Support

For issues or questions about the waitlist API:

- **GitHub:** [scamai/snap_dragon_packaging](https://github.com/scamai/snap_dragon_packaging)
- **Technical Issues:** Check the `/healthz` endpoint for service status

## Changelog

### v2.0.4 (2026-06-02)
- ✅ Production deployment
- ✅ PostgreSQL backend with idempotent inserts
- ✅ Rate limiting (20 req/min)
- ✅ CORS enabled
- ✅ Email validation and normalization
- ✅ Duplicate detection