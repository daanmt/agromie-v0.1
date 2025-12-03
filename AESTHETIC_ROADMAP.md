# AgrOmie - Aesthetic Roadmap
## UI/UX Evolution to Premium Product

> **Mission:** Transform AgrOmie from a functional MVP into a visually stunning, minimalist, and highly interactive rural ERP that small producers will love to use and trust.

---

## Executive Summary

**Current State:** Solid functional foundation (Grade B-) with shadcn/ui + Tailwind CSS
**Target State:** Premium, polished product (Grade A+) with S-tier visual quality
**Timeline:** 8-10 weeks for complete aesthetic transformation
**Focus:** Clean, minimalist, interactive, and "sexy" design that maintains agricultural professionalism

### Key Gaps Identified

1. **Visual Polish** - Flat, utilitarian appearance lacks depth and visual interest
2. **Micro-interactions** - Minimal animations, no rich user feedback
3. **Data Visualization** - Financial/livestock data in tables only (no charts)
4. **State Management** - Basic empty/loading/error states
5. **Mobile Experience** - Not optimized for touch/small screens
6. **Typography** - Default fonts, missing brand personality

---

## Design Philosophy

### Core Principles

**🌾 Agricultural Professionalism**
- Serious, trustworthy, grounded in nature
- Green remains primary (forest/agricultural identity)
- Black/white for contrast and clarity

**✨ Minimalist Elegance**
- Clean, uncluttered interfaces
- Strategic use of white space
- "Less is more" - remove before adding

**🎯 Interaction-First**
- Every action gets immediate, clear feedback
- Smooth, purposeful animations
- Micro-interactions make the interface feel alive

**💚 Accessible Beauty**
- WCAG AA compliance minimum
- High contrast, large touch targets
- Works beautifully for everyone

---

## Phase-Based Roadmap

### 🚀 Phase 1: Visual Foundation Enhancement (2 weeks)
**Goal:** Add immediate polish without major refactoring

#### 1.1 Typography System (3 days)

**Implementation:**

```typescript
// tailwind.config.ts additions
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Satoshi', 'Inter', 'sans-serif'],
},
fontSize: {
  'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
  'display-md': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
  'heading-xl': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
  'heading-lg': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
  'heading-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
  'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
  'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
  'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
  'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
}
```

**Font Choice:**
- **Primary:** Inter (clean, modern, excellent legibility)
- **Display:** Satoshi or Manrope (for headlines, slightly more personality)
- **Implementation:** Google Fonts or Fontsource

**Tasks:**
- [ ] Install Inter and Satoshi fonts
- [ ] Update Tailwind config with font families and scale
- [ ] Apply to all text elements throughout app
- [ ] Test readability at different sizes

#### 1.2 Color Palette Expansion (2 days)

**Current:** Monochromatic green + black/white
**Enhancement:** Richer palette for data visualization and accents

```typescript
// index.css additions
:root {
  /* Primary - Keep existing green */
  --primary: 142 70% 25%;

  /* NEW: Secondary warm accent for CTAs */
  --secondary-warm: 25 75% 47%; /* Warm terra-cotta */

  /* NEW: Data visualization palette */
  --chart-blue: 210 75% 50%;
  --chart-purple: 260 60% 55%;
  --chart-teal: 180 60% 45%;
  --chart-amber: 40 85% 55%;

  /* NEW: Surface colors for depth */
  --surface-1: 0 0% 98%;  /* Lightest gray */
  --surface-2: 0 0% 95%;  /* Light gray */
  --surface-3: 0 0% 92%;  /* Medium gray */

  /* NEW: Gradient definitions */
  --gradient-primary: linear-gradient(135deg, hsl(142 70% 25%) 0%, hsl(142 60% 35%) 100%);
  --gradient-card: linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 98%) 100%);
  --gradient-success: linear-gradient(135deg, hsl(142 70% 30%) 0%, hsl(142 60% 40%) 100%);
}
```

**Tasks:**
- [ ] Define extended color palette in CSS variables
- [ ] Add data visualization colors (blue, purple, teal, amber)
- [ ] Create warm secondary accent (terra-cotta/rust)
- [ ] Implement gradient utilities
- [ ] Audit all color usage for consistency

#### 1.3 Depth & Shadow System (2 days)

**Elevation Scale:**

