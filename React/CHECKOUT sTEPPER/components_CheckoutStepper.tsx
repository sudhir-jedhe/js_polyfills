"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface Step {
  name: string
  Component: React.ComponentType
}

interface CheckoutStepperProps {
  stepsConfig: Step[]
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ stepsConfig = [] }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [margins, setMargins] = useState({
    marginLeft: 0,
    marginRight: 0,
  })
  const stepRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (stepRef.current[0] && stepRef.current[stepsConfig.length - 1]) {
      setMargins({
        marginLeft: stepRef.current[0].offsetWidth / 2,
        marginRight: stepRef.current[stepsConfig.length - 1].offsetWidth / 2,
      })
    }
  }, [stepsConfig.length])

  if (!stepsConfig.length) {
    return null
  }

  const handleNext = () => {
    setCurrentStep((prevStep) => {
      if (prevStep === stepsConfig.length) {
        setIsComplete(true)
        return prevStep
      } else {
        return prevStep + 1
      }
    })
  }

  const calculateProgressBarWidth = () => {
    return ((currentStep - 1) / (stepsConfig.length - 1)) * 100
  }

  const ActiveComponent = stepsConfig[currentStep - 1]?.Component

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="flex justify-between">
          {stepsConfig.map((step, index) => (
            <div
              key={step.name}
              ref={(el) => (stepRef.current[index] = el)}
              className={`flex flex-col items-center ${
                currentStep > index + 1 || isComplete
                  ? "text-primary"
                  : currentStep === index + 1
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                ${
                  currentStep > index + 1 || isComplete
                    ? "bg-primary text-primary-foreground"
                    : currentStep === index + 1
                      ? "border-primary"
                      : "border-muted-foreground"
                }`}
              >
                {currentStep > index + 1 || isComplete ? <span>&#10003;</span> : index + 1}
              </div>
              <div className="mt-2 text-sm font-medium">{step.name}</div>
            </div>
          ))}
        </div>
        <div
          className="absolute top-5 left-0 h-[2px] bg-muted-foreground"
          style={{
            width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
            marginLeft: margins.marginLeft,
            marginRight: margins.marginRight,
          }}
        >
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${calculateProgressBarWidth()}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-8">{ActiveComponent && <ActiveComponent />}</div>

      {!isComplete && (
        <Button onClick={handleNext} className="mt-4">
          {currentStep === stepsConfig.length ? "Finish" : "Next"}
        </Button>
      )}
    </div>
  )
}

export default CheckoutStepper

