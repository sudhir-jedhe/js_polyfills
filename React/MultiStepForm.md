import "./DynamicMultiStepForm.css";
import React, { useState } from "react";
import React, { useState } from "react";
import React, { useState } from "react";

// Step components
const Step1 = ({ formData, handleChange }) => (
    <div>
        <h3>Step 1: Personal Information</h3>
        <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name || ''}
            onChange={handleChange}
        />
    </div>
);

const Step2 = ({ formData, handleChange }) => (
    <div>
        <h3>Step 2: Contact Information</h3>
        <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={handleChange}
        />
    </div>
);

const Step3 = ({ formData, handleChange }) => (
    <div>
        <h3>Step 3: Address</h3>
        <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address || ''}
            onChange={handleChange}
        />
    </div>
);

const steps = [
    { id: 1, component: Step1 },
    { id: 2, component: Step2 },
    { id: 3, component: Step3 },
];

function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div>
            <h2>Multi-Step Form</h2>
            <CurrentStepComponent formData={formData} handleChange={handleChange} />
            <div>
                <button onClick={handlePrevious} disabled={currentStep === 0}>
                    Previous
                </button>
                <button onClick={handleNext} disabled={currentStep === steps.length - 1}>
                    Next
                </button>
            </div>
            <div>
                <h3>Timeline</h3>
                <ul>
                    {steps.map((step, index) => (
                        <li key={step.id} style={{ fontWeight: index === currentStep ? 'bold' : 'normal' }}>
                            Step {step.id}: {index <= currentStep ? 'Completed' : 'Pending'}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// Do not edit below this line
export default MultiStepForm;


/********************************************** */


function Step({ stepData, handleChange, index }) {
    return (
        <div>
            <h3>Step {index + 1}</h3>
            <input
                type="text"
                name={`step-${index}`}
                placeholder={`Step ${index + 1} Data`}
                value={stepData || ''}
                onChange={handleChange}
            />
        </div>
    );
}

function DynamicMultiStepForm() {
    const [steps, setSteps] = useState([{ id: Date.now(), data: '' }]);
    const [currentStep, setCurrentStep] = useState(0);

    const handleChange = (event) => {
        const updatedSteps = steps.map((step, index) => {
            if (index === currentStep) {
                return { ...step, data: event.target.value };
            }
            return step;
        });
        setSteps(updatedSteps);
    };

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleAddStep = () => {
        setSteps([...steps, { id: Date.now(), data: '' }]);
    };

    const handleRemoveStep = () => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, index) => index !== currentStep));
            setCurrentStep((prev) => Math.max(prev - 1, 0));
        }
    };

    return (
        <div>
            <h2>Dynamic Multi-Step Form</h2>
            {steps.map((step, index) => (
                index === currentStep && (
                    <Step
                        key={step.id}
                        stepData={step.data}
                        handleChange={handleChange}
                        index={index}
                    />
                )
            ))}
            <div>
                <button onClick={handlePrevious} disabled={currentStep === 0}>
                    Previous
                </button>
                <button onClick={handleNext} disabled={currentStep === steps.length - 1}>
                    Next
                </button>
                <button onClick={handleAddStep}>
                    Add Step
                </button>
                <button onClick={handleRemoveStep} disabled={steps.length === 1}>
                    Remove Step
                </button>
            </div>
            <div>
                <h3>Steps Timeline</h3>
                <ul>
                    {steps.map((_, index) => (
                        <li key={index} style={{ fontWeight: index === currentStep ? 'bold' : 'normal' }}>
                            Step {index + 1}: {index <= currentStep ? 'Completed' : 'Pending'}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// Do not edit below this line
export default DynamicMultiStepForm;


/**************************** */

function Step({ stepData, handleChange, index, error }) {
    return (
        <div className="step">
            <h3>Step {index + 1}</h3>
            <input
                type="text"
                name={`step-${index}`}
                placeholder={`Step ${index + 1} Data`}
                value={stepData || ''}
                onChange={handleChange}
                className={error ? 'input-error' : ''}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

function DynamicMultiStepForm() {
    const [steps, setSteps] = useState([{ id: Date.now(), data: '' }]);
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState([]);

    const validateStep = (index) => {
        if (!steps[index].data) {
            setErrors((prev) => {
                const newErrors = [...prev];
                newErrors[index] = 'This field is required.';
                return newErrors;
            });
            return false;
        }
        return true;
    };

    const handleChange = (event) => {
        const updatedSteps = steps.map((step, index) => {
            if (index === currentStep) {
                return { ...step, data: event.target.value };
            }
            return step;
        });
        setSteps(updatedSteps);
        setErrors((prev) => {
            const newErrors = [...prev];
            newErrors[currentStep] = ''; // Clear error for this step
            return newErrors;
        });
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleAddStep = () => {
        setSteps([...steps, { id: Date.now(), data: '' }]);
        setErrors([...errors, '']); // Add a corresponding error state
    };

    const handleRemoveStep = () => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, index) => index !== currentStep));
            setErrors(errors.filter((_, index) => index !== currentStep));
            setCurrentStep((prev) => Math.max(prev - 1, 0));
        }
    };

    return (
        <div className="form-container">
            <h2>Dynamic Multi-Step Form</h2>
            {steps.map((step, index) => (
                index === currentStep && (
                    <Step
                        key={step.id}
                        stepData={step.data}
                        handleChange={handleChange}
                        index={index}
                        error={errors[index]}
                    />
                )
            ))}
            <div className="button-group">
                <button onClick={handlePrevious} disabled={currentStep === 0}>
                    Previous
                </button>
                <button onClick={handleNext} disabled={currentStep === steps.length - 1}>
                    Next
                </button>
                <button onClick={handleAddStep}>
                    Add Step
                </button>
                <button onClick={handleRemoveStep} disabled={steps.length === 1}>
                    Remove Step
                </button>
            </div>
    


            .form-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.step {
    margin-bottom: 20px;
}

input {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.input-error {
    border-color: red;
}

.error-message {
    color: red;
    font-size: 0.875em;
}

.button-group {
    margin-top: 20px;
}

button {
    padding: 10px 15px;
    margin-right: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

h3 {
    margin-top: 20px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin: 5px 0;
}
