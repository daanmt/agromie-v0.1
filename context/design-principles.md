# AgrOmie Design Principles

> Comprehensive design checklist and principles for building a premium, accessible, and beautiful rural ERP that small producers will love to use and trust.

**Version**: 1.0
**Last Updated**: December 2025
**Target Grade**: A+ (S-tier visual quality)

---

## 🌾 Core Design Philosophy

### 1. Agricultural Professionalism
- **Serious, trustworthy, grounded in nature**
- Green remains primary color (forest/agricultural identity)
- Black/white for contrast and clarity
- Professional enough for business, approachable enough for farmers

### 2. Minimalist Elegance
- **Clean, uncluttered interfaces**
- Strategic use of white space
- "Less is more" - remove before adding
- Every element must serve a purpose

### 3. Interaction-First
- **Every action gets immediate, clear feedback**
- Smooth, purposeful animations (< 300ms)
- Micro-interactions make the interface feel alive
- Respect `prefers-reduced-motion` for accessibility

### 4. Accessible Beauty
- **WCAG AA compliance minimum** (AAA where possible)
- High contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Large touch targets (minimum 44x44px)
- Works beautifully for everyone, regardless of ability

---

## 🎨 Visual Design Checklist

### Typography
- [ ] **Hierarchy is clear** - Heading levels are visually distinct
- [ ] **Line length is readable** - 45-75 characters per line for body text
- [ ] **Line height is comfortable** - 1.5-1.6 for body, 1.2-1.4 for headings
- [ ] **Font sizes are accessible** - Minimum 16px for body text
- [ ] **Font weights create contrast** - Use 400 (regular), 600 (semibold), 700 (bold)
- [ ] **Text has sufficient contrast** - Minimum 4.5:1 for normal text

### Color
- [ ] **Primary color (green) is used strategically** - CTAs, important actions, brand moments
- [ ] **Semantic colors are consistent** - Success (green), Warning (orange), Error (red)
- [ ] **Contrast ratios meet WCAG AA** - All text is readable
- [ ] **Dark mode colors are inverted properly** - Tested in both themes
- [ ] **Color is not the only indicator** - Always paired with icons, text, or patterns

### Spacing
- [ ] **Spacing follows 4px/8px grid** - All margins and padding are multiples of 4
- [ ] **Consistent spacing scale** - 4px, 8px, 16px, 24px, 32px, 48px
- [ ] **White space creates breathing room** - Dense sections have clear separation
- [ ] **Related elements are grouped** - Visual proximity indicates relationships

### Layout
- [ ] **Grid system is consistent** - 12-column grid for desktop, flexible for mobile
- [ ] **Maximum content width** - 1400px max for readability
- [ ] **Responsive breakpoints** - Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)
- [ ] **Cards have consistent padding** - 24px (6 units) internal spacing
- [ ] **Page margins are sufficient** - Minimum 16px on mobile, 32px on desktop

### Depth & Elevation
- [ ] **Shadow indicates interactivity** - Interactive elements have subtle shadows
- [ ] **Hover states increase elevation** - Cards lift slightly on hover
- [ ] **Modals and popovers are elevated** - Clear visual hierarchy
- [ ] **Shadows are subtle and realistic** - No harsh, unrealistic shadows

---

## 🧩 Component Design Standards

### Buttons
- [ ] **Primary action is visually distinct** - Solid green background
- [ ] **Secondary actions are subdued** - Outline or ghost style
- [ ] **Destructive actions use red** - Clear warning for dangerous operations
- [ ] **Loading states are clear** - Spinner + disabled state
- [ ] **Minimum touch target** - 44x44px (48x48px preferred)
- [ ] **Focus states are visible** - 2px ring, high contrast

### Cards
- [ ] **Border is subtle** - 1px, light gray
- [ ] **Shadow indicates depth** - Subtle shadow, stronger on hover
- [ ] **Padding is consistent** - 24px internal spacing
- [ ] **Content is well-organized** - Clear header, body, footer sections
- [ ] **Interactive cards have hover states** - Lift + shadow increase

### Forms
- [ ] **Labels are clear and positioned above inputs** - Easy to scan
- [ ] **Error states are immediately visible** - Red border + inline error message
- [ ] **Required fields are marked** - Asterisk or "(obrigatório)" text
- [ ] **Input states are distinct** - Default, Focus, Error, Disabled, Success
- [ ] **Help text is available** - Hints below inputs when needed
- [ ] **Validation is inline** - Real-time feedback as user types

