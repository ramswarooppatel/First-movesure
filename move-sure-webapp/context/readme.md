# 🌟 Supabase + React Modular Project Structure

## 📁 Project Overview

This project is built using **React Supabase**, structured for **maximum modularity**, **performance**, and **clean separation of concerns**. The core goal is to ensure:


- 📦 **Reusable Components**
- 🧠 **Context-based Logic for Supabase and Auth**
- 🧼 **Minimal Logic in Main Pages**
- 📈 **Scalable Project Architecture**

---

## ✅ Development Rules to Follow

### 1. 📦 Component-Driven Development

- All UI elements (buttons, inputs, forms, cards, etc.) should be created as reusable components in the `components/` folder.
- **DO NOT** write JSX or logic-heavy code directly in page files like `Home.tsx`, `Dashboard.tsx`, etc.
- Follow the **“Divide and Conquer”** principle: keep each component small, focused, and composable.
