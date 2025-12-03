# AgrOmie Style Guide

> Complete brand and visual style guide for AgrOmie ERP Rural. This document defines the exact colors, typography, spacing, shadows, and component styles used throughout the application.

**Version**: 1.0
**Last Updated**: December 2025
**Status**: Phase 1 - Visual Foundation

---

## 🎨 Color System

### Primary Palette

**Primary Green** - Agricultural identity, main brand color
- `--primary: 142 70% 25%` → `hsl(142, 70%, 25%)` → `#137043` (Dark forest green)
- `--primary-light: 142 60% 35%` → Lighter variant for hover states
- `--primary-dark: 142 80% 18%` → Darker variant for active states
- **Usage**: CTAs, primary buttons, links, active states, brand moments
- **Contrast**: White text on primary green meets WCAG AAA (7.8:1)

**Secondary Colors**
- `--secondary: 0 0% 20%` → Dark gray for secondary actions
- `--accent: 142 50% 40%` → Medium green for accents and highlights

### Semantic Colors

**Success** - Positive outcomes, confirmations
- `--success: 142 70% 30%` → Green (agricultural success)
- **Usage**: Success messages, positive metrics, confirmation states

**Warning** - Caution, attention needed
- `--warning: 25 85% 45%` → Warm orange/terra-cotta
- **Usage**: Warning messages, attention indicators, moderate risk

**Destructive/Error** - Errors, dangerous actions
- `--destructive: 0 75% 40%` → Red
- **Usage**: Error messages, delete actions, critical alerts

### Data Visualization Palette

For charts and graphs, use these distinct colors:
- `--chart-blue: 210 75% 50%` → Blue
- `--chart-purple: 260 60% 55%` → Purple
- `--chart-teal: 180 60% 45%` → Teal
- `--chart-amber: 40 85% 55%` → Amber
- `--chart-green: 142 70% 30%` → Green (primary)
- `--chart-red: 0 75% 40%` → Red (destructive)

**Order of use**: Primary green → Blue → Teal → Amber → Purple → Red

### Neutral Colors

**Backgrounds & Surfaces**
- `--background: 0 0% 100%` → Pure white (light mode)
- `--surface-1: 0 0% 98%` → Lightest gray (subtle backgrounds)
- `--surface-2: 0 0% 95%` → Light gray (card backgrounds)
- `--surface-3: 0 0% 92%` → Medium gray (hover states)
- `--card: 0 0% 100%` → Card background (white)

**Text Colors**
- `--foreground: 0 0% 0%` → Black (primary text)
- `--muted-foreground: 0 0% 40%` → Dark gray (secondary text)
- `--card-foreground: 0 0% 0%` → Card text (black)

**Borders & Inputs**
- `--border: 0 0% 85%` → Light gray borders
- `--input: 0 0% 90%` → Input backgrounds

### Dark Mode Palette

**Backgrounds**
- `--background: 0 0% 0%` → Pure black
- `--surface-1: 0 0% 5%` → Slightly lighter black
- `--card: 0 0% 5%` → Card background

**Primary Adjusted**
- `--primary: 142 60% 35%` → Lighter green for dark backgrounds

**Text Adjusted**
- `--foreground: 0 0% 100%` → White
- `--muted-foreground: 0 0% 70%` → Light gray

**Borders Adjusted**
- `--border: 0 0% 20%` → Darker borders
- `--input: 0 0% 15%` → Darker input backgrounds

---

## 🔤 Typography System

### Font Families

**Primary Font: Inter**
- **Usage**: Body text, UI elements, forms, tables
- **Weights**: 400 (Regular), 600 (Semibold), 700 (Bold)
- **Why**: Clean, modern, excellent legibility, optimized for screens
- **Source**: Google Fonts or Fontsource

**Display Font: Satoshi or Manrope**
- **Usage**: Large headings, hero text, marketing content
- **Weights**: 600 (Semibold), 700 (Bold)
- **Why**: Slightly more personality while maintaining professionalism
- **Source**: Fontshare (Satoshi) or Google Fonts (Manrope)

