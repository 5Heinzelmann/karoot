'use client';

import React, { useState } from 'react';
import { 
  BaseCarrot,
  QuizMasterCarrot,
  StudentCarrot,
  WinnerCarrot,
  ThinkingCarrot,
  CarrotButton,
  CarrotLoader,
  CarrotSpinner,
  CarrotProgress,
  CarrotProgressCircular,
  CarrotDecorations,
  CarrotPattern,
  CarrotBadge
} from '@/components/illustrations';

import {
  FadeIn,
  SlideUp,
  Bounce,
  Pop,
  StaggerContainer,
  StaggerItem,
  HoverScale,
  ModalTransition,
  AccordionTransition
} from '@/components/animations';

export default function CarrotDemoPage() {
  const [progress, setProgress] = useState(65);
  const [showModal, setShowModal] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <FadeIn className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🥕 Karoot! Design System Demo
          </h1>
          <p className="text-lg text-gray-600">
            Phase 2: Animation Libraries & Carrot Illustration System
          </p>
        </FadeIn>

        {/* Carrot Characters Section */}
        <SlideUp delay={0.2}>
          <section className="bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <CarrotPattern density="low" className="opacity-5" />
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Carrot Characters</h2>
            
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <StaggerItem className="text-center">
                <BaseCarrot size={80} expression="happy" pose="standing" />
                <p className="mt-2 text-sm font-medium">Happy Base</p>
              </StaggerItem>
              
              <StaggerItem className="text-center">
                <QuizMasterCarrot size={80} withGlasses />
                <p className="mt-2 text-sm font-medium">Quiz Master</p>
              </StaggerItem>
              
              <StaggerItem className="text-center">
                <StudentCarrot size={80} withBackpack />
                <p className="mt-2 text-sm font-medium">Student</p>
              </StaggerItem>
              
              <StaggerItem className="text-center">
                <WinnerCarrot size={80} withTrophy />
                <p className="mt-2 text-sm font-medium">Winner</p>
              </StaggerItem>
              
              <StaggerItem className="text-center">
                <ThinkingCarrot size={80} withLightbulb />
                <p className="mt-2 text-sm font-medium">Thinking</p>
              </StaggerItem>
            </StaggerContainer>

            {/* Expression Variations */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Expression Variations</h3>
              <div className="flex flex-wrap gap-6 justify-center">
                {['happy', 'neutral', 'sad', 'excited', 'thinking'].map((expression) => (
                  <div key={expression} className="text-center">
                    <BaseCarrot 
                      size={60} 
                      expression={expression as any} 
                      pose="standing" 
                    />
                    <p className="mt-1 text-xs capitalize">{expression}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pose Variations */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Pose Variations</h3>
              <div className="flex flex-wrap gap-6 justify-center">
                {['standing', 'jumping', 'dancing', 'sleeping'].map((pose) => (
                  <div key={pose} className="text-center">
                    <BaseCarrot 
                      size={60} 
                      expression="happy" 
                      pose={pose as any} 
                    />
                    <p className="mt-1 text-xs capitalize">{pose}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SlideUp>

        {/* UI Elements Section */}
        <Bounce delay={0.4}>
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Carrot UI Elements</h2>
            
            <div className="space-y-8">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Carrot Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <HoverScale>
                    <CarrotButton variant="primary" size="sm">
                      Small Button
                    </CarrotButton>
                  </HoverScale>
                  <HoverScale>
                    <CarrotButton variant="primary" size="md">
                      Medium Button
                    </CarrotButton>
                  </HoverScale>
                  <HoverScale>
                    <CarrotButton variant="secondary" size="lg">
                      Large Secondary
                    </CarrotButton>
                  </HoverScale>
                  <HoverScale>
                    <CarrotButton 
                      variant="outline" 
                      size="md"
                      onClick={() => setShowModal(true)}
                    >
                      Open Modal
                    </CarrotButton>
                  </HoverScale>
                </div>
              </div>

              {/* Progress Indicators */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Progress Indicators</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Linear Progress: {progress}%
                    </label>
                    <CarrotProgress value={progress} showPercentage animated />
                    <div className="mt-2 flex gap-2">
                      <button 
                        onClick={() => setProgress(Math.max(0, progress - 10))}
                        className="px-3 py-1 bg-gray-200 rounded text-sm"
                      >
                        -10%
                      </button>
                      <button 
                        onClick={() => setProgress(Math.min(100, progress + 10))}
                        className="px-3 py-1 bg-gray-200 rounded text-sm"
                      >
                        +10%
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-8 items-center">
                    <div>
                      <p className="text-sm font-medium mb-2">Circular Progress</p>
                      <CarrotProgressCircular value={progress} size="md" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Large Circular</p>
                      <CarrotProgressCircular value={progress} size="lg" showPercentage={false} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Loaders */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Loaders & Spinners</h3>
                <div className="flex gap-8 items-center">
                  <CarrotLoader size="sm" text="Loading..." />
                  <CarrotLoader size="md" text="Processing..." />
                  <div className="flex items-center gap-2">
                    <CarrotSpinner size="sm" />
                    <span className="text-sm">Inline spinner</span>
                  </div>
                </div>
              </div>

              {/* Decorations */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Decorative Elements</h3>
                <div className="space-y-4">
                  <div className="flex gap-8 items-center">
                    <CarrotDecorations variant="leaves" size="md" animated />
                    <CarrotDecorations variant="border" size="sm" animated />
                    <CarrotDecorations variant="corner" size="lg" />
                  </div>
                  
                  <CarrotDecorations variant="divider" size="md" animated />
                  
                  <div className="flex gap-2">
                    <CarrotBadge variant="orange" size="sm">New</CarrotBadge>
                    <CarrotBadge variant="green" size="md">Success</CarrotBadge>
                    <CarrotBadge variant="brown" size="lg">Premium</CarrotBadge>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Bounce>

        {/* Animation Showcase */}
        <Pop delay={0.6}>
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Animation Showcase</h2>
            
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setAccordionOpen(!accordionOpen)}
                  className="w-full text-left p-4 bg-orange-100 rounded-lg font-medium hover:bg-orange-200 transition-colors"
                >
                  Click to toggle accordion animation
                </button>
                <AccordionTransition isOpen={accordionOpen}>
                  <div className="p-4 bg-gray-50 rounded-b-lg">
                    <p className="text-gray-700">
                      This content animates smoothly when the accordion opens and closes.
                      The animation includes both height and opacity transitions for a polished effect.
                    </p>
                    <div className="mt-4 flex gap-4">
                      <BaseCarrot size={40} expression="happy" />
                      <BaseCarrot size={40} expression="excited" />
                      <BaseCarrot size={40} expression="thinking" />
                    </div>
                  </div>
                </AccordionTransition>
              </div>
            </div>
          </section>
        </Pop>

        {/* Modal Example */}
        <ModalTransition
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          className="p-6"
        >
          <div className="text-center">
            <WinnerCarrot size={80} withTrophy withCrown />
            <h3 className="text-xl font-bold mt-4 mb-2">Congratulations!</h3>
            <p className="text-gray-600 mb-4">
              You've successfully opened the carrot modal with smooth animations!
            </p>
            <CarrotButton 
              variant="primary" 
              size="md"
              onClick={() => setShowModal(false)}
            >
              Close Modal
            </CarrotButton>
          </div>
        </ModalTransition>
      </div>
    </div>
  );
}