```typescript
// tailwind.config.ts
boxShadow: {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'DEFAULT': '0 2px 8px -2px rgb(0 0 0 / 0.1)',
  'md': '0 4px 12px -2px rgb(0 0 0 / 0.12)',
  'lg': '0 8px 24px -4px rgb(0 0 0 / 0.15)',
  'xl': '0 12px 36px -6px rgb(0 0 0 / 0.18)',
  'card': '0 2px 8px -2px rgb(0 0 0 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.04)',
  'card-hover': '0 8px 24px -4px rgb(0 0 0 / 0.12), 0 0 0 1px rgb(0 0 0 / 0.04)',
  'success': '0 4px 12px -2px hsl(142 70% 30% / 0.2)',
  'error': '0 4px 12px -2px hsl(0 75% 40% / 0.2)',
}
```

**Card Enhancement Pattern:**

```tsx
// Before
<Card className="border-2">

// After
<Card className="border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-200">
```

**Tasks:**
- [ ] Define comprehensive shadow scale
- [ ] Apply elevation to all cards
- [ ] Add hover shadow transitions
- [ ] Create semantic shadows (success, error, warning)
- [ ] Test shadow performance

#### 1.4 Spacing Audit & Consistency (3 days)

**Systematic Spacing:**

- **Sections:** 48px (12 units) - Major page sections
- **Cards:** 32px (8 units) - Between cards in grid
- **Card Padding:** 24px (6 units) - Internal card spacing
- **Form Groups:** 16px (4 units) - Between form fields
- **Inline Elements:** 8px (2 units) - Buttons, badges, icons
- **Micro Spacing:** 4px (1 unit) - Icon to text, small gaps

**Tasks:**
- [ ] Audit all spacing in Dashboard, Financial, Livestock pages
- [ ] Replace inconsistent spacing with systematic scale
- [ ] Create spacing utility classes if needed
- [ ] Document spacing patterns
- [ ] Visual regression test

---

### 🎨 Phase 2: Component Enhancement (2 weeks)
**Goal:** Elevate component quality to S-tier standards

#### 2.1 Empty States (3 days)

**Design Approach:**
- Illustration + Headline + Description + CTA
- Friendly, encouraging tone
- Contextual to the module

**Implementation:**

```tsx
// New component: components/ui/empty-state.tsx
interface EmptyStateProps {
  illustration: ReactNode; // SVG or image
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

// Example usage in Financial module
<EmptyState
  illustration={<EmptyWalletIllustration />}
  title="Nenhuma transação registrada"
  description="Comece registrando sua primeira receita ou despesa para acompanhar suas finanças."
  action={{
    label: "Registrar primeira transação",
    onClick: () => openTransactionForm()
  }}
/>
```

