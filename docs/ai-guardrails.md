# AI Guardrails

## Principles
- Answers must be grounded in retrieved agricultural sources
- Show source titles, dates, and confidence
- Ask for crop, district, or season if missing
- Escalate low-confidence or high-risk questions to human support paths
- Avoid unsupported claims, pesticide dosage speculation, and outdated policy advice
- Prefer abstention over hallucination

## UX behavior
- Use simple language for farmer-facing responses
- Allow deeper technical explanation in an expandable section
- Provide action cards such as Call Help, Save Advice, or Ask Follow-up
- Show a visible confidence indicator and source chips
- Mark uncertain advice clearly
- Offer multilingual output support later through the same response contract

## Safety categories
- High risk: dosage, toxic exposure, severe outbreak, government compliance
- Medium risk: likely disease/pest guidance with evidence
- Low risk: informational, directory, general crop education

## Logging and review
- Store advisory logs for admin review
- Track user feedback on answer helpfulness
- Review low-confidence answers regularly
- Maintain a blacklist and correction workflow for bad advice patterns
