# 🩸 ImmunoLab Pro: The Field Manual

**Version:** 3.2.2 (Offline Edition)
**Mission:** Master the science of Hematology through high-fidelity simulation.

---

## 1. What is this App?

**ImmunoLab Pro** is a medically accurate, offline-first simulator for blood typing (ABO/Rh).

Unlike standard textbook diagrams, this app simulates the **physics of biology**. You don't just click an answer; you must perform the lab test, manage reaction times, and interpret the physical changes in the blood sample—all while under the pressure of a simulated Trauma Center.

### Key Features:

* **Bio-Glass Physics:** Realistic liquid dispersion and agglutination (clumping) visuals.
* **Deterministic Biology:** Guaranteed scientific accuracy (A+ blood *always* reacts correctly with Anti-A and Anti-D).
* **Trauma Mode:** A gamified "Time Attack" mode where you must save patients before they flatline.

---

## 2. The Lab Interface (Anatomy of the Sim)

The interface is divided into two primary zones:

### A. The Microscope Slide (The Wells)

This is your workspace. It contains three glass wells where reactions occur:

1. **Anti-A (Blue):** Tests for Antigen A.
2. **Anti-B (Yellow):** Tests for Antigen B.
3. **Anti-D (Clear/Green):** Tests for the Rh Factor (Positive/Negative).

### B. The Reagent Rack

These are your chemical tools.

* **Drop Mechanism:** Clicking a reagent bottle triggers a timed animation (Drop -> Mix -> React).
* **Safety Lock:** You cannot add a reagent if the well is already full or reacting.

---

## 3. How to Use: The Standard Protocol

Follow these steps to determine a patient's blood type.

### Step 1: Analyze the Reaction

Click the buttons labeled **Anti-A**, **Anti-B**, and **Anti-D** to drop reagents into the samples. Watch the wells closely.

* **⏳ Mixing Phase:** The liquid will swirl for 1.5 seconds.
* **✅ Result Phase:** The liquid will settle into one of two states:

| Visual Result | Meaning | Scientific Term |
| --- | --- | --- |
| **Grainy / Clumped** | **POSITIVE (+)** | *Agglutination* (Antibodies attacked the Antigen) |
| **Smooth / Liquid** | **NEGATIVE (-)** | *No Reaction* |

### Step 2: Interpret the Data

Use this logic to diagnose the patient:

* **Clump in Anti-A?** The patient is **Type A** (or AB).
* **Clump in Anti-B?** The patient is **Type B** (or AB).
* **Clump in Both?** The patient is **Type AB**.
* **Liquid in Both?** The patient is **Type O**.
* **Clump in Anti-D?** The blood is **Positive (+)**.

### Step 3: Submit Diagnosis

* **Sandbox Mode:** Just observe.
* **Trauma Mode:** Click the keypad (e.g., `A+`, `O-`) to confirm your diagnosis.
* **Correct:** You earn points and save the patient.
* **Incorrect:** You lose a "Life" (Patient Health drops).

---

## 4. Game Modes

### 🧪 Sandbox Mode (Training)

* **Goal:** Learn without pressure.
* **Features:**
* Manually select any patient type (e.g., force an "AB-" sample to see what it looks like).
* Reset the slide at any time.
* No timer, no score.

### 🚑 Trauma Mode (Exam)

* **Goal:** Speed and Accuracy.
* **The HUD (Heads-Up Display):**
* **❤️ Lives:** You have 3 attempts. 3 mistakes = "Patient Lost" (Game Over).
* **⏱️ Timer:** You have 60 seconds per patient. As time runs out, the timer turns red and the "Heart Rate" monitor speeds up.
* **🔥 Streak:** Get consecutive correct answers to multiply your score (Godlike Status).

---

## 5. Troubleshooting & FAQ

**Q: I dropped the reagent but nothing happened.**

* **A:** Wait for the animation! Real science takes time. The mixing phase lasts 1.5 seconds.

**Q: The result is "Ghost Clumping" (Clumping appeared then disappeared).**

* **A:** This simulation uses a strict state machine. If you hit "Reset" exactly as a result was appearing, the physics engine might have cleared the slide. Just re-test.

**Q: Can I mix Anti-A and Anti-B in the same well?**

* **A:** No. The app prevents cross-contamination. Each well is designated for one specific reagent.

**Q: Why is "Type O" not clumping with anything?**

* **A:** Type O blood lacks A and B antigens. If it is also Rh negative (O-), it has *no* antigens to react with, so all wells remain liquid. This is scientifically accurate.

---

## 6. The Science Cheat Sheet

*Keep this handy during your first Trauma Shift!*

| Blood Type | Anti-A Well | Anti-B Well | Anti-D Well |
| --- | --- | --- | --- |
| **A+** | 🔴 Clump | 💧 Liquid | 🔴 Clump |
| **A-** | 🔴 Clump | 💧 Liquid | 💧 Liquid |
| **B+** | 💧 Liquid | 🔴 Clump | 🔴 Clump |
| **B-** | 💧 Liquid | 🔴 Clump | 💧 Liquid |
| **AB+** | 🔴 Clump | 🔴 Clump | 🔴 Clump |
| **AB-** | 🔴 Clump | 🔴 Clump | 💧 Liquid |
| **O+** | 💧 Liquid | 💧 Liquid | 🔴 Clump |
| **O-** | 💧 Liquid | 💧 Liquid | 💧 Liquid |
