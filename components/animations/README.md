# Karoot! Animation System

This directory contains the comprehensive animation system for the Karoot! quiz application, built with Framer Motion and optimized for Next.js performance.

## 🎬 Animation Libraries

### Framer Motion
- **Purpose:** Page transitions, UI interactions, and complex animations
- **Performance:** Hardware-accelerated animations with 60fps target
- **Features:** Gesture support, layout animations, SVG path animations

### Lottie React
- **Purpose:** Complex character animations and micro-interactions
- **Performance:** Vector-based animations with small file sizes
- **Features:** After Effects integration, interactive controls

## 📁 File Structure

```
components/animations/
├── motion-components.tsx    # Reusable motion components
├── animation-hooks.ts       # Custom animation hooks
├── transition-components.tsx # Page/state transition components
├── index.ts                # Centralized exports
└── README.md               # This documentation
```

## 🎯 Motion Components (`motion-components.tsx`)

### Basic Animation Variants

Pre-defined animation variants for common use cases:

```tsx
// Available variants
fadeInVariants
slideUpVariants
slideDownVariants
slideLeftVariants
slideRightVariants
bounceVariants
popVariants
wiggleVariants
scaleVariants
staggerContainerVariants
staggerItemVariants
hoverScaleVariants
hoverBounceVariants
```

### Reusable Motion Components

#### Entrance Animations
```tsx
import { FadeIn, SlideUp, Bounce, Pop } from '@/components/animations';

<FadeIn delay={0.2}>
  <div>Content fades in</div>
</FadeIn>

<SlideUp delay={0.4}>
  <div>Content slides up</div>
</SlideUp>

<Bounce>
  <div>Content bounces in</div>
</Bounce>

<Pop delay={0.1}>
  <div>Content pops in</div>
</Pop>
```

#### Directional Animations
```tsx
import { SlideLeft, SlideRight, SlideDown } from '@/components/animations';

<SlideLeft>
  <div>Slides from right to left</div>
</SlideLeft>

<SlideRight>
  <div>Slides from left to right</div>
</SlideRight>
```

#### Staggered Animations
```tsx
import { StaggerContainer, StaggerItem } from '@/components/animations';

<StaggerContainer>
  <StaggerItem>First item</StaggerItem>
  <StaggerItem>Second item (delayed)</StaggerItem>
  <StaggerItem>Third item (more delayed)</StaggerItem>
</StaggerContainer>
```

#### Interactive Animations
```tsx
import { HoverScale, HoverBounce } from '@/components/animations';

<HoverScale>
  <button>Scales on hover</button>
</HoverScale>

<HoverBounce>
  <div>Bounces on hover</div>
</HoverBounce>
```

## 🪝 Animation Hooks (`animation-hooks.ts`)

### View-Based Animations

#### `useAnimateOnView`
Triggers animations when elements enter the viewport:

```tsx
import { useAnimateOnView } from '@/components/animations';

function MyComponent() {
  const { ref, controls, isInView } = useAnimateOnView(0.3);
  
  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={fadeInVariants}
    >
      Content animates when 30% visible
    </motion.div>
  );
}
```

#### `useScrollAnimation`
Scroll-triggered animations with custom offset:

```tsx
import { useScrollAnimation } from '@/components/animations';

function ScrollComponent() {
  const { ref, controls } = useScrollAnimation(100);
  
  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={slideUpVariants}
    >
      Animates when scrolled into view
    </motion.div>
  );
}
```

### Sequence Animations

#### `useStaggerAnimation`
Creates staggered animation sequences:

```tsx
import { useStaggerAnimation } from '@/components/animations';

function StaggeredList() {
  const { controls, startStagger } = useStaggerAnimation(0.1);
  
  useEffect(() => {
    startStagger(5); // Animate 5 items with 0.1s delay
  }, []);
  
  return (
    <motion.div animate={controls}>
      {/* List items */}
    </motion.div>
  );
}
```

