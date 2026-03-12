# Farmer Platform PRD TODO (Expo-Ready, Web + App First)

## Vision
- [ ] Build a multilingual web + mobile platform for Indian farmers
- [ ] Launch with English base UI and support language switching later
- [ ] Make the product visually striking for expo/demo settings with a dark, modern, animated interface
- [ ] Keep the UI practical for real farmers with simple navigation, large touch targets, and clear wording
- [ ] Show how the product improves outcomes over time through easy-to-read graphs and timelines
- [ ] Keep the app understandable for farmers across education levels and age ranges

## Current scope
- [ ] Focus on web app, mobile app, backend, AI advisory, support directory, analytics UX, and demo-ready map visuals
- [ ] Use mocked or manually uploaded telemetry/job data for map and heatmap demos
- [ ] Defer Raspberry Pi, Teensy, UART, and hardware integration work to a later phase
- [ ] Keep APIs generic so hardware can plug in later without redesigning the frontend

## Primary users
- [ ] Farmers across education levels and age ranges
- [ ] Tractor operators
- [ ] Agronomists and extension workers
- [ ] NGO and government support staff
- [ ] Admin and knowledge managers
- [ ] Expo judges, investors, and demo audiences

## Core product goals
- [ ] Make field activity visible through an animated live-style map and infection heatmap
- [ ] Show a small animated tractor moving through the field along the route path
- [ ] Make the map visually appealing enough for demo/expo environments while still readable
- [ ] Provide grounded region-aware agricultural advisory with sources and escalation
- [ ] Help farmers quickly contact support organizations and helplines
- [ ] Make dashboards easy to understand with improvement graphs and progress summaries
- [ ] Ensure mobile and desktop parity with responsive layouts and accessible typography
- [ ] Make all important actions reachable within one or two taps

## MVP features
- [ ] Phone OTP login (can start mocked)
- [ ] Farmer profile and farm onboarding
- [ ] Field boundary creation and farm overview
- [ ] Map view with animated field route playback
- [ ] Infection heatmap overlay using mocked or uploaded job data
- [ ] Small tractor marker animated along route path
- [ ] Dashboard cards for performance, savings, coverage, and usage trends
- [ ] Improvement graphs showing how the product helped over time
- [ ] Civic-tech support directory with click-to-call actions
- [ ] AI advisory assistant with citations, confidence, and escalation
- [ ] High-contrast dark UI theme for expo and low-light viewing
- [ ] Accessible mobile-first responsive design
- [ ] Offline caching for essential screens and recent data
- [ ] Demo mode with seeded farms, jobs, analytics, and support contacts

## High-value extra features
- [ ] Voice-first query input for low-literacy use cases
- [ ] Text-to-speech for advisory answers
- [ ] Saved advice cards by crop/issue
- [ ] Seasonal reminders and task cards
- [ ] Farm performance scorecard
- [ ] Before/after comparison dashboard
- [ ] Smart search for support contacts by district and issue
- [ ] Printable/shareable farm report
- [ ] "Why this advice?" explanation panel
- [ ] Weather-ready placeholder module for future integration
- [ ] Multi-user farm access for family or field staff
- [ ] Admin-controlled demo scene presets for expo mode

## UX and visual design requirements
- [ ] Primary theme: accessible dark mode with dark gray surfaces, not harsh pure black
- [ ] Accent colors should highlight status, routes, heatmap intensity, and CTA buttons
- [ ] Ensure strong contrast for text, buttons, graphs, and map overlays
- [ ] Use large readable fonts and generous spacing
- [ ] Keep touch targets large and separated
- [ ] Use icon-led cards and simple top-level navigation
- [ ] Keep all important actions reachable within one or two taps
- [ ] Include clear legends for heatmaps and charts
- [ ] Allow motion reduction or simplified animation mode
- [ ] Ensure map and chart visuals remain readable on mobile

## Accessibility requirements
- [ ] Support responsive typography for mobile and desktop
- [ ] Use readable font sizes and clear line spacing
- [ ] Ensure buttons and interactive elements meet large touch-target expectations
- [ ] Avoid color-only meaning in charts, maps, and status UI
- [ ] Ensure keyboard and screen-reader friendly web navigation
- [ ] Support reduced motion where possible
- [ ] Make farmer-facing copy simple and direct
- [ ] Use icon + label combinations, not icons alone

## Core pages and screens
- [ ] Landing / login
- [ ] Onboarding
- [ ] Home dashboard
- [ ] My farms
- [ ] Field details
- [ ] Live map / replay map
- [ ] Improvement analytics
- [ ] Ask AI
- [ ] Help directory
- [ ] Support ticket detail
- [ ] Settings and language
- [ ] Admin panel

## Analytics and value demonstration
- [ ] Show before/after graphs for usage periods
- [ ] Show farm-level activity summaries
- [ ] Show simple trend charts for coverage, savings, issue detection, and support usage
- [ ] Highlight key wins in plain language, not only technical metrics
- [ ] Make demo mode available with seeded data for presentations
- [ ] Add a story-style "Your farm improved by..." summary panel
- [ ] Show trust metrics such as AI confidence and human-help handoff rate

## Data and trust
- [ ] Show source, confidence, and updated date in AI answers
- [ ] Log advisory answers for quality review
- [ ] Keep personal data minimal and role-based
- [ ] Add audit trails for admin changes
- [ ] Build privacy consent and data retention rules into the product

## Non-functional requirements
- [ ] Mobile-first design
- [ ] Desktop-friendly dashboard layout
- [ ] PWA offline shell for key web views
- [ ] Fast map rendering and smooth animation
- [ ] Clear loading, empty, and offline states
- [ ] Role-based access control
- [ ] Explainable AI outputs with source metadata
- [ ] Admin-managed support contacts and knowledge sources
- [ ] Security-first API design and rate limiting
- [ ] Observability and error tracking
- [ ] Backup and recovery planning

## Success metrics
- [ ] Daily and weekly active users
- [ ] Support contact click-through rate
- [ ] Advisory answer acceptance rate
- [ ] Time-to-insight on dashboard
- [ ] Mobile task completion rate
- [ ] Replay/map engagement rate
- [ ] Demo readiness with seeded showcase data
- [ ] Retention after 30 days
- [ ] Repeat farm usage sessions