### Type Scale

**Display Sizes** (Headlines, hero sections)
- `display-lg`: 56px / 3.5rem, line-height 1.1, weight 700
- `display-md`: 40px / 2.5rem, line-height 1.2, weight 700

**Heading Sizes** (Section headers, card titles)
- `heading-xl`: 32px / 2rem, line-height 1.3, weight 600
- `heading-lg`: 24px / 1.5rem, line-height 1.4, weight 600
- `heading-md`: 20px / 1.25rem, line-height 1.4, weight 600

**Body Sizes** (Paragraphs, UI text)
- `body-lg`: 18px / 1.125rem, line-height 1.6, weight 400
- `body-md`: 16px / 1rem, line-height 1.6, weight 400 **(Base size)**
- `body-sm`: 14px / 0.875rem, line-height 1.5, weight 400

**Utility Sizes**
- `caption`: 12px / 0.75rem, line-height 1.5, weight 500

### Typography Usage Rules

1. **Base font size is 16px** - Never smaller for body text
2. **Line height for body text: 1.5-1.6** - Comfortable reading
3. **Line height for headings: 1.2-1.4** - Tighter, more impact
4. **Line length: 45-75 characters** - Optimal readability
5. **Font weights**: Use 400 for body, 600 for emphasis, 700 for strong emphasis
6. **Letter spacing**: Default for most, -0.02em for large headings

---

## 📏 Spacing System

### Base Unit: 4px

All spacing should be multiples of 4px (or 8px for larger gaps).

### Spacing Scale

- `1 unit` = 4px → Micro spacing (icon to text, tight gaps)
- `2 units` = 8px → Inline elements (buttons, badges, icons)
- `3 units` = 12px → Small gaps
- `4 units` = 16px → Form groups, related elements
- `6 units` = 24px → Card padding, section gaps
- `8 units` = 32px → Between cards in grid
- `12 units` = 48px → Major page sections
- `16 units` = 64px → Large section breaks

### Spacing Usage Rules

**Component Internal Spacing:**
- Card padding: `24px` (6 units)
- Button padding: `16px horizontal, 8px vertical` (4 units, 2 units)
- Input padding: `12px` (3 units)
- Form field gap: `16px` (4 units)

**Layout Spacing:**
- Between cards: `32px` (8 units)
- Between sections: `48px` (12 units)
- Page margins (mobile): `16px` (4 units)
- Page margins (desktop): `32px` (8 units)

---

## 🌑 Shadows & Elevation

### Shadow Scale

**Card Shadows** (Default state)
```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow-DEFAULT: 0 2px 8px -2px rgb(0 0 0 / 0.1)
shadow-card: 0 2px 8px -2px rgb(0 0 0 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.04)
```

**Elevated Shadows** (Hover, focus, raised states)
```css
shadow-md: 0 4px 12px -2px rgb(0 0 0 / 0.12)
shadow-lg: 0 8px 24px -4px rgb(0 0 0 / 0.15)
shadow-xl: 0 12px 36px -6px rgb(0 0 0 / 0.18)
shadow-card-hover: 0 8px 24px -4px rgb(0 0 0 / 0.12), 0 0 0 1px rgb(0 0 0 / 0.04)
```

**Semantic Shadows** (Success, error states)
```css
shadow-success: 0 4px 12px -2px hsl(142 70% 30% / 0.2)
shadow-error: 0 4px 12px -2px hsl(0 75% 40% / 0.2)
shadow-alert: 0 4px 12px -2px hsl(0 0% 0% / 0.15)
```

### Elevation Usage

- **Level 0** (Flat): Background, page surface
- **Level 1** (Resting): Cards, buttons (shadow-card)
- **Level 2** (Raised): Hover states, selected items (shadow-md)
- **Level 3** (Floating): Dropdowns, popovers (shadow-lg)
- **Level 4** (Modal): Modals, dialogs (shadow-xl)

