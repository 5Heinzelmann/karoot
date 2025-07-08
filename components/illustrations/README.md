# Karoot! Carrot Illustration System

This directory contains the comprehensive carrot-themed illustration system for the Karoot! quiz application. The system includes character variations, UI elements, and animation components.

## 🥕 Carrot Characters

### Base Carrot (`base-carrot.tsx`)
The foundation component for all carrot characters with customizable expressions and poses.

**Props:**
- `size?: number` - Size in pixels (default: 64)
- `expression?: 'happy' | 'neutral' | 'sad' | 'excited' | 'thinking'` - Facial expression
- `pose?: 'standing' | 'jumping' | 'dancing' | 'sleeping'` - Body pose
- `className?: string` - Additional CSS classes
- `color?: string` - Carrot body color (default: theme orange)
- `leafColor?: string` - Leaf color (default: theme green)

**Usage:**
```tsx
<BaseCarrot 
  size={80} 
  expression="happy" 
  pose="jumping" 
  className="my-carrot"
/>
```

### Specialized Characters

#### Quiz Master Carrot (`quiz-master-carrot.tsx`)
A scholarly carrot with glasses and optional professor hat.

**Props:**
- Extends `BaseCarrotProps` (excluding expression)
- `withGlasses?: boolean` - Show glasses (default: true)
- `withHat?: boolean` - Show professor hat (default: false)

#### Student Carrot (`student-carrot.tsx`)
An eager learning carrot with backpack and optional book.

**Props:**
- Extends `BaseCarrotProps` (excluding expression)
- `withBackpack?: boolean` - Show backpack (default: true)
- `withBook?: boolean` - Show book (default: false)

#### Winner Carrot (`winner-carrot.tsx`)
A celebrating carrot with trophy, crown, and sparkles.

**Props:**
- Extends `BaseCarrotProps` (excluding expression)
- `withTrophy?: boolean` - Show trophy (default: true)
- `withCrown?: boolean` - Show crown (default: false)

#### Thinking Carrot (`thinking-carrot.tsx`)
A contemplative carrot with thought bubble and optional lightbulb.

**Props:**
- Extends `BaseCarrotProps` (excluding expression)
- `thoughtText?: string` - Text in thought bubble (default: "?")
- `withLightbulb?: boolean` - Show lightbulb idea (default: false)

## 🎨 Carrot UI Elements

### Carrot Button (`carrot-button.tsx`)
A carrot-shaped button component with hover animations.

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline'` - Button style
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `children: React.ReactNode` - Button content
- Extends standard button HTML attributes

### Carrot Loader (`carrot-loader.tsx`)
Animated loading indicators with carrot theme.

**Components:**
- `CarrotLoader` - Full loader with carrot animation and text
- `CarrotSpinner` - Minimal spinning carrot for inline use

### Carrot Progress (`carrot-progress.tsx`)
Progress indicators with carrot-themed styling.

**Components:**
- `CarrotProgress` - Linear progress bar with carrot icon
- `CarrotProgressCircular` - Circular progress indicator

### Carrot Decorations (`carrot-decorations.tsx`)
Decorative elements for UI enhancement.

**Components:**
- `CarrotDecorations` - Various decorative patterns
- `CarrotPattern` - Background pattern overlay
- `CarrotBadge` - Carrot-themed badges

## 🎬 Animation Integration

All carrot components work seamlessly with the animation system:

```tsx
import { FadeIn, Bounce, HoverScale } from '@/components/animations';

// Animated entrance
<FadeIn>
  <BaseCarrot expression="happy" />
</FadeIn>

// Bouncy entrance with delay
<Bounce delay={0.3}>
  <QuizMasterCarrot withGlasses />
</Bounce>

// Interactive hover animation
<HoverScale>
  <CarrotButton variant="primary">
    Click me!
  </CarrotButton>
</HoverScale>
```

## 🎨 Design Principles

### Color Palette
All components use the established theme colors:
- **Primary Orange:** `#FF7A00` (carrot body)
- **Leaf Green:** `#4CAF50` (carrot leaves)
- **Accent Brown:** `#8D6E63` (accessories)

### Accessibility
- All SVG components include proper ARIA labels
- Color contrast meets WCAG guidelines
- Keyboard navigation support for interactive elements
- Screen reader friendly descriptions

### Performance
- SVG-based for scalability and small file sizes
- Optimized animations with hardware acceleration
- Lazy loading compatible
- Tree-shakeable exports

## 📁 File Structure

```
components/illustrations/
├── carrot-characters/
│   ├── base-carrot.tsx
│   ├── quiz-master-carrot.tsx
│   ├── student-carrot.tsx
│   ├── winner-carrot.tsx
│   └── thinking-carrot.tsx
├── carrot-ui-elements/
│   ├── carrot-button.tsx
│   ├── carrot-loader.tsx
│   ├── carrot-progress.tsx
│   └── carrot-decorations.tsx
├── index.ts
└── README.md
```

## 🚀 Usage Examples

### Basic Character Display
```tsx
import { BaseCarrot, QuizMasterCarrot } from '@/components/illustrations';

function CharacterShowcase() {
  return (
    <div className="flex gap-4">
      <BaseCarrot size={64} expression="happy" />
      <QuizMasterCarrot size={64} withGlasses />
    </div>
  );
}
```

### Interactive UI Elements
```tsx
import { CarrotButton, CarrotProgress } from '@/components/illustrations';

function GameInterface() {
  const [progress, setProgress] = useState(75);
  
  return (
    <div className="space-y-4">
      <CarrotProgress value={progress} animated />
      <CarrotButton 
        variant="primary" 
        onClick={() => setProgress(progress + 10)}
      >
        Next Question
      </CarrotButton>
    </div>
  );
}
```

### Animated Sequences
```tsx
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { BaseCarrot } from '@/components/illustrations';

function AnimatedCarrots() {
  const expressions = ['happy', 'excited', 'thinking'];
  
  return (
    <StaggerContainer className="flex gap-4">
      {expressions.map((expression, index) => (
        <StaggerItem key={expression}>
          <BaseCarrot 
            size={60} 
            expression={expression} 
            pose="dancing"
          />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

## 🔧 Customization

### Custom Colors
```tsx
<BaseCarrot 
  color="#FF6B35"  // Custom orange
  leafColor="#2E8B57"  // Custom green
/>
```

### Custom Animations
```tsx
import { motion } from 'framer-motion';

<motion.div
  animate={{ rotate: [0, 10, -10, 0] }}
  transition={{ repeat: Infinity, duration: 2 }}
>
  <BaseCarrot expression="happy" />
</motion.div>
```

## 📝 Contributing

When adding new carrot characters or UI elements:

1. Follow the established naming convention
2. Use the theme color palette
3. Include proper TypeScript interfaces
4. Add accessibility attributes
5. Update the index.ts exports
6. Document props and usage examples

## 🎯 Future Enhancements

- Additional character emotions and poses
- Seasonal carrot variations (winter hat, summer sunglasses)
- Interactive carrot animations (blinking, breathing)
- Carrot-themed form controls
- Advanced particle effects for celebrations