### Tables
- [ ] **Headers are visually distinct** - Bold or background color
- [ ] **Rows are easily scannable** - Subtle zebra striping or hover states
- [ ] **Responsive on mobile** - Convert to cards or horizontal scroll
- [ ] **Pagination is clear** - Show current page and total pages
- [ ] **Actions are accessible** - Buttons or dropdowns, not hidden

### Empty States
- [ ] **Illustration or icon is present** - Visual interest
- [ ] **Headline explains the state** - "Nenhuma transação registrada"
- [ ] **Description provides context** - Why is it empty? What can I do?
- [ ] **Call-to-action is clear** - Button to create first item
- [ ] **Tone is friendly and encouraging** - Not boring or technical

### Loading States
- [ ] **Skeleton screens match content layout** - Same structure as loaded content
- [ ] **Shimmer animation is subtle** - Indicates loading without distraction
- [ ] **Progress indicators show percent** - For long operations
- [ ] **Button loading states are inline** - Spinner inside button, not separate

### Error States
- [ ] **Error message is clear and actionable** - What went wrong? How to fix?
- [ ] **Error icon is present** - AlertCircle or similar
- [ ] **Retry option is available** - If applicable
- [ ] **Error is not technical** - Use plain language, not error codes

---

## 📊 Data Visualization Guidelines

### Charts
- [ ] **Chart type matches data type** - Line for trends, Bar for comparison, Pie for parts-of-whole
- [ ] **Colors are semantically meaningful** - Green for positive, Red for negative
- [ ] **Axes are labeled clearly** - Include units (R$, kg, ha)
- [ ] **Tooltips provide context** - Show exact values on hover
- [ ] **Legends are positioned logically** - Bottom or right side
- [ ] **Responsive on mobile** - Shrink gracefully, maintain readability

### Metrics (KPIs)
- [ ] **Value is the primary focus** - Large, bold number
- [ ] **Trend indicator is present** - Arrow up/down + percentage
- [ ] **Context is provided** - "vs. mês anterior" or timeframe
- [ ] **Color indicates direction** - Green for positive, Red for negative
- [ ] **Units are clear** - R$, kg/dia, UA/ha, etc.

---

## ♿ Accessibility Standards

### Keyboard Navigation
- [ ] **All interactive elements are keyboard accessible** - Tab order is logical
- [ ] **Focus indicators are visible** - 2px ring, high contrast
- [ ] **Skip links are provided** - Skip to main content
- [ ] **Keyboard shortcuts are documented** - If applicable

### Screen Readers
- [ ] **ARIA labels are present** - For icon buttons and complex widgets
- [ ] **Landmarks are used** - header, nav, main, footer, aside
- [ ] **Alt text is descriptive** - For all images and icons
- [ ] **Form labels are associated** - htmlFor attribute
- [ ] **Live regions announce updates** - For dynamic content

### Color & Contrast
- [ ] **Contrast ratios meet WCAG AA** - 4.5:1 for normal text, 3:1 for large text
- [ ] **Color is not the only indicator** - Icons, patterns, or text reinforce meaning
- [ ] **Focus states are high contrast** - Easily visible
- [ ] **Tested with color blindness simulators** - Deuteranopia, Protanopia, Tritanopia

### Motion & Animation
- [ ] **Animations are subtle** - < 300ms duration
- [ ] **`prefers-reduced-motion` is respected** - Disable animations for sensitive users
- [ ] **No flashing content** - Avoid seizure triggers (< 3 flashes per second)

---

## 📱 Mobile & Responsive Design

### Touch Targets
- [ ] **Minimum size is 44x44px** - 48x48px preferred
- [ ] **Spacing between targets is sufficient** - Minimum 8px
- [ ] **Tap response is immediate** - Visual feedback < 100ms

### Mobile Navigation
- [ ] **Hamburger menu is easily accessible** - Top-left or top-right
- [ ] **Bottom navigation for key actions** - If applicable
- [ ] **Swipe gestures are intuitive** - Swipe to delete, swipe to refresh