**Illustrations:**
- Use library: [Undraw](https://undraw.co/), [Humaaans](https://www.humaaans.com/), or custom SVG
- Agricultural theme: farmer, livestock, field, tractor
- Consistent style across all empty states

**Empty States Needed:**
- Financial: No transactions, no cash flow data
- Livestock: No animals registered, no sales/purchases
- Pastures: No pastures registered
- Dashboard: First-time user (onboarding prompt)

**Tasks:**
- [ ] Create EmptyState component
- [ ] Design/source 5-6 agricultural illustrations
- [ ] Implement in all modules
- [ ] Add helpful CTAs that guide next action
- [ ] Test with first-time users

#### 2.2 Loading States & Skeleton Screens (3 days)

**Skeleton Pattern:**

```tsx
// components/ui/skeleton.tsx (already exists, enhance)
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-2/3" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-2" />
    <Skeleton className="h-4 w-4/6" />
  </CardContent>
</Card>
```

**Loading Patterns:**
- **Page Load:** Skeleton screens matching content layout
- **Button Click:** Spinner inside button + disabled state
- **Data Fetch:** Skeleton rows in tables
- **Long Operations:** Progress bar with percentage

**Implementation:**

```tsx
// Enhanced Button with loading state
<Button loading={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Salvando...
    </>
  ) : (
    "Salvar"
  )}
</Button>
```

**Tasks:**
- [ ] Create skeleton layouts for Dashboard, Financial, Livestock
- [ ] Add loading prop to Button component
- [ ] Implement progress indicators for long operations
- [ ] Add shimmer animation to skeletons
- [ ] Test loading states across all flows

#### 2.3 Error States & Form Validation (2 days)

**Visual Error Pattern:**

```tsx
// Enhanced Input with error state
<div className="space-y-1">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    className={cn(
      errors.email && "border-destructive focus:ring-destructive"
    )}
  />
  {errors.email && (
    <p className="text-sm text-destructive flex items-center gap-1">
      <AlertCircle className="h-4 w-4" />
      {errors.email.message}
    </p>
  )}
</div>
```

**Error States Needed:**
- **Form Validation:** Inline errors below fields
- **API Errors:** Toast + optional inline message
- **Empty Results:** "Nenhum resultado encontrado" with suggestion
- **Network Errors:** Retry button + helpful message

**Tasks:**
- [ ] Add error state styling to Input component
- [ ] Create inline error message pattern
- [ ] Implement form validation with React Hook Form + Zod
- [ ] Add error illustrations for major failures
- [ ] Test all error scenarios

#### 2.4 Enhanced Cards & Badges (2 days)

**Card Variants:**

```tsx
// components/ui/card.tsx additions
const cardVariants = cva(
  "rounded-lg border shadow-card transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-background border-border/50 hover:shadow-card-hover",
        success: "bg-gradient-to-br from-success/5 to-background border-success/20",
        warning: "bg-gradient-to-br from-warning/5 to-background border-warning/20",
        accent: "bg-gradient-to-br from-primary/5 to-background border-primary/20",
      },
      interactive: {
        true: "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
      }
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    }
  }
);
```

**Badge Enhancements:**

```tsx
// Add status-specific variants
<Badge variant="success">Concluído</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="info">Em andamento</Badge>
<Badge variant="neutral">Rascunho</Badge>
```

**Tasks:**
- [ ] Add card variants (success, warning, accent)
- [ ] Implement interactive card styles (hover, active)
- [ ] Expand badge variants with semantic colors
- [ ] Add icon support to badges
- [ ] Apply across all modules

#### 2.5 Button Enhancements (2 days)

**New Variants:**

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        outline: "border-2 border-primary text-primary hover:bg-primary/5",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
      loading: {
        true: "opacity-70 cursor-not-allowed",
      }
    }
  }
);
```

**Tasks:**
- [ ] Add "soft" variant (colored background with transparency)
- [ ] Implement loading state with spinner
- [ ] Add press animation (scale effect)
- [ ] Create icon+text button patterns
- [ ] Test all variants across themes

---

### 📊 Phase 3: Data Visualization (2 weeks)
**Goal:** Make data come alive with beautiful charts and graphs

#### 3.1 Chart Library Setup (1 day)

**Library:** Recharts (already installed!)
**Why:** Composable, React-friendly, highly customizable

**Tasks:**
- [ ] Audit Recharts installation
- [ ] Create chart theme matching design system
- [ ] Set up responsive container patterns
- [ ] Define color palette for data series

#### 3.2 Financial Module Charts (4 days)

**Cash Flow Line Chart:**

```tsx
// components/financial/CashFlowChart.tsx
<Card>
  <CardHeader>
    <CardTitle>Fluxo de Caixa</CardTitle>
    <CardDescription>Últimos 12 meses</CardDescription>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={cashFlowData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="receitas"
          stroke="hsl(var(--success))"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="despesas"
          stroke="hsl(var(--destructive))"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

**Expense Breakdown Pie Chart:**

```tsx
// Visualize expenses by category
<PieChart>
  <Pie
    data={expensesByCategory}
    dataKey="value"
    nameKey="category"
    cx="50%"
    cy="50%"
    outerRadius={80}
  >
    {expensesByCategory.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

**Revenue vs Expenses Bar Chart:**

```tsx
// Monthly comparison
<BarChart data={monthlyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="receitas" fill="hsl(var(--success))" />
  <Bar dataKey="despesas" fill="hsl(var(--destructive))" />
</BarChart>
```

**Tasks:**
- [ ] Implement Cash Flow line chart
- [ ] Create Expense breakdown pie chart
- [ ] Add Revenue vs Expenses bar chart
- [ ] Add trend indicators (arrows, percentages)
- [ ] Make charts interactive (tooltips, hover effects)

#### 3.3 Livestock Module Visualization (3 days)

**Herd Growth Area Chart:**

```tsx
// components/livestock/HerdGrowthChart.tsx
<AreaChart data={herdHistoricalData}>
  <defs>
    <linearGradient id="colorHerd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Area
    type="monotone"
    dataKey="totalAnimals"
    stroke="hsl(var(--primary))"
    fillOpacity={1}
    fill="url(#colorHerd)"
  />
</AreaChart>
```

**Category Distribution Donut Chart:**

```tsx
// Livestock by category (vacas, bezerros, bois, etc.)
<ResponsiveContainer width="100%" height={250}>
  <PieChart>
    <Pie
      data={categoryDistribution}
      innerRadius={60}
      outerRadius={80}
      paddingAngle={5}
      dataKey="count"
    >
      {categoryDistribution.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

**Weight Gain Line Chart:**

```tsx
// Average daily gain (GMD) over time
<LineChart data={weightGainData}>
  <XAxis dataKey="date" />
  <YAxis label={{ value: 'GMD (kg/dia)', angle: -90 }} />
  <Tooltip />
  <Line
    type="monotone"
    dataKey="gmd"
    stroke="hsl(var(--chart-blue))"
    strokeWidth={2}
  />
  <ReferenceLine y={1.0} stroke="hsl(var(--success))" strokeDasharray="3 3" label="Meta" />
</LineChart>
```

**Tasks:**
- [ ] Create Herd Growth area chart
- [ ] Implement Category Distribution donut chart
- [ ] Add Weight Gain (GMD) line chart
- [ ] Add reference lines for targets/goals
- [ ] Create mini sparklines for dashboard metrics

#### 3.4 Pasture Module Visualization (2 days)

**Stocking Rate Bar Chart:**

```tsx
// Comparison of stocking rate across pastures
<BarChart data={pastureStockingData} layout="horizontal">
  <XAxis type="number" />
  <YAxis dataKey="pastureName" type="category" />
  <Tooltip />
  <Bar dataKey="stockingRate" fill="hsl(var(--primary))">
    {pastureStockingData.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={getStockingRateColor(entry.status)}
      />
    ))}
  </Bar>
</BarChart>

// Color helper
function getStockingRateColor(status: 'IDEAL' | 'SUBLOTADO' | 'SUPERLOTADO') {
  switch(status) {
    case 'IDEAL': return 'hsl(var(--success))';
    case 'SUBLOTADO': return 'hsl(var(--warning))';
    case 'SUPERLOTADO': return 'hsl(var(--destructive))';
  }
}
```

**Capacity vs Usage Gauge:**

```tsx
// Radial gauge showing pasture utilization
<RadialBarChart
  data={[{ name: 'Utilização', value: utilizationPercent, fill: 'hsl(var(--primary))' }]}
  innerRadius="70%"
  outerRadius="100%"
>
  <RadialBar dataKey="value" />
  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
    <tspan className="text-4xl font-bold">{utilizationPercent}%</tspan>
  </text>
</RadialBarChart>
```

**Tasks:**
- [ ] Create Stocking Rate comparison bar chart
- [ ] Implement Capacity vs Usage gauge
- [ ] Add color coding for pasture status (ideal/under/over)
- [ ] Create pasture map visualization (optional, stretch goal)

#### 3.5 Dashboard Metrics Enhancement (2 days)

**Trend Indicators:**

```tsx
// components/dashboard/TrendIndicator.tsx
interface TrendIndicatorProps {
  value: number;
  change: number; // percentage
  timeframe: string; // "vs. mês anterior"
}

<div className="flex items-center gap-2">
  <span className="text-2xl font-bold">{formatCurrency(value)}</span>
  <div className={cn(
    "flex items-center gap-1 text-sm font-medium",
    change > 0 ? "text-success" : "text-destructive"
  )}>
    {change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
    <span>{Math.abs(change)}%</span>
  </div>
  <span className="text-xs text-muted-foreground">{timeframe}</span>
</div>
```

**Mini Sparklines:**

```tsx
// Tiny charts inside metric cards
<Sparklines data={last7DaysData} width={100} height={30}>
  <SparklinesLine color="hsl(var(--primary))" />
</Sparklines>
```

**Tasks:**
- [ ] Add trend indicators to all KPI cards
- [ ] Implement mini sparklines for quick trends
- [ ] Add comparison period selector (week, month, year)
- [ ] Animate number counters on load (count-up effect)

---

### ✨ Phase 4: Animations & Micro-interactions (1 week)
**Goal:** Make the interface feel alive and responsive

#### 4.1 Transition System (2 days)

**Global Transitions:**

```typescript
// tailwind.config.ts
theme: {
  extend: {
    transitionDuration: {
      'fast': '150ms',
      'normal': '250ms',
      'slow': '350ms',
    },
    transitionTimingFunction: {
      'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  }
}
```

**Component Transitions:**

```tsx
// Card hover lift
className="transition-all duration-normal hover:scale-[1.02] hover:-translate-y-1"

// Button press
className="transition-transform duration-fast active:scale-95"

// Fade in on mount (with Framer Motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

**Tasks:**
- [ ] Define transition duration and timing tokens
- [ ] Apply consistent transitions to all interactive elements
- [ ] Add hover lift effect to cards
- [ ] Implement button press animation
- [ ] Add fade-in animations for page loads

#### 4.2 Loading Animations (1 day)

**Spinner Enhancement:**

```tsx
// Pulse loading dots
<div className="flex gap-2">
  <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0ms]" />
  <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:150ms]" />
  <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:300ms]" />
