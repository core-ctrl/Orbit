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

## 🏗️ Ecosystem

Orbit is part of a larger ecosystem of tools designed to work together seamlessly:

- 🧠 **[Orbit Backend](https://github.com/core-ctrl/Orbit-backend)** - The high-performance FastAPI server processing telemetry.
- 🔌 **[Orbit SDKs](https://github.com/core-ctrl/Orbit-SDK)** - Client libraries for Next.js, Node, Python, and Browser.
- 🔭 **[Orbit Observability](https://github.com/core-ctrl/Orbit-Observability)** - The core ingestion engine and processing pipeline.

## 📄 License

Orbit is Open Source software.