### Mobile Forms
- [ ] **Input types are optimized** - type="tel" for phone, inputMode="numeric" for numbers
- [ ] **Font size is 16px minimum** - Prevents zoom on iOS
- [ ] **Autocomplete is enabled** - autocomplete attribute
- [ ] **Labels are floating or above inputs** - Not inside inputs

### Responsive Tables
- [ ] **Convert to cards on mobile** - Easier to scan
- [ ] **Horizontal scroll with indicators** - If table must stay tabular
- [ ] **Most important columns are visible** - Hide less critical data

---

## ✨ Micro-interactions & Animation

### Hover States
- [ ] **All interactive elements have hover states** - Color change, shadow increase, lift
- [ ] **Transition is smooth** - 150-250ms duration
- [ ] **Cursor changes to pointer** - For clickable elements

### Active States
- [ ] **Buttons scale down slightly** - scale(0.95) on active
- [ ] **Visual feedback is immediate** - < 100ms

### Loading Animations
- [ ] **Spinners are subtle** - Small, not distracting
- [ ] **Skeleton screens are smooth** - Shimmer animation
- [ ] **Progress bars are accurate** - Show real progress, not fake

### Success Animations
- [ ] **Checkmark appears with bounce** - Spring animation
- [ ] **Toast notifications slide in** - From top or bottom
- [ ] **Confetti for major milestones** - First sale, 100 animals, etc.

---

## 🎯 Performance Standards

### Load Times
- [ ] **First Contentful Paint < 1.5s** - Page starts rendering quickly
- [ ] **Time to Interactive < 3s** - Page is fully interactive
- [ ] **Lighthouse Performance Score > 90** - Optimized for speed

### Bundle Size
- [ ] **JavaScript bundle < 200KB gzipped** - Fast download
- [ ] **CSS bundle < 50KB gzipped** - Minimal styles
- [ ] **Images are optimized** - WebP format, lazy loading
- [ ] **Fonts are subset** - Only include characters needed

### Accessibility
- [ ] **Lighthouse Accessibility Score > 95** - High accessibility
- [ ] **WCAG AA compliance: 100%** - All criteria met

---

## 📋 Pre-Launch Checklist

### Visual Quality
- [ ] **Consistent spacing throughout** - Follows 4px/8px grid
- [ ] **Typography hierarchy is clear** - Heading levels are distinct
- [ ] **Colors are consistent** - Semantic colors used correctly
- [ ] **Shadows are subtle** - Realistic depth
- [ ] **All states are designed** - Empty, loading, error, success

### Functionality
- [ ] **All forms validate properly** - Inline errors, clear messages
- [ ] **All buttons have loading states** - Spinner + disabled
- [ ] **All empty states have CTAs** - Guide user to next action
- [ ] **All error states have retry** - If applicable

### Accessibility
- [ ] **Keyboard navigation works** - Tab order is logical
- [ ] **Screen reader tested** - NVDA/JAWS on Windows, VoiceOver on Mac
- [ ] **Color contrast verified** - All text meets WCAG AA
- [ ] **Touch targets are sufficient** - Minimum 44x44px

### Performance
- [ ] **Lighthouse scores > 90** - Performance, Accessibility, Best Practices, SEO
- [ ] **No console errors** - Clean browser console
- [ ] **Images are optimized** - Compressed, lazy loaded
- [ ] **Animations are smooth** - 60fps, no jank

### Responsiveness
- [ ] **Tested on mobile** - iPhone, Android
- [ ] **Tested on tablet** - iPad, Android tablet
- [ ] **Tested on desktop** - Various screen sizes
- [ ] **Tested in both themes** - Light and dark mode

---

## 🔍 Review Process

When reviewing any visual change, ask:

1. **Does it align with our core philosophy?** (Agricultural, Minimalist, Interaction-First, Accessible)
2. **Is it consistent with existing patterns?** (Typography, colors, spacing, shadows)
3. **Is it accessible?** (Contrast, keyboard navigation, screen readers)
4. **Is it responsive?** (Mobile, tablet, desktop)
5. **Does it have all states?** (Default, hover, active, focus, disabled, loading, error, success)
6. **Is it performant?** (Fast, smooth animations)

---

**Remember**: Every pixel matters. Every interaction should feel intentional. Every user should feel welcomed.

**Goal**: Transform AgrOmie from a functional MVP into a visually stunning, minimalist, and highly interactive rural ERP that small producers will love to use and trust.
