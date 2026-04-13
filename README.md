<h1 align=center>Automark - Astro + GoHighLevel Website Template</h1>
<p align=center> Automark is a high-end, feature-rich Astro theme specifically crafted for GoHighLevel White-Label SaaS resellers and agencies.
</p>

<h2 align="center"> 
  <a target="_blank" href="https://automark-astro.vercel.app/" rel="nofollow">👀Demo</a> | 
  <a target="_blank" href="https://pagespeed.web.dev/report?url=https%3A%2F%2Fautomark-astro.vercel.app%2F&form_factor=desktop">Page Speed (100%)🚀</a>
</h2>

<p align=center>
  <a href="https://github.com/withastro/astro/releases/tag/astro%406.1.5" alt="Contributors">
    <img src="https://img.shields.io/static/v1?label=ASTRO&message=6.1.5&color=000&logo=astro" />
  </a>

  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/themefisher/automark-astro" alt="license"></a>

  <img src="https://img.shields.io/github/languages/code-size/themefisher/automark-astro" alt="code size">

  <a href="https://github.com/themefisher/automark-astro/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/themefisher/automark-astro" alt="contributors"></a>
</p>

![automark-astro](https://assets.teamosis.com/thumbs/automark.png)

While most resellers use the same stock templates, Automark gives you a modern, bespoke look to differentiate your brand. It comes pre-integrated with **GoHighLevel** for CRM/Lead management and **Stripe** for subscription handling, allowing you to launch a professional SaaS presence in minutes.

The template is **Agent-Ready**, featuring a dedicated .agents/skills directory designed to work seamlessly with agentic IDEs like Antigravity, Cursor, VS Code, and Claude Code. It follows industry-leading patterns for Astro, GoHighLevel, and Stripe best practices, making it as easy for an AI agent to maintain as it is for a human.

## 🔑 Key Features

- 🤖 **Agentic IDE Support**: Pre-configured with .agents/skills for peak performance in Cursor, Antigravity, and Claude Code.
- 📄 **10+ Conversion-Focused Pages**: (Home, Features, Pricing, Case Studies, etc.)
- 🔗 **Deep GoHighLevel Integration**: (Leads, Contacts, Conversations, and Calendar booking)
- 💰 **Stripe Subscription Suite**: (Automated checkout sessions and GHL contact tagging via webhooks)
- ⚡ **Blazing Performance**: (Built with Astro 6+ and Tailwind CSS 4 for near-perfect Lighthouse scores)
- ✍️ **Content-First Design**: (Markdown/MDX support for Blog, Careers, and Case Studies)
- 🔍 **SEO-Friendly**: (Automatic OG images, sitemap generation, and schema-friendly structure)
- 📱 **Fully Responsive**: (Optimized for all devices with premium dark-mode aesthetics)

## 📄 Pre-Designed Pages

- 🏠 **Home**: High-conversion landing page with automation focus.
- 🏢 **About**: Showcase your team, mission, and company values.
- ⚡ **Features**: Detailed breakdown of automation and growth tools.
- 🔌 **Integrations**: Display your ecosystem with a sleek grid layout.
- 💰 **Pricing**: Interactive pricing tiers with monthly/yearly switching.
- 📚 **Blog**: Full-featured blog with category and single post support.
- 👔 **Careers**: Job listings with individual position pages.
- 🔬 **Case Studies**: Portfolio of client success stories.
- 📞 **Contact**: GHL-integrated form and calendar booking.
- 🎨 **Elements**: Reusable UI components for consistent design.
- ⚖️ **Legal Pages**: Professional Privacy Policy and Terms templates.
- 🚧 **404 Page**: Custom error page.

## ⚙️Installation

### 🔧Install prerequisites

- **Node.js:** [Install Node.js LTS](https://nodejs.org/en/download/)
- **Package Manager:** `npm`, `yarn`, or `pnpm` (Yarn recommended).

### 🖥️Local setup

1.  👉 **Install dependencies**
    ```bash
    yarn install
    ```

2.  👉 **Configure Environment Variables**
    Copy `.env.example` to `.env` and fill in your integration keys.
    ```bash
    cp .env.example .env
    ```

3.  👉 **Run locally**
    ```bash
    yarn dev
    ```

## 🔌 Integration Setup guide

Automark works out-of-the-box with GoHighLevel and Stripe. Follow these steps to activate the automation features:

### 1. GoHighLevel (GHL) Setup
This project uses GHL to capture leads from contact forms, track checkout initiations, and mark customers as paid upon successful Stripe transactions.

- **Location ID**: Navigate to **Settings** -> **Business Info** in your GHL sub-account and copy the **Location ID**.
- **Private API Key**: Go to **Settings** -> **Integrations** -> **Private Integration**. Generate/Copy your API Key.
  - Create a **"price"** field (Text/Monetary) to track Stripe purchases.
  - *Note: Ensure the Unique Key in GHL matches `"price"` exactly as used in the API routes.*
- **Calendar Meeting**: Find your calendar in **Calendars**, copy the **Scheduling Link**, and paste it into `src/content/contact/-index.md`.

### 2. Stripe Setup
Stripe handles subscriptions and one-time payments, syncing status back to GHL via webhooks.

- **API Keys**: Get your **Secret key** (`sk_...`) from **Developers** -> **API keys**.
- **Configure Webhooks**: 
  - Add an endpoint in **Developers** -> **Webhooks** pointing to `https://your-domain.com/api/webhooks/stripe`.
  - Select the `checkout.session.completed` event.
  - Copy the **Signing secret** (`whsec_...`) to your `.env` file.

### 3. Workflow Overview
- **`/api/lead`**: Captures leads and assigns the `website-lead-generation` tag.
- **`/api/contact`**: Captures form data, assigns `website-contact-form`, and sends the message to the GHL **Conversations** tab.
- **`/api/checkout`**: Initiates a Stripe subscription and tags the contact as `checkout-initiated`.
- **Stripe Webhook**: Updates the GHL contact to `paid-customer` and logs the price upon successful payment.

## 🔨Production Build

```bash
yarn build
```

## 📝 Edit Content with CMS

This template comes pre-configured with [**Sitepins**](https://sitepins.com/?aff=tfgithub), a Git-based Headless CMS designed for seamless content management.

**How to get started:**

Click the Edit with Sitepins button below to start editing your content visually.

<a target="_blank" href="https://app.sitepins.com/new/clone?name=Automark%20Astro&repository=https://github.com/themefisher/automark-astro/?aff=tfgithub">
  <img src="https://sitepins.com/button.svg" alt="Edit with Sitepins">
</a>

## 🐞Reporting Issues

We use GitHub Issues as the official bug tracker. Please Search [existing issues](https://github.com/themefisher/automark-astro/issues) before opening a new one.

## 📄License

Copyright (c) 2016 - Present, Designed & Developed by [Themefisher](https://themefisher.com)

👉**Code License:** Released under the [MIT](LICENSE) license.
👉**Image license:** Demonstration purposes only.

## 👨💻Need Custom Development Services?

We help businesses create fast, scalable & secure websites based on NextJs, Hugo, Astro, and more. If you need a custom theme or professional services, [Hire Us](https://themefisher.com/contact).
