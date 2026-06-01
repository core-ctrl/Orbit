<div align="center">
  <img src="https://raw.githubusercontent.com/core-ctrl/Orbit/main/public/logo.png" alt="Orbit Logo" width="120" />
  <h1>Orbit Observability Platform</h1>
  
  <p>
    <b>The next-generation, self-hosted observability and incident management platform.</b>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/version-0.1.0-blue.svg" alt="Version" />
    <img src="https://img.shields.io/badge/next.js-15.5-black.svg?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/FastAPI-Backend-009688.svg?logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status" />
  </p>
</div>

---

## 🧠 What is This?

**Orbit** is an enterprise-grade, founder-level observability dashboard designed to monitor, manage, and diagnose the health of your entire tech stack in real-time. 

Built to compete with industry giants, Orbit gives you absolute control over your telemetry, analytics, and incident management—without the vendor lock-in. It consists of a stunning Next.js frontend (this repository), powered by high-performance FastAPI and Python ingestion engines.

## ✨ Features & Tech Stack

We utilize a wide array of modern technologies to deliver a seamless, zero-latency observability experience:

| Feature | Tech Used | Details |
| :--- | :--- | :--- |
| **Real-time Incident Tracking** | WebSockets, Socket.IO | Live-feed of application crashes, stack traces, and anomalies as they happen. |
| **Bidirectional SDK Control** | FastAPI, Redis Pub/Sub | Actively communicate with your app SDKs to push config updates (like sampling rates) without redeploying code. |
| **High-Volume Ingestion** | Python, PostgreSQL | Dedicated Observability pipeline to process massive volumes of logs, traces, and source maps. |
| **Premium Dashboard UI** | Next.js 15, Tailwind CSS | Sleek glassmorphism aesthetic, responsive design, and smooth micro-animations. |
| **Performance Metrics** | React Recharts | Interactive charts representing CPU, Memory, Disk, and Network usage. |
| **Centralized Management** | Next.js API Routes | Manage your teams, set up alerting rules, and remotely control your environments. |
| **Production Ready** | Docker, Docker Compose | Fully containerized architecture for simple deployments. |

## 🚀 Quick Start

### 🖥️ Local Development (Frontend)
Orbit is designed to be lightweight and zero-config out of the box.

```bash
# Clone the repository
git clone https://github.com/core-ctrl/Orbit.git

# Navigate to the frontend directory
cd Orbit

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 🐳 Docker Deployment (Recommended)
Orbit is fully containerized. You can run the frontend connected to your backend instantly:

```bash
docker build -t orbit-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-backend:8000/api/v1 orbit-frontend
```
*(To run the entire stack including the backend, refer to the `docker-compose.yml` in the root directory).*

## 🔒 Ecosystem & Architecture

Orbit is composed of four core pillars working in unison. 

> [!IMPORTANT]  
> **Note:** The following backend repositories are currently maintained as private, internal infrastructure to protect proprietary backend logic and configurations.

- 🧠 **Orbit Backend** - The high-performance FastAPI server handling the control plane, auth, and rate-limiting.
- 🔌 **Orbit SDKs** - Client libraries for Next.js, Node, Python, and Browser that hook into application lifecycles.
- 🔭 **Orbit Observability** - The heavy-duty processing pipeline for raw logs and traces.
- 💻 **Orbit Frontend** - This repository! The glassmorphism Next.js dashboard.

## 🤝 Rules and Regulations

We welcome feedback, issue reports, and community interactions! Please adhere to our guidelines:

1. **Security Disclosures:** If you discover a security vulnerability, please do not open a public issue. Email us privately first.
2. **Acceptable Use:** The Orbit platform is intended to be self-hosted for authorized application monitoring. Do not use our SDKs for malicious tracking or unauthorized data harvesting.
3. **Respectful Communication:** Please follow our Code of Conduct. We maintain a zero-tolerance policy for harassment or toxic behavior.

## 📄 License

This project is open-sourced software licensed under the **MIT License**. See the LICENSE file for more information.

Copyright (c) 2026 Core-Ctrl

*Disclaimer: Orbit provides a platform for infrastructure monitoring. Ensure you comply with all local privacy laws (like GDPR/CCPA) when collecting user telemetry data.*
