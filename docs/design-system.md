# Design System (Expo-Ready Dark UI)

## Design direction
- Primary visual theme: premium dark interface for expo/demo appeal
- Use dark gray base surfaces instead of harsh pure black
- Keep typography large, clear, and highly legible
- Combine cinematic map visuals with practical dashboard layouts
- Keep the interface impressive for demos but simple for daily farmer use

## Visual style
- Use depth, blur, glow, and subtle gradients carefully, never at the cost of readability
- Keep cards large, rounded, and well separated
- Use motion to guide attention, not distract
- Give charts, maps, and AI cards a premium visual hierarchy

## Color system
- Background: deep charcoal gray
- Surface: elevated gray cards
- Surface alt: slightly lighter dark panels
- Text primary: high-contrast off-white
- Text secondary: muted but readable gray
- Accent success: electric green
- Accent warning: warm amber
- Accent info: cyan/blue
- Accent danger: vivid red for faults only
- Heatmap ramp: blue -> green -> yellow -> orange -> red
- Route trail: cyan or blue
- Tractor marker: bright contrasting icon with slight glow

## Typography
- Use a highly legible sans-serif font
- Prefer Inter, Manrope, or Public Sans for web
- Use semibold labels over thin text
- Avoid small captions as the primary carrier of meaning
- Keep mobile body text comfortable and dashboard numbers prominent

## Spacing and targets
- Use generous card padding
- Use large buttons for primary actions
- Keep touch targets large and well spaced
- Avoid cramped nav bars and dense tables on mobile

## Layout rules
- Mobile-first responsive design
- Desktop uses a card-grid dashboard
- Tablet and mobile prioritize stacked flows
- Use bottom navigation on mobile
- Use left nav or top nav on desktop depending on density
- Keep key actions visible without deep menus

## Map and animation rules
- Show a small animated tractor icon moving along the field path
- Route animation should feel smooth, live, and visually polished
- Infection heatmap should animate progressively as route data updates
- Support play, pause, replay speed, and scrub controls
- Show route progress and timestamp overlays
- Make legends always visible and easy to understand
- Provide a reduced-motion option
- Keep map controls large enough for field and expo use

## Charts and analytics
- Use simple charts with plain-language titles
- Add summary callouts above charts
- Never rely on color alone
- Use trend lines, deltas, labels, and tooltips
- Include “how this helped” summary cards
- Show performance over time, not just raw totals

## Farmer-friendly UX rules
- Prefer icons plus labels
- Keep farmer-facing language simple and direct
- Use progressive disclosure for advanced details
- Provide one-tap access to Help and Ask AI
- Make the app feel calm, not crowded

## Accessibility rules
- Maintain strong contrast ratios for text and controls
- Avoid saturated colors that reduce readability on dark surfaces
- Make interactive targets large and well spaced
- Ensure keyboard accessibility on web
- Include text alternatives for visual status indicators
- Respect reduced-motion preferences
- Design for users with low digital fluency
