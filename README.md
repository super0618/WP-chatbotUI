# Next.js Chatbot Application

This is a Next.js chatbot application that integrates with a MySQL database for data storage and uses WordPress cookies for authentication.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Introduction

This application leverages the power of Next.js to create a robust and scalable chatbot interface. It connects to a MySQL database to store chat data and uses WordPress cookies for user authentication, ensuring secure and seamless access for users.

## Features

- **Next.js Framework**: Fast and optimized for SEO.
- **MySQL Database**: Reliable data storage and retrieval.
- **WordPress Cookie Authentication**: Secure user authentication using existing WordPress cookies.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Customizable**: Easy to extend and customize as per your requirements.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MySQL database setup and configured.
- A WordPress site with user authentication enabled and cookies configured.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/nextjs-chatbot.git
   cd nextjs-chatbot
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup MySQL Database**

   Create a MySQL database and import the required schema. Update the database configuration in the `.env.local` file.

4. **Configure Environment Variables**

   Create a `.env.local` file in the root directory and add the following environment variables:

   ```env
   DATABASE_HOST=your-database-host
   DATABASE_USER=your-database-user
   DATABASE_PASSWORD=your-database-password
   DATABASE_NAME=your-database-name
   WORDPRESS_COOKIE_NAME=your-wordpress-cookie-name
   ```

## Configuration

Update the configuration settings in the `config` directory to match your WordPress and MySQL setup. Ensure that the WordPress cookie settings match the ones used in your WordPress site.

## Usage

1. **Start the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

2. **Build for Production**

   ```bash
   npm run build
   npm run start
   ```

   The production build will optimize and serve the application efficiently.
