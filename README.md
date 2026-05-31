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
    <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status" />
  </p>
</div>

---

## 🌌 What is Orbit?

Orbit is an enterprise-grade, **founder-level** observability dashboard built to monitor, manage, and diagnose the health of your entire tech stack in real-time. Designed to compete with industry giants, Orbit gives you absolute control over your telemetry, analytics, and incident management—without the vendor lock-in.

### 🌟 Key Features

<details>
<summary><b>1. Real-time Incident Tracking</b></summary>
<br/>
Orbit tracks errors, exceptions, and anomalies as they happen. Navigate to the Incidents tab to see a live-feed of application crashes, complete with stack traces, affected users, and environments.
</details>

<details>
<summary><b>2. Performance & Health Metrics</b></summary>
<br/>
View interactive charts and graphs representing your CPU, Memory, Disk, and Network usage. Orbit collects telemetry continuously via our background collectors.
</details>

<details>
<summary><b>3. Bidirectional SDK Control</b></summary>
<br/>
Unlike standard analytics platforms, Orbit actively communicates with your application SDKs. Orbit's backend can dynamically push configuration updates, rate-limit ingestion, and trigger actions in your connected clients in real-time.
</details>

<details>
<summary><b>4. Premium Design Aesthetic</b></summary>
<br/>
Built with a sleek, glassmorphism UI, Orbit provides a responsive and visually stunning experience. We believe developer tools should be as beautiful as they are powerful.
</details>

## 🚀 Getting Started

Orbit is designed to be lightweight and zero-config out of the box.

### Prerequisites
- Node.js 18+ (or Docker)
- Running instance of the **Orbit-Backend**

### Installation

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

### Docker Deployment

Orbit is fully containerized and production-ready:

```bash
docker build -t orbit-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-backend:8000/api/v1 orbit-frontend
```

## 🏗️ Platform Architecture

Orbit is composed of four core pillars that work in unison to provide a seamless observability experience:

### 1. Orbit SDKs (The Agents)
The **Orbit SDKs** are lightweight libraries installed in your applications (Next.js, Node.js, Python, or Browser). They automatically hook into your application's lifecycle to capture errors, unhandled exceptions, performance traces, and breadcrumbs. 
- **Active Connection:** Unlike traditional agents, Orbit SDKs maintain a bidirectional connection with the backend, allowing them to receive live configuration updates (like changing sampling rates on the fly) without requiring a code redeploy.

### 2. Orbit Backend (The Command Center)
The **Orbit Backend** is a high-performance server built with FastAPI. It acts as the central brain of the platform.
- **Ingestion & Control:** It receives incoming telemetry from the SDKs via highly optimized ingestion routes. It also manages rate-limiting, authentication, and dispatching remote control commands back to the SDKs.
- **Data Layer:** It uses PostgreSQL for persistent storage (like users, organizations, and project metadata) and Redis for real-time pub/sub and ephemeral caching.

### 3. Orbit Observability (The Processor)
The **Orbit Observability** service is a dedicated, heavy-duty processing pipeline. 
- **Heavy Lifting:** While the backend handles the control plane, the Observability service ingests massive volumes of raw logs, distributed traces, and source maps. It processes and normalizes this data before indexing it, ensuring that the main backend remains fast and responsive even during an incident storm.

### 4. Orbit Frontend (The Dashboard)
The **Orbit Frontend** (this repository) is the Next.js application that visualizes your data.
- **Glassmorphism UI:** Built with a premium, responsive design, it connects to the backend to display real-time incident feeds, performance metrics, and infrastructure health. 
- **Centralized Management:** From the frontend, you can manage your teams, set up alerting rules, and remotely control your SDKs.

---

## 🔒 Ecosystem

Orbit is part of a larger ecosystem of tools designed to work together seamlessly. **Note: The following repositories are currently maintained as private, internal infrastructure to protect proprietary backend logic and configurations:**

- 🧠 **Orbit Backend** - The high-performance FastAPI server processing telemetry.
- 🔌 **Orbit SDKs** - Client libraries for Next.js, Node, Python, and Browser.
- 🔭 **Orbit Observability** - The core ingestion engine and processing pipeline.

## 🤝 Rules and Regulations

We welcome feedback, issue reports, and community interactions! Please adhere to our guidelines:

1. **Security Disclosures:** If you discover a security vulnerability, please do not open a public issue. Email us privately first.
2. **Acceptable Use:** The Orbit platform is intended to be self-hosted for authorized application monitoring. Do not use our SDKs for malicious tracking or unauthorized data harvesting.
3. **Respectful Communication:** Please follow our Code of Conduct when interacting with maintainers and other community members. We maintain a zero-tolerance policy for harassment or toxic behavior.

## 📄 License

Orbit is licensed under the **MIT License**.

Copyright (c) 2026 Core-Ctrl

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

