# vm-accelerator-ops-dashboard
This repository contains the code for a **Dashboard for Operations and Services** that displays the health status of multiple services and servers. It provides a real-time overview of the running status of various systems in your infrastructure, enabling quick identification of any issues and ensuring smoother operation management.

# Operations & Services Dashboard

This repository contains the code for a **Dashboard for Operations and Services** that displays the health status of multiple services and servers. It provides a real-time overview of the running status of various systems in your infrastructure, enabling quick identification of any issues and ensuring smoother operation management.

## Features

- **Multi-Server Monitoring**: Monitor the status of multiple servers across different environments.
- **Service Health Status**: Display the health (e.g., running, stopped, error states) of services running on the monitored servers.
- **Real-Time Updates**: Continuous updates on the dashboard to reflect the most current state of services and servers.
- **Customizable Views**: Ability to configure the dashboard to focus on specific services, servers, or regions.
- **Alert System**: Configure alerts or notifications for critical service failures or downtime.
- **Visual Status Indicators**: Use color-coded indicators (Green for Healthy, Red for Critical, Yellow for Warning, etc.) for easy identification of issues.
- **Historical Data**: Track historical data of services/servers over time for reporting and performance analysis.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dashboard Design](#dashboard-design)
- [Supported Services](#supported-services)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

# Operations & Services Dashboard

The Operations & Services Dashboard provides real-time visibility into the health and status of multiple servers and services. It is designed for IT Operations, DevOps, and SRE teams that require a consolidated, live overview of infrastructure health.

---

## Features

• Monitor multiple servers and services  
• Real-time health status (Healthy / Warning / Down)  
• Auto-refresh system  
• Color-coded indicators  
• Supports HTTP-based /health or /status endpoints  
• JSON-based configuration  
• Extensible and modular design  

---

## Configuration Files

All configuration lives inside the **config** directory:

1. servers.json — Defines servers being monitored  
2. services.json — Defines services linked to servers  
3. settings.json — General monitoring settings  

Example formats:

servers.json  
[
  {
    "id": "srv-web-1",
    "name": "Main Web Server",
    "type": "web",
    "health_url": "https://example.com/health"
  },
  {
    "id": "srv-db-1",
    "name": "Primary Database",
    "type": "database",
    "health_url": "http://10.0.0.50:8080/status"
  }
]

services.json  
[
  {
    "name": "User API",
    "server_id": "srv-web-1",
    "health_url": "https://example.com/api/user/health",
    "check_interval": 20
  },
  {
    "name": "Orders API",
    "server_id": "srv-web-1",
    "health_url": "https://example.com/api/orders/health",
    "check_interval": 20
  }
]

settings.json  
{
  "refresh_interval_seconds": 15,
  "timeout_ms": 5000,
  "retry_attempts": 2
}

---

## Installation

### Clone the repository
git clone https://github.com/company/operations-dashboard.git  
cd operations-dashboard

### Install the frontend
cd frontend  
npm install  
npm start  

The dashboard runs at:  
http://localhost:3000

### Optional: Run backend aggregator
Node.js backend  
cd backend  
npm install  
npm start  

Python backend  
pip install -r requirements.txt  
python app.py  

---

## Dashboard Overview

The dashboard provides:

• Server status grid  
• Service-level health indicators  
• JSON health response viewer  
• Auto-refresh status  
• Clickable details for troubleshooting  
• Response time and error indicators  

---

## Supported Health Responses

The system treats the following responses as healthy:

{"status":"UP"}  
{"healthy": true}  
{"status":"ok"}  

Any other response is considered unhealthy.

---

## Docker Deployment

Use Docker Compose to run the entire system:

docker-compose up -d

---

## Adding a New Service

1. Open config/services.json  
2. Add a new entry:  

{
  "name": "Billing API",
  "server_id": "srv-web-1",
  "health_url": "https://example.com/api/billing/health",
  "check_interval": 25
}

3. Save the file and refresh the dashboard

---

## Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Submit a pull request  

---

## License

This project is not licensed.
