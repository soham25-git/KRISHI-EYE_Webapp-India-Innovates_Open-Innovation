from app.common.schemas import SafetyCategory

RISK_PATTERNS = {
    SafetyCategory.HIGH: [
        r"(?i)\bdosage\b",
        r"(?i)\bpoison\b",
        r"(?i)\btoxic\b",
        r"(?i)\bgovernment compliance\b",
        r"(?i)\billegal\b",
        r"(?i)\bsuicide\b",
        r"(?i)\bsevere outbreak\b"
    ],
    SafetyCategory.MEDIUM: [
        r"(?i)\bdisease\b",
        r"(?i)\bpest\b",
        r"(?i)\binfection\b",
        r"(?i)\bspray\b",
        r"(?i)\bfertilizer\b"
    ],
    SafetyCategory.LOW: [
        r"(?i)\bweather\b",
        r"(?i)\bprice\b",
        r"(?i)\bmarket\b",
        r"(?i)\bseed\b",
        r"(?i)\bcultivation\b",
        r"(?i)\bharvest\b"
    ]
}
