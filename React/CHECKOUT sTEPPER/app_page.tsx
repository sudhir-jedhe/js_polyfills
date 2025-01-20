"use client"

import React from "react"
import CheckoutStepper from "@/components/CheckoutStepper"

const Step1 = () => <div>Step 1: Select Product</div>
const Step2 = () => <div>Step 2: Enter Shipping Details</div>
const Step3 = () => <div>Step 3: Payment</div>
const Step4 = () => <div>Step 4: Confirmation</div>

const stepsConfig = [
  { name: "Product", Component: Step1 },
  { name: "Shipping", Component: Step2 },
  { name: "Payment", Component: Step3 },
  { name: "Confirm", Component: Step4 },
]

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout Process</h1>
      <CheckoutStepper stepsConfig={stepsConfig} />
    </main>
  )
}

