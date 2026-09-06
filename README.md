````markdown
# CCTV Security Services Platform

A modern, responsive web platform designed for professional CCTV, surveillance, and security service businesses.

The platform is built to provide customers with a professional digital experience for exploring CCTV solutions, understanding security services, accessing service plans, interacting with an AI-powered chatbot, and managing CCTV-related subscriptions and recharges.

## Key Features

- Modern and professional CCTV security services website
- Fully responsive design for desktop, tablet, and mobile devices
- CCTV camera and surveillance solution showcase
- Security services and solutions sections
- Product/service information and pricing presentation
- AI-powered customer support chatbot
- CCTV channel subscription and recharge functionality
- Monthly and yearly subscription plans
- Customer-oriented navigation and user experience
- Interactive UI elements and modern animations
- Scalable React-based application architecture
- Automated GitHub Actions deployment
- GitHub Pages hosting

## Technology Stack

- **React** — Frontend framework
- **TypeScript** — Type-safe application development
- **Vite** — Frontend build tool
- **Tailwind CSS** — Styling and responsive UI
- **GitHub Actions** — CI/CD automation
- **GitHub Pages** — Website hosting

## Project Structure

```text
cctv-security-services-platform-v2/
│
├── src/                  # Application source code
├── public/               # Static/public assets
├── index.html            # Application entry point
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── server.ts             # Server-side configuration
├── metadata.json         # Project metadata
├── .env.example          # Environment variable template
└── README.md             # Project documentation
````

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

## Deployment

The project is configured for automated deployment through **GitHub Actions** and **GitHub Pages**.

The deployment pipeline follows:

```text
Code Push
    ↓
GitHub Repository
    ↓
GitHub Actions
    ↓
Install Dependencies
    ↓
Production Build
    ↓
Generate dist/
    ↓
GitHub Pages Deployment
    ↓
Live Website
```

Updates pushed to the `main` branch can automatically trigger the deployment workflow.

## Live Website

**[Visit Live Website](https://anandgaikwad.github.io/cctv-security-services-platform-v2/)**

## Security

Sensitive credentials and API keys should never be committed to the repository.

Use environment variables for:

* API keys
* AI service credentials
* Payment gateway credentials
* Database credentials
* Authentication secrets
* Other private configuration values

The `.env.example` file can be used as a template for required environment variables.

## Project Status

🚀 **Actively Developed**

The platform is currently deployed through GitHub Pages and can be extended with additional production features including customer authentication, payment gateway integration, CCTV device management, subscription management, backend APIs, database integration, notifications, and advanced analytics.

## License

This project is intended for the development and operation of a professional CCTV and security services platform.

```
```
