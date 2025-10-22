# 🩸 PRD: AI Agent Jules — Menstrual Cycle Visualization Extension for Google Calendar

---

## 🎯 Goal

Jules helps users visualize their menstrual cycle directly in Google Calendar by **coloring the background of each day** (not the entire calendar) based on the day of the cycle. The goal is to create a calm, aesthetic, and meaningful visualization that helps track natural rhythms intuitively.

---

## 🌈 Core Concept

Each day of the month is assigned a unique color following a smooth **gradient** that represents the phases of the menstrual cycle. The gradient restarts at the beginning of a new cycle.

This creates a dynamic background across the calendar — each day carries its own tone — transitioning gently from one hue to another.

**Gradient sequence:**

> Burgundy → Pink → Cream → Coral → Gold → Ochre → Lilac → Indigo → back to Burgundy

---

## ⚙️ Core Functionality

### 1. Gradient-based coloring

* Jules updates **each day cell** in Google Calendar with a background color determined by its position in the user’s cycle.
* Works across all calendar views: **Day**, **Week**, **Month**, and **Year**.
* Text color adjusts automatically for readability (light text on dark backgrounds, dark on light ones).

### 2. Cycle parameters

User inputs three simple data points through the agent or settings panel:

* `startDate`: the start date of the last menstruation
* `cycleLength`: the length of the cycle in days (default: 28)
* `periodLength`: number of menstruation days (default: 5)

### 3. Daily calculation logic

For any given date:

```
currentCycleDay = (today - startDate) mod cycleLength
```

* The extension maps this day to its corresponding color in the gradient.
* Jules applies this color to the background of that specific day cell in Google Calendar.

### 4. Local memory

All parameters are stored locally (Local Storage). Jules remembers user settings and re-applies them on page reload or next browser session.

---

## 🧠 Agent Behavior (Jules)

### Interaction

* Jules asks for setup if no cycle data is stored:
  “Hey, could you tell me when your last cycle started and how long it usually lasts?”
* Jules can adjust settings conversationally:
  “Would you like me to shift your cycle start date?” or “Want to change your color palette?”
* Provides context-aware updates:
  “We’re entering the golden phase — creative energy rising!” (optional feature)

### Background operation

* Jules observes DOM changes in Google Calendar via `MutationObserver`.
* Injects CSS rules dynamically for each date cell.
* Recalculates and recolors when the user switches views or navigates to another month.

---

## 🧩 Technical Details

**Type:** Chrome Extension (Manifest V3)
**Tech Stack:** JavaScript (ES6+), CSS Injection, Local Storage, Date API, MutationObserver
**Focus:** Performance, visual harmony, non-intrusive design

---

## 🖥️ Non-functional Requirements

* Works only in **desktop Chrome**.
* Background transparency: 20–40% (so events remain visible).
* Lightweight: must not impact scroll or navigation performance.
* Clean, minimalist interface.

---

## 🚀 Future Enhancements

* Custom color themes and gradient selection.
* Integration with health apps via API.
* Mood/energy phase labeling within the calendar.
* Optional emoji or icon per phase.

---

## 🧭 Summary

Jules transforms Google Calendar into a subtle, living visualization of personal cycles.
It doesn’t paint the whole canvas — it colors each day’s story.