</div>

// Progress bar
<motion.div
  className="h-1 bg-primary rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.3 }}
/>
```

**Tasks:**
- [ ] Create pulse loading dots component
- [ ] Implement smooth progress bars
- [ ] Add skeleton shimmer animation
- [ ] Test loading states across all flows

#### 4.3 Success & Feedback Animations (2 days)

**Success Checkmark:**

```tsx
// Animated checkmark on form submit
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 200, damping: 15 }}
  className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center"
>
  <motion.div
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <Check className="w-8 h-8 text-success" />
  </motion.div>
</motion.div>
```

**Confetti for Major Actions:**

```tsx
// Use react-confetti for first sale, first 100 animals, etc.
import Confetti from 'react-confetti';

{showConfetti && (
  <Confetti
    numberOfPieces={200}
    recycle={false}
    colors={['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--accent))']}
  />
)}
```

**Number Counter Animation:**

```tsx
// Animated counting for metrics
<motion.span
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <CountUp end={metricValue} duration={1.5} separator="." decimal="," />
</motion.span>
```

**Tasks:**
- [ ] Create success checkmark animation
- [ ] Implement confetti for milestone achievements
- [ ] Add number counter animation to metrics
- [ ] Create toast notification entrance/exit animations
- [ ] Test feedback animations for all success states

#### 4.4 Gesture & Interaction Refinements (2 days)

**Hover States:**

```css
/* Refined hover effects */
.card-interactive {
  @apply transition-all duration-normal;
  @apply hover:shadow-card-hover hover:scale-[1.01];
}

