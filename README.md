# Sentinel

> Web-based Telecommunication KPI Monitoring Dashboard with Early Anomaly Detection using Isolation Forest and Z-Score.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Python](https://img.shields.io/badge/Python-3.12-yellow)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![License](https://img.shields.io/badge/License-MIT-orange)

---

## Overview

**KPI Sentinel** is a web-based dashboard application developed as part of an undergraduate research project entitled:

> **Comparative Analysis of Isolation Forest and Z-Score Methods for Early Anomaly Detection on a Web-Based Telecommunication KPI Monitoring Dashboard**

The application is designed to monitor telecommunication Key Performance Indicators (KPIs), detect abnormal behavior at an early stage, and compare the performance of two anomaly detection approaches:

- Isolation Forest
- Z-Score

The primary goal is to assist network engineers and decision makers in identifying abnormal KPI values before they impact network quality.

---

## Research Objectives

This application aims to:

- Monitor Telecommunication KPI data in real time
- Detect anomalies using statistical and machine learning approaches
- Compare the performance of Isolation Forest and Z-Score
- Provide interactive dashboard visualization
- Generate early warning notifications
- Support anomaly analysis through historical KPI trends

---

## Features

### Dashboard

- KPI Overview
- Network Health Summary
- Interactive Charts
- Historical KPI Trends
- Live KPI Monitoring

### Anomaly Detection

- Isolation Forest Detection
- Z-Score Detection
- Early Warning Alert
- Severity Classification
- Anomaly Timeline

### Comparison

- Isolation Forest vs Z-Score
- Detection Accuracy
- Precision
- Recall
- F1-Score
- Processing Time Comparison

### Data Management

- KPI Dataset Management
- CSV Import
- Data Filtering
- Search
- Export Detection Results

---

## Technology Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query
- Recharts

### Backend

- Python
- FastAPI
- Scikit-Learn
- NumPy
- Pandas

### Database

- PostgreSQL

---

## System Architecture

```
                 KPI Dataset

                      │

                      ▼

          Python FastAPI Backend

      ┌────────────────────────────┐

      │                            │

      ▼                            ▼

Isolation Forest              Z-Score

      │                            │

      └──────────────┬─────────────┘

                     ▼

           Anomaly Detection API

                     ▼

        Next.js Dashboard (Frontend)

                     ▼

      Charts • Tables • Alerts • Reports
```

---

## Project Structure

```
src/

├── app/
├── components/
│   ├── charts/
│   ├── dashboard/
│   ├── tables/
│   ├── ui/
│   └── common/
│
├── features/
│   ├── dashboard/
│   ├── anomaly/
│   ├── comparison/
│   └── kpi/
│
├── services/
├── hooks/
├── stores/
├── lib/
├── utils/
├── constants/
├── types/
└── providers/
```

---

## Dashboard Modules

- Dashboard
- KPI Monitoring
- Anomaly Detection
- Comparison Analysis
- Alert History
- Dataset Management
- Settings

---

## Detection Workflow

1. Import KPI dataset
2. Data preprocessing
3. KPI normalization
4. Isolation Forest prediction
5. Z-Score calculation
6. Compare detection results
7. Visualize anomalies
8. Generate dashboard alerts

---

## Evaluation Metrics

The comparison between Isolation Forest and Z-Score includes:

- Accuracy
- Precision
- Recall
- F1 Score
- Detection Time
- Number of Detected Anomalies

---

## Future Improvements

- Real-time streaming integration
- Kafka message queue
- Time-series forecasting
- Auto threshold optimization
- Email notification
- Telegram alert
- Role-based authentication
- Dark mode

---

## Installation

Clone repository

```bash
git clone https://github.com/yourusername/kpi-sentinel.git
```

Go to project

```bash
cd kpi-sentinel
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## Dataset

The application accepts KPI datasets in CSV format.

Example KPI:

- Availability
- Accessibility
- Retainability
- Integrity
- Call Drop Rate
- Call Setup Success Rate (CSSR)
- Handover Success Rate
- Throughput
- Latency
- Packet Loss

---

## Research Contribution

This project contributes to the comparative evaluation of statistical and machine learning methods for early anomaly detection in telecommunication KPI monitoring systems, providing practical insights into the strengths and limitations of Isolation Forest and Z-Score for operational dashboard environments.

---

## License

MIT License

---

## Author

**Mohammad Iqbal Pangestu**

Developer

Research Project — Bachelor of Informatics Engineering