---

## 🔘 Component Styles

### Buttons

**Variants:**

1. **Primary (Default)** - Main CTAs
   - Background: `hsl(var(--primary))`
   - Text: White
   - Hover: `bg-primary/90` (10% lighter)
   - Active: `scale(0.95)`
   - Shadow: `shadow-sm`, hover: `shadow-md`

2. **Soft** - Secondary CTAs
   - Background: `bg-primary/10` (10% opacity primary)
   - Text: `text-primary`
   - Hover: `bg-primary/20`

3. **Outline** - Tertiary actions
   - Border: `border-2 border-primary`
   - Text: `text-primary`
   - Hover: `bg-primary/5`

4. **Ghost** - Minimal actions
   - Background: Transparent
   - Hover: `bg-accent`

5. **Destructive** - Dangerous actions
   - Background: `hsl(var(--destructive))`
   - Text: White
   - Hover: `bg-destructive/90`

**Sizes:**
- `sm`: height 36px, padding 12px, text 14px
- `default`: height 40px, padding 16px, text 16px
- `lg`: height 48px, padding 24px, text 18px
- `icon`: 40x40px (square)

**States:**
- **Loading**: Spinner + `opacity-70 cursor-not-allowed`
- **Disabled**: `opacity-50 cursor-not-allowed`

### Cards

**Default Card:**
- Background: `white` (light mode), `hsl(0 0% 5%)` (dark mode)
- Border: `1px solid hsl(var(--border)/50)`
- Border radius: `8px` (--radius)
- Padding: `24px`
- Shadow: `shadow-card`
- Hover (if interactive): `shadow-card-hover`, `scale(1.02)`, `translate-y(-2px)`

**Variants:**
- **Success**: `bg-gradient-to-br from-success/5 to-background`, `border-success/20`
- **Warning**: `bg-gradient-to-br from-warning/5 to-background`, `border-warning/20`
- **Accent**: `bg-gradient-to-br from-primary/5 to-background`, `border-primary/20`

### Badges

**Variants:**
- **Default**: `bg-secondary`, `text-secondary-foreground`
- **Success**: `bg-success/10`, `text-success`, `border-success/20`
- **Warning**: `bg-warning/10`, `text-warning`, `border-warning/20`
- **Destructive**: `bg-destructive/10`, `text-destructive`, `border-destructive/20`
- **Outline**: `border`, `bg-background`

**Size**: Padding `4px 8px`, text `12px`, border radius `4px`

### Inputs

**Default State:**
- Background: `hsl(var(--input))`
- Border: `1px solid hsl(var(--border))`
- Text: `hsl(var(--foreground))`
- Padding: `12px`
- Border radius: `6px`

**Focus State:**
- Border: `2px solid hsl(var(--primary))`
- Ring: `ring-2 ring-primary ring-offset-2`

**Error State:**
- Border: `2px solid hsl(var(--destructive))`
- Ring: `ring-2 ring-destructive ring-offset-2`
- Error text below: `text-sm text-destructive` with `AlertCircle` icon

**Disabled State:**
- Background: `bg-muted`
- Text: `text-muted-foreground`
- Cursor: `cursor-not-allowed`

---

## 📐 Border Radius

- `sm`: 4px (calc(var(--radius) - 4px))
- `md`: 6px (calc(var(--radius) - 2px))
- `lg`: 8px (var(--radius)) **(Default)**
- `xl`: 12px
- `2xl`: 16px
- `full`: 9999px (Pills, circles)

**Usage:**
- Buttons, inputs: `6px` (md)
- Cards: `8px` (lg)
- Badges: `4px` (sm)
- Avatars: `full`

---

## ⚡ Transitions & Animations

### Transition Durations

- `fast`: 150ms - Quick interactions (hover, active)
- `normal`: 250ms - Standard transitions (most UI elements)
- `slow`: 350ms - Deliberate animations (modals, drawers)

### Transition Timing Functions

- `smooth`: cubic-bezier(0.4, 0, 0.2, 1) - Default easing
- `bounce`: cubic-bezier(0.68, -0.55, 0.265, 1.55) - Playful bounce

### Animation Guidelines

1. **Keep animations under 300ms** - Snappy, not sluggish
2. **Use smooth easing** - Natural motion
3. **Respect `prefers-reduced-motion`** - Disable for accessibility
4. **Animate only transform and opacity** - Best performance
5. **60fps target** - No jank

**Common Animations:**
- Fade in: `opacity: 0 → 1`, 250ms
- Slide up: `y: 20px → 0`, opacity `0 → 1`, 300ms
- Card hover: `scale: 1 → 1.02`, `y: 0 → -2px`, 200ms
- Button press: `scale: 1 → 0.95`, 150ms

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1400px /* Large desktops (max content width) */
```

**Design Approach:**
- **Mobile-first**: Design for mobile, enhance for desktop
- **Breakpoint usage**: Change layout at `md` (768px) and `lg` (1024px)
- **Touch targets on mobile**: Minimum 44x44px (48x48px preferred)

---

## 🎯 Component State Matrix

Every interactive component should have these states:

| State | Visual Change | Example |
|-------|---------------|---------|
| **Default** | Base styles | `bg-primary text-white` |
| **Hover** | Lighter/Shadow | `bg-primary/90 shadow-md` |
| **Active** | Pressed/Scale | `scale-95` |
| **Focus** | Ring | `ring-2 ring-primary ring-offset-2` |
| **Disabled** | Faded/Cursor | `opacity-50 cursor-not-allowed` |
| **Loading** | Spinner | `<Loader2 className="animate-spin" />` |
| **Error** | Red border/text | `border-destructive text-destructive` |
| **Success** | Green border/text | `border-success text-success` |

---

## 🌈 Gradients

**Primary Gradient:**
```css
background: linear-gradient(135deg, hsl(142 70% 25%) 0%, hsl(142 60% 35%) 100%)
```

**Card Gradient (Subtle):**
```css
background: linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 98%) 100%)
```

**Success Gradient:**
```css
background: linear-gradient(135deg, hsl(142 70% 30%) 0%, hsl(142 60% 40%) 100%)
```

**Usage**: Sparingly for hero sections, premium cards, special CTAs

---

## ♿ Accessibility Requirements

### Contrast Ratios

- **Normal text (< 18px)**: Minimum 4.5:1 (WCAG AA)
- **Large text (≥ 18px or ≥ 14px bold)**: Minimum 3:1 (WCAG AA)
- **Interactive elements**: Minimum 3:1 against background
- **Target**: AAA when possible (7:1 for normal text, 4.5:1 for large text)

### Focus Indicators

- **Ring width**: 2px
- **Ring color**: Primary or high contrast
- **Ring offset**: 2px
- **Visible on all interactive elements**

### Touch Targets

- **Minimum**: 44x44px
- **Preferred**: 48x48px
- **Spacing between targets**: Minimum 8px

---

## 📋 Usage Examples

### Example: Primary Button
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95">
  Salvar
</Button>
```

### Example: Card with Hover
```tsx
<Card className="border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Example: Input with Error
```tsx
<div className="space-y-1">
  <Label>Email</Label>
  <Input className="border-destructive focus:ring-destructive" />
  <p className="text-sm text-destructive flex items-center gap-1">
    <AlertCircle className="h-4 w-4" />
    Email inválido
  </p>
</div>
```

---

## 🔄 Versioning

- **v1.0 (Current)**: Phase 1 - Visual Foundation
- **v1.1 (Planned)**: Phase 2 - Component Enhancement
- **v1.2 (Planned)**: Phase 3 - Data Visualization
- **v2.0 (Planned)**: Phase 4+ - Animations, Mobile, Dark Mode

---

**Maintained by**: AgrOmie Development Team
**Questions?**: Refer to `design-principles.md` for philosophy and guidelines