#### `useSequentialAnimation`
Chains multiple animations in sequence:

```tsx
import { useSequentialAnimation } from '@/components/animations';

function SequenceComponent() {
  const { controls, sequence } = useSequentialAnimation();
  
  const playSequence = () => {
    sequence([
      { target: { scale: 1.2 }, duration: 300 },
      { target: { rotate: 180 }, duration: 500 },
      { target: { scale: 1, rotate: 0 } }
    ]);
  };
  
  return (
    <motion.div animate={controls} onClick={playSequence}>
      Click for sequence
    </motion.div>
  );
}
```

### Interactive Animations

#### `useHoverAnimation`
Custom hover animations with timing control:

```tsx
import { useHoverAnimation } from '@/components/animations';

function HoverComponent() {
  const { controls, handleHoverStart, handleHoverEnd } = useHoverAnimation(
    { scale: 1.1, rotate: 5 },
    { scale: 1, rotate: 0 },
    0.2
  );
  
  return (
    <motion.div
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      Custom hover animation
    </motion.div>
  );
}
```

#### `useGestureAnimation`
Gesture-based animations (drag, tap):

```tsx
import { useGestureAnimation } from '@/components/animations';

function GestureComponent() {
  const { controls, handleDragEnd, handleTap } = useGestureAnimation();
  
  return (
    <motion.div
      animate={controls}
      drag="x"
      onDragEnd={handleDragEnd}
      onTap={handleTap}
    >
      Drag me or tap me!
    </motion.div>
  );
}
```

### Utility Hooks

#### `useEntranceAnimation`
Configurable entrance animations:

```tsx
import { useEntranceAnimation } from '@/components/animations';

function EntranceComponent() {
  const { controls, variants, trigger } = useEntranceAnimation('bounce', 0.5);
  
  return (
    <motion.div
      animate={controls}
      variants={variants}
      initial="hidden"
    >
      <button onClick={trigger}>Trigger Animation</button>
    </motion.div>
  );
}
```

#### `useContinuousAnimation`
For loading spinners and continuous effects:

```tsx
import { useContinuousAnimation } from '@/components/animations';

function SpinnerComponent() {
  const controls = useContinuousAnimation(
    { rotate: 360 },
    1, // 1 second duration
    Infinity // Infinite repeat
  );
  
  return (
    <motion.div animate={controls}>
      🥕 {/* Spinning carrot */}
    </motion.div>
  );
}
```

## 🔄 Transition Components (`transition-components.tsx`)

### Page Transitions

#### `PageTransition`
Smooth page-to-page transitions:

```tsx
import { PageTransition } from '@/components/animations';

function MyPage() {
  return (
    <PageTransition>
      <div>Page content with entrance animation</div>
    </PageTransition>
  );
}
```

#### `RouteTransition`
Route-level transitions with AnimatePresence:

```tsx
import { RouteTransition } from '@/components/animations';

function App() {
  return (
    <RouteTransition>
      <Routes>
        {/* Your routes */}
      </Routes>
    </RouteTransition>
  );
}
```

### UI State Transitions

#### `ModalTransition`
Animated modal with backdrop:

```tsx
import { ModalTransition } from '@/components/animations';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <ModalTransition
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div>Modal content</div>
    </ModalTransition>
  );
}
```

#### `DrawerTransition`
Slide-in drawer from left or right:

```tsx
import { DrawerTransition } from '@/components/animations';

<DrawerTransition
  isOpen={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  side="left"
>
  <nav>Navigation content</nav>
</DrawerTransition>
```

#### `AccordionTransition`
Smooth accordion expand/collapse:

```tsx
import { AccordionTransition } from '@/components/animations';

<AccordionTransition isOpen={expanded}>
  <div>Accordion content that animates height</div>
</AccordionTransition>
```

#### `FadeTransition`
Simple fade in/out with AnimatePresence:

```tsx
import { FadeTransition } from '@/components/animations';

<FadeTransition show={visible} duration={0.5}>
  <div>Content that fades in/out</div>
</FadeTransition>
```

### List Animations

#### `ListTransition`
Staggered list item animations:

```tsx
import { ListTransition } from '@/components/animations';

<ListTransition>
  <div>First item</div>
  <div>Second item</div>
  <div>Third item</div>
</ListTransition>
```

#### `SlideTransition`
Directional slide transitions:

```tsx
import { SlideTransition } from '@/components/animations';

<SlideTransition direction={1}>
  <div>Content slides in from right</div>
</SlideTransition>
```

## 🎨 Integration with Carrot System

### Animated Carrot Characters

```tsx
import { BaseCarrot } from '@/components/illustrations';
import { Bounce, HoverScale } from '@/components/animations';

<Bounce delay={0.3}>
  <HoverScale>
    <BaseCarrot 
      size={80} 
      expression="happy" 
      pose="dancing" 
    />
  </HoverScale>
</Bounce>
```

### Interactive UI Elements

```tsx
import { CarrotButton } from '@/components/illustrations';
import { Pop } from '@/components/animations';

<Pop>
  <CarrotButton 
    variant="primary"
    onClick={handleClick}
  >
    Animated Button
  </CarrotButton>
</Pop>
```

### Loading States

```tsx
import { CarrotLoader } from '@/components/illustrations';
import { FadeTransition } from '@/components/animations';

<FadeTransition show={loading}>
  <CarrotLoader size="lg" text="Loading quiz..." />
</FadeTransition>
```

## ⚡ Performance Optimization

### Best Practices

1. **Use `will-change` CSS property** for animated elements
2. **Prefer transform and opacity** for smooth animations
3. **Use `AnimatePresence`** for exit animations
4. **Implement `layoutId`** for shared element transitions
5. **Reduce motion** for accessibility preferences

### Configuration

```tsx
// Respect user's motion preferences
const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={shouldReduceMotion ? {} : animationVariants}
  transition={shouldReduceMotion ? { duration: 0 } : normalTransition}
>
  Content
</motion.div>
```

### Memory Management

```tsx
// Clean up animations on unmount
useEffect(() => {
  return () => {
    controls.stop();
  };
}, [controls]);
```

## 🎯 Animation Guidelines

### Timing
- **Fast interactions:** 0.1-0.2s (buttons, hovers)
- **UI transitions:** 0.2-0.4s (modals, drawers)
- **Page transitions:** 0.3-0.6s (route changes)
- **Decorative animations:** 0.5-1s (entrance effects)

### Easing
- **Ease-out:** For entrances and user-initiated actions
- **Ease-in:** For exits and system-initiated actions
- **Spring:** For playful, bouncy interactions
- **Linear:** For continuous animations (loading, progress)

### Accessibility
- Respect `prefers-reduced-motion`
- Provide skip options for long animations
- Ensure animations don't cause seizures
- Maintain focus management during transitions

## 🚀 Usage Examples

### Complete Game Flow Animation

```tsx
import { 
  PageTransition, 
  StaggerContainer, 
  StaggerItem,
  ModalTransition 
} from '@/components/animations';
import { 
  QuizMasterCarrot, 
  CarrotButton, 
  CarrotProgress 
} from '@/components/illustrations';

function QuizPage() {
  return (
    <PageTransition>
      <div className="quiz-container">
        <StaggerContainer>
          <StaggerItem>
            <QuizMasterCarrot size={80} withGlasses />
          </StaggerItem>
          
          <StaggerItem>
            <h1>Welcome to the Quiz!</h1>
          </StaggerItem>
          
          <StaggerItem>
            <CarrotProgress value={progress} animated />
          </StaggerItem>
          
          <StaggerItem>
            <CarrotButton variant="primary">
              Start Quiz
            </CarrotButton>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
```

This animation system provides a comprehensive foundation for creating engaging, performant animations throughout the Karoot! application while maintaining consistency with the carrot theme.