.button-hover {
  @apply transition-all duration-fast;
  @apply hover:brightness-110 hover:shadow-md;
}

.row-hover {
  @apply transition-colors duration-fast;
  @apply hover:bg-muted/50;
}
```

**Focus States:**

```css
/* Enhanced focus rings */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
  @apply transition-shadow duration-fast;
}
```

**Tasks:**
- [ ] Audit all hover states for consistency
- [ ] Enhance focus rings for accessibility
- [ ] Add ripple effect to buttons (optional)
- [ ] Implement smooth scroll behavior
- [ ] Test all interactions for smoothness

---

### 📱 Phase 5: Mobile & Responsive Optimization (1.5 weeks)
**Goal:** Perfect mobile experience for producers in the field

#### 5.1 Mobile Navigation (3 days)

**Drawer Sidebar:**

```tsx
// components/layout/MobileNav.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-6 w-6" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-80">
    <nav className="flex flex-col gap-4">
      {navItems.map(item => (
        <Link
          key={item.href}
          to={item.href}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  </SheetContent>
</Sheet>
```

**Bottom Navigation Bar:**

```tsx
// For key actions on mobile
<nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
  <div className="grid grid-cols-4 gap-1 p-2">
    {bottomNavItems.map(item => (
      <button
        key={item.href}
        onClick={() => navigate(item.href)}
        className="flex flex-col items-center gap-1 p-2 rounded-lg active:bg-muted"
      >
        <item.icon className="h-6 w-6" />
        <span className="text-xs">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

**Tasks:**
- [ ] Implement drawer sidebar for mobile
- [ ] Create bottom navigation bar
- [ ] Add swipe gestures (swipe right to open sidebar)
- [ ] Test navigation on real mobile devices
- [ ] Ensure touch targets are 48px minimum

#### 5.2 Responsive Tables (2 days)

**Card View for Mobile:**

```tsx
// components/ui/responsive-table.tsx
function ResponsiveTable({ data, columns }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map(row => (
          <Card key={row.id}>
            <CardContent className="grid grid-cols-2 gap-2 p-4">
              {columns.map(col => (
                <div key={col.key}>
                  <dt className="text-sm text-muted-foreground">{col.label}</dt>
                  <dd className="text-base font-medium">{row[col.key]}</dd>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return <Table>{/* Desktop table */}</Table>;
}
```

**Horizontal Scroll with Shadows:**

```tsx
// For tables that must stay tabular on mobile
<div className="relative">
  <div className="overflow-x-auto">
    <Table className="min-w-[600px]" />
  </div>
  <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-background pointer-events-none" />
</div>
```

**Tasks:**
- [ ] Create responsive table component
- [ ] Implement card view for mobile
- [ ] Add horizontal scroll with visual indicators
- [ ] Test with real data on mobile devices
- [ ] Ensure all columns are accessible

#### 5.3 Touch Optimization (2 days)

**Swipe Actions:**

```tsx
// Use react-swipeable for swipe-to-delete
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => setShowActions(true),
  onSwipedRight: () => setShowActions(false),
});

<div {...handlers} className="relative">
  <div className="p-4 bg-background">
    {rowContent}
  </div>
  {showActions && (
    <div className="absolute right-0 top-0 h-full flex gap-2">
      <Button size="icon" variant="ghost"><Edit /></Button>
      <Button size="icon" variant="destructive"><Trash /></Button>
    </div>
  )}
</div>
```

**Pull to Refresh:**

```tsx
// For data lists
import PullToRefresh from 'react-simple-pull-to-refresh';

<PullToRefresh onRefresh={handleRefresh}>
  <div>{content}</div>
</PullToRefresh>
```

**Tasks:**
- [ ] Implement swipe actions for table rows
- [ ] Add pull-to-refresh on data lists
- [ ] Ensure all tap targets are 48px minimum
- [ ] Test tap response time (should be instant)
- [ ] Add haptic feedback (vibration) for actions

#### 5.4 Mobile Forms (2 days)

**Optimized Input Types:**

```tsx
// Use correct input types for mobile keyboards
<Input type="tel" inputMode="numeric" pattern="[0-9]*" /> // Number pad
<Input type="email" inputMode="email" /> // Email keyboard
<Input type="url" inputMode="url" /> // URL keyboard
<Input type="text" inputMode="decimal" /> // Decimal keyboard
```

**Floating Labels:**

```tsx
// Better for mobile (saves space)
<div className="relative">
  <Input
    id="email"
    placeholder=" "
    className="peer"
  />
  <Label
    htmlFor="email"
    className="absolute left-3 top-3 transition-all peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs"
  >
    Email
  </Label>
</div>
```

**Tasks:**
- [ ] Use correct input types for mobile keyboards
- [ ] Implement floating labels (optional)
- [ ] Ensure forms don't zoom on focus (font-size: 16px minimum)
- [ ] Add autocomplete attributes
- [ ] Test form submission on mobile

---

### 🌙 Phase 6: Dark Mode (Optional, 1 week)
**Goal:** Implement beautiful dark theme for accessibility and preference

#### 6.1 Theme Toggle (1 day)

**Implementation:**

```tsx
// components/theme-toggle.tsx
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

**Tasks:**
- [ ] Install and configure next-themes
- [ ] Add theme toggle to header
- [ ] Set up theme provider in App.tsx
- [ ] Add system preference detection
- [ ] Persist theme choice to localStorage

#### 6.2 Dark Mode Palette Refinement (2 days)

**Review existing dark mode palette in index.css:**

```css
.dark {
  --background: 0 0% 5%;          /* Nearly black */
  --foreground: 0 0% 95%;         /* Off-white */
  --primary: 142 60% 45%;         /* Lighter green */
  --muted: 0 0% 15%;              /* Dark gray */
  --border: 0 0% 20%;             /* Lighter border */
  /* ... audit and refine all colors */
}
```

**Contrast Audit:**
- Ensure all text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Test all semantic colors (success, error, warning)
- Verify chart colors are distinct in dark mode

**Tasks:**
- [ ] Audit and refine dark mode color palette
- [ ] Test contrast ratios for all text
- [ ] Adjust chart colors for dark mode
- [ ] Refine shadow values for dark mode
- [ ] Test all components in dark mode

#### 6.3 Dark Mode Testing (2 days)

**Test Coverage:**
- Dashboard
- Financial page
- Livestock page
- Pastures page
- Forms and modals
- Charts and data visualizations
- All component states (hover, focus, active, disabled)

**Tasks:**
- [ ] Systematically test all pages in dark mode
- [ ] Fix any contrast or visibility issues
- [ ] Ensure transitions between themes are smooth
- [ ] Test with actual users
- [ ] Document any dark mode-specific quirks

---

## Implementation Strategy

### Sprint Breakdown (8-10 weeks)

| Sprint | Phase | Focus | Duration |
|--------|-------|-------|----------|
| 1 | Phase 1 | Visual Foundation | 2 weeks |
| 2 | Phase 2 | Component Enhancement | 2 weeks |
| 3 | Phase 3 | Data Visualization | 2 weeks |
| 4 | Phase 4 | Animations & Micro-interactions | 1 week |
| 5 | Phase 5 | Mobile & Responsive | 1.5 weeks |
| 6 | Phase 6 | Dark Mode (optional) | 1 week |
| Polish | All | Bug fixes, refinement, testing | 0.5 weeks |

### Prioritization (MoSCoW)

**MUST HAVE (Minimum for launch):**
- Phase 1: Visual Foundation (typography, colors, depth, spacing)
- Phase 2: Component Enhancement (empty/loading/error states)
- Phase 3: Financial Data Visualization (cash flow, expenses)
- Phase 4: Basic animations (transitions, hover states)

**SHOULD HAVE (Significant value):**
- Phase 3: Livestock/Pasture Data Visualization
- Phase 4: Success animations, feedback
- Phase 5: Mobile navigation and responsive tables

**COULD HAVE (Nice to have):**
- Phase 4: Confetti, advanced animations
- Phase 5: Swipe gestures, pull-to-refresh
- Phase 6: Dark mode

**WON'T HAVE (Future iterations):**
- Custom illustrations (use library initially)
- Advanced data visualizations (map views)
- 3D animations or complex motion graphics

---

## Design System Documentation

### Creating a Living Style Guide

**Tool:** Storybook (recommended) or simple docs page

**Structure:**
```
/storybook
├── foundations/
│   ├── colors.stories.tsx
│   ├── typography.stories.tsx
│   ├── spacing.stories.tsx
│   └── shadows.stories.tsx
├── components/
│   ├── button.stories.tsx
│   ├── card.stories.tsx
│   ├── input.stories.tsx
│   └── ... (all components)
└── patterns/
    ├── empty-states.stories.tsx
    ├── loading-states.stories.tsx
    └── error-states.stories.tsx
```

**Tasks:**
- [ ] Set up Storybook
- [ ] Document all design tokens
- [ ] Create stories for all components
- [ ] Add usage guidelines
- [ ] Deploy to public URL for team reference

---

## Success Metrics

### Quantitative

**Performance:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Performance Score > 90

**Engagement:**
- Time to first action < 2 minutes (new users)
- Activation rate increase by 30%+
- Task completion rate > 90%

**Accessibility:**
- WCAG AA compliance: 100%
- Lighthouse Accessibility Score > 95
- Keyboard navigation: 100% of features

### Qualitative

**User Feedback:**
- "It looks professional and trustworthy"
- "Easy to use, even for first-time users"
- "I understand my farm data better now"
- "The interface is clean and beautiful"

**Visual Quality:**
- Passes S-tier design checklist
- Comparable to Stripe, Linear, Airbnb dashboards
- Strong agricultural brand identity
- Consistent across all pages

---

## Risk Mitigation

### Risk 1: Too Much Visual Polish Slows Performance
**Mitigation:**
- Use CSS animations over JS where possible
- Lazy load charts and heavy components
- Monitor bundle size continuously
- Use React.memo for expensive components

### Risk 2: Animations Annoy Power Users
**Mitigation:**
- Respect `prefers-reduced-motion` system setting
- Keep animations subtle and purposeful (< 300ms)
- Allow users to disable animations in settings
- Test with real users, iterate based on feedback

### Risk 3: Mobile Experience Doesn't Match Desktop
**Mitigation:**
- Design mobile-first for key flows
- Test on real devices throughout development
- Use progressive enhancement (mobile → desktop)
- Conduct user testing with producers in field

### Risk 4: Dark Mode Breaks Visual Hierarchy
**Mitigation:**
- Design with dark mode from start (not afterthought)
- Use elevation (shadows) in dark mode for depth
- Test contrast at every step
- Allow users to choose theme preference

### Risk 5: Scope Creep (Trying to Do Too Much)
**Mitigation:**
- Strict adherence to MoSCoW prioritization
- Focus on MUST HAVE features first
- Regular check-ins with stakeholders
- MVP mindset: ship, learn, iterate

---

## Next Steps (Immediate Actions)

1. **Week 1 Planning:**
   - [ ] Review and approve this roadmap
   - [ ] Choose primary font (Inter recommended)
   - [ ] Decide on illustration library (Undraw, custom, or defer)
   - [ ] Set up Storybook (optional but recommended)
   - [ ] Create Figma/design mockups for key pages (optional)

2. **Week 1 Execution:**
   - [ ] Install Inter font
   - [ ] Update Tailwind config with typography scale
   - [ ] Expand color palette in CSS variables
   - [ ] Implement new shadow system
   - [ ] Begin spacing audit

3. **Stakeholder Alignment:**
   - [ ] Present roadmap to team
   - [ ] Gather feedback on priorities
   - [ ] Adjust timeline if needed
   - [ ] Assign resources and responsibilities

4. **User Research:**
   - [ ] Identify 3-5 target users for testing
   - [ ] Schedule weekly check-ins for feedback
   - [ ] Set up analytics to track engagement metrics
   - [ ] Create feedback loop for continuous improvement

---

## Appendix

### Tools & Libraries

**Core:**
- React 18 + TypeScript
- Tailwind CSS 3.4+
- shadcn/ui components
- Vite build tool

**Data Visualization:**
- Recharts (already installed)
- Alternative: Chart.js, Victory

**Animations:**
- Framer Motion (recommended)
- react-spring (alternative)
- CSS transitions (for simple cases)

**Mobile:**
- react-swipeable (swipe gestures)
- react-simple-pull-to-refresh (pull to refresh)
- react-use (hooks for media queries, etc.)

**Theming:**
- next-themes (dark mode)

**Optional:**
- Storybook (component documentation)
- react-confetti (celebrations)
- react-countup (animated numbers)
- react-icons (additional icons)

### Design Resources

**Fonts:**
- [Inter](https://fonts.google.com/specimen/Inter) - Primary recommendation
- [Manrope](https://fonts.google.com/specimen/Manrope) - Alternative
- [Satoshi](https://www.fontshare.com/fonts/satoshi) - Display font

**Icons:**
- [Lucide](https://lucide.dev/) (currently used, excellent)
- [Heroicons](https://heroicons.com/)
- [Phosphor Icons](https://phosphoricons.com/)

**Illustrations:**
- [Undraw](https://undraw.co/) - Free, customizable, SVG
- [Humaaans](https://www.humaaans.com/) - Mix-and-match illustrations
- [Storyset](https://storyset.com/) - Animated illustrations
- Custom: Hire illustrator for unique agricultural assets

**Color Palette Tools:**
- [Realtime Colors](https://realtimecolors.com/) - Preview palette live
- [Coolors](https://coolors.co/) - Generate palettes
- [Adobe Color](https://color.adobe.com/) - Palette exploration

**Inspiration:**
- [Dribbble](https://dribbble.com/tags/dashboard) - Dashboard designs
- [Mobbin](https://mobbin.com/) - Mobile app patterns
- [SaaS Landing Page](https://saaslandingpage.com/) - Product aesthetics

---

**Document Version:** 1.0
**Last Updated:** December 2025
**Status:** Ready for Implementation
**Next Review:** After Sprint 1 (2 weeks)
