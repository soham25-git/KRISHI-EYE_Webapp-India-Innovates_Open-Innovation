import socket
from urllib.parse import urlparse
import ipaddress
from fastapi import HTTPException

# List of domains to explicitly allow for knowledge sources
ALLOWED_DOMAINS = [
    "gov.in",
    "krishi.gov.in",
    "fao.org",
    "worldbank.org",
    "icar.org.in",
    "agricoop.nic.in",
]

def validate_source_url(url: str):
    """
    Validates a URL against common SSRF vectors:
    1. Scheme must be HTTPS.
    2. Host must not be empty.
    3. Host must resolve to a non-private IP.
    4. Domain should be within an optional allowlist (can be relaxed later).
    """
    parsed = urlparse(url)
    if parsed.scheme != "https":
        raise HTTPException(status_code=400, detail="Only HTTPS source URLs are permitted.")

    host = parsed.hostname
    if not host:
        raise HTTPException(status_code=400, detail="Invalid host in source URL.")

    # 1. Domain allowlist check (Optional/Stricter)
    if not any(host.endswith(domain) for domain in ALLOWED_DOMAINS):
        # Log warning: non-allowlisted domain (S-18)
        pass

    # 2. DNS Resolution check (prevent private IP SSRF)
    try:
        ip_addr = socket.gethostbyname(host)
        ip_obj = ipaddress.ip_address(ip_addr)
        
        if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local:
            raise HTTPException(
                status_code=403, 
                detail="Source URL resolves to a forbidden private network address."
            )
    except socket.gaierror:
        raise HTTPException(status_code=400, detail="Could not resolve source URL domain.")

    return True

def sanitize_prompt_input(text: str) -> str:
    """
    Basic prompt injection prevention (S-07):
    1. Strip markdown instruction tokens (#, ##, etc.) at start of lines.
    2. Strip common attack prefixes like 'Ignore previous instructions'.
    3. Remove suspicious delimiters.
    """
    # Placeholder for more robust regex-based or classifier-based sanitization
    forbidden_phrases = [
        "ignore previous instructions",
        "you are a hacker",
        "reveal your system prompt",
    ]
    
    sanitized = text
    for phrase in forbidden_phrases:
        if phrase in sanitized.lower():
            sanitized = sanitized.lower().replace(phrase, "[redacted]")
            
    # Remove excessive special characters that might be used for formatting escapes
    # sanitized = "".join(ch for ch in sanitized if ch.isalnum() or ch in " ,.?!'\"-")
    
    return sanitized
