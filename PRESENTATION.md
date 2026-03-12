# 🚜 KRISHI-EYE: Live Demo Presentation Package

## 🎯 Pitch Structure (1 Minute)

### 1. The Problem
**"Farming today relies heavily on manual oversight."**
*   Farm owners lack real-time visibility into their tractor fleet operations.
*   Inefficiencies in tracking job progress lead to increased fuel costs and suboptimal yields.
*   When a machine fails or an agronomy question arises, getting immediate, contextual help is difficult.

### 2. The Solution
**"KRISHI-EYE is a centralized intelligence platform for modern agriculture."**
*   It brings your entire farm online—from field boundaries to real-time tractor telemetry.
*   It provides a unified dashboard to schedule autonomous or semi-autonomous jobs.
*   It integrates intelligent support and analytics to maximize fleet efficiency.

### 3. The Impact
**"Better data, lower costs, higher yields."**
*   **Predictability**: Know exactly where your machinery is and what it's doing.
*   **Efficiency**: Optimize routing and minimize overlap.
*   **Empowerment**: Direct access to agronomy and technical support right from the cab or the office.

---

## 🎬 Live Demo Script (2-3 Minutes)

> **Presenter Notes:** Follow this script exactly. Speak slowly and let the UI updates register with the audience before moving to the next click. 
> 
> **Credentials**: Phone: `+919999999999`, OTP: `123456`

### Stage 1: Seamless Onboarding (0:00 - 0:30)
**Action:** Open `http://localhost:8081/login`
**Script:** 
> "Welcome to KRISHI-EYE. Our platform is designed for accessibility. Farmers don't need complex passwords; they just need their phone number. Let's log in using our secure OTP system."
**(Action: Enter `+919999999999`, click request OTP, enter `123456`, click Login)**
> "Instantly, we are brought to the command center. Our dashboard gives a top-down view of all active jobs, total acreage, and fleet status."

### Stage 2: Fleet Management (0:30 - 1:00)
**Action:** Click **Tractors** in the sidebar.
**Script:**
> "To manage operations, we first need to know our assets. Here we see Krishna's Valley Farm's primary workhorse, the Swaraj 855."
**(Action: Click 'Register Tractor')**
> "Adding new hardware is frictionless. If we purchase a new tractor today, we can dispatch it to the field tomorrow."
**(Action: Fill out modal -> Name: "Demo Harvester", Model: "2024 V1", Serial: "SN-999". Submit.)**
> "The fleet updates in real-time. Our system is now ready to receive telemetry from this new asset."

### Stage 3: Job Scheduling (1:00 - 1:45)
**Action:** Click **Operation Jobs** in the sidebar. Click **New Job**.
**Script:**
> "With our fleet mapped out, let's schedule an operation. We select our farm, choose the North Wheat Plot, and assign our newly registered tractor to a spraying operation."
**(Action: Fill out the job modal, selecting Demo Farm, Demo Field, and the new Tractor. Set priority to 'High'. Submit.)**
> "The job is now queued. Our backend immediately provisions the required geofencing and routing parameters, sending them securely to the edge device on the tractor."

### Stage 4: Support & Escalation (1:45 - 2:15)
**Action:** Click **Help & Support** in the sidebar. Click **New Ticket**.
**Script:**
> "But what happens when things don't go according to plan? An engine alert or an unexpected crop disease?"
> "KRISHI-EYE integrates support directly into the workflow."
**(Action: Create a ticket. Category: Technical, Priority: High, Title: "Sensor Calibration Error", Description: "Need assistance resetting the GPS module.")**
> "This ticket is instantly routed to our technical team, associated with the exact farm profile, eliminating diagnostic delays."

### Stage 5: Closing (2:15 - 2:30)
**Action:** Click back to **Dashboard**.
**Script:**
> "From onboarding to fleet tracking and remote support, KRISHI-EYE closes the loop on precision agriculture. Thank you."

---

## 🛡️ Fallback & Backup Plan (If the Live Demo Fails)

To ensure the presentation succeeds regardless of internet connectivity or unexpected errors, we have captured a live recording of this exact sequence. 

**Backup Video Asset**: 
If the application hangs or throws a 500 error during the presentation, seamlessly switch to playing the pre-recorded video, narrating over it exactly as you would live.

> **Operator Note:** We have generated a webp video recording of the clean demo flow. Locate `demo_login_flow.webp` in the artifacts directory and keep it open in a background tab or video player before stepping on stage.
