# 🌟 Modern GitHub Portfolio Website

<div align="center">
  
![GitHub Portfolio](https://img.shields.io/badge/Portfolio-GitHub-blue?style=for-the-badge&logo=github)
![Version](https://img.shields.io/badge/Version-1.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-AGPL--3.0-yellow?style=for-the-badge)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

<br>

<img src="https://raw.githubusercontent.com/gist/theAdityaNVS/f5b585d1082da2dffffea32434f37956/raw/7f9552d0a179b4f98779ca5a7f9a11fe1e1ca632/GitHub-logo.gif" width="200px">

**A modern, responsive portfolio website that dynamically displays your GitHub projects and statistics**

</div>

> 💡 This portfolio is designed to showcase your skills, projects, and professional information in an elegant and interactive way.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🖥️ Demo](#️-demo)
- [🚀 Quick Start](#-quick-start)
- [🔄 GitHub Actions Deployment](#-github-actions-deployment-recommended)
- [🛠️ Configuration](#️-configuration)
- [📋 Project Structure](#-project-structure)
- [🎨 Customization](#-customization)
- [🔧 Website Generator](#-website-generator)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Local Development](#-local-development-with-environment-variables)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <img src="https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png" width="50px"><br>
        <b>GitHub Integration</b><br>
        <sub>Auto-fetch repositories, contributions & stats</sub>
      </td>
      <td align="center" width="33%">
        <img src="https://github.githubassets.com/images/modules/site/home/responsive-browser.svg" width="50px"><br>
        <b>Responsive Design</b><br>
        <sub>Works perfectly on all devices</sub>
      </td>
      <td align="center" width="33%">
        <img src="https://github.githubassets.com/images/modules/site/home/globe.svg" width="50px"><br>
        <b>Light/Dark Mode</b><br>
        <sub>Toggle between light and dark themes</sub>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.githubassets.com/images/modules/site/home/community-discussions.svg" width="50px"><br>
        <b>Custom Themes</b><br>
        <sub>Multiple color themes available</sub>
      </td>
      <td align="center">
        <img src="https://github.githubassets.com/images/modules/site/home/community-discussions.svg" width="50px"><br>
        <b>Modern Effects</b><br>
        <sub>Parallax scrolling & 3D effects</sub>
      </td>
      <td align="center">
        <img src="https://github.githubassets.com/images/modules/site/home/pr-merge.svg" width="50px"><br>
        <b>Self-Deployable</b><br>
        <sub>Generate customized versions</sub>
      </td>
    </tr>
  </table>
</div>

## 🖥️ Demo

<div align="center">
  <img src="https://raw.githubusercontent.com/imnexerio/portfolio/main/preview.gif" alt="Portfolio Demo" width="70%">
  <br><br>
  <a href="https://imnexerio.github.io/portfolio/" target="_blank">
    <img src="https://img.shields.io/badge/View_Live_Demo-5C5C5C?style=for-the-badge&logo=github&logoColor=white" alt="View Live Demo">
  </a>
</div>

## 🚀 Quick Start

<ol>
  <li>Clone this repository</li>
  <pre><code>git clone https://github.com/your-username/portfolio.git</code></pre>
  
  <li>Open <code>js/github-config.js</code> and update your GitHub username</li>
  
  <li>Customize your personal information in the profile sections</li>
  
  <li>Deploy to your preferred hosting service (GitHub Pages, Netlify, Vercel, etc.)</li>
</ol>

## 🔄 GitHub Actions Deployment (Recommended)

This portfolio includes a GitHub Actions workflow for automatic deployment to GitHub Pages:

1. Fork this repository
2. Go to your repository's Settings > Secrets and variables > Actions
3. Add a new repository secret named `PAT_GITHUB` with your GitHub token
4. Go to Settings > Pages and set the source to "GitHub Actions"
5. Any push to the main branch will automatically deploy your portfolio

The deployment workflow will:
- Build and deploy your site to GitHub Pages
- Make your PAT_GITHUB token available during the build process
- Keep your token secure by using GitHub's secret management

## 🛠️ Configuration

### GitHub Integration

Edit the `js/github-config.js` file to set your GitHub username:

```javascript
// Private GitHub credentials
const _username = 'your-github-username';
// Leave token empty - use GitHub Actions workflow for secure deployment
const _token = ''; // Token should be set as PAT_GITHUB in GitHub repository secrets
```

> **Security Best Practice**: Never include your GitHub token directly in code. Use the GitHub Actions workflow to securely use your token from repository secrets.

### Social Links

Configure your social media links in `js/social-links.js`:

```javascript
const socialLinks = [
    { platform: 'github', url: 'https://github.com/your-username' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/your-profile' },
    // Add more platforms as needed
];
```

## 📋 Project Structure

<details>
<summary>Click to expand file structure</summary>

```
portfolio/
├── index.html            # Main HTML file
├── css/                  # Styling files
│   ├── modern-styles.css        # Base styles
│   ├── advanced-animations.css  # Animation effects
│   ├── wow-effects.css          # Scroll effects
│   ├── consolidated-responsive.css # Responsive design
│   ├── github-stats.css         # GitHub statistics styling
│   └── website-generator.css    # Generator styling
├── js/                   # JavaScript files
│   ├── github-config.js        # GitHub configuration
│   ├── github-stats.js         # GitHub data fetching and display
│   ├── optimized-main.js       # Main functionality
│   ├── social-links.js         # Social media links handler
│   └── website-generator.js    # Portfolio generator
└── LICENSE               # AGPL License file
```
</details>

## 🎨 Customization

### Themes

The portfolio includes several built-in themes:
- Light theme (default)
- Dark theme
- Multiple custom color options

To change the default theme, modify the `data-theme` attribute in the HTML tag:

```html
<html lang="en" data-theme="dark">
```

### Sections

The portfolio includes the following sections:
- Hero/Introduction
- About Me
- Skills & Expertise
- Projects (automatically populated from GitHub)
- GitHub Statistics
- Contact Information

Each section can be customized or hidden based on your preferences.

## 🔧 Website Generator

This portfolio includes a built-in generator that allows visitors to create their own customized version. The generator:

1. Collects user information
2. Customizes the portfolio with that information
3. Generates a downloadable ZIP file with the complete website

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop screens
- Tablets
- Mobile devices

## 🧪 Local Development with Environment Variables

For local testing with GitHub authentication:

1. Edit the `js/env-loader.js` file and replace `'your_github_token_here'` with your actual GitHub token:
   ```javascript
   // Set your GitHub token for local testing
   window.env.PAT_GITHUB = 'your_actual_token_here';
   ```

2. Start your local development server (e.g., Live Server in VS Code or Python's built-in server)
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   ```

3. Open your browser to the local development URL (e.g., `http://localhost:8000` or `http://127.0.0.1:5500`)

The environment variable loader will detect you're in a local environment and use the token from the env-loader.js file. This file is added to .gitignore, so you won't accidentally commit your token to the repository.

> **Note**: Always ensure `js/env-loader.js` remains in your `.gitignore` file to prevent committing your token.

## 📄 License

<div align="center">
  
This project is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0)

<img src="https://upload.wikimedia.org/wikipedia/commons/0/06/AGPLv3_Logo.svg" width="120px">
</div>

## 🙏 Acknowledgements

<div align="center">
  <a href="https://fontawesome.com/"><img src="https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white"></a>
  <a href="https://fonts.google.com/"><img src="https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge&logo=google&logoColor=white"></a>
  <a href="https://docs.github.com/en/rest"><img src="https://img.shields.io/badge/GitHub_API-181717?style=for-the-badge&logo=github&logoColor=white"></a>
</div>

---

<div align="center">
  <sub>Built with ❤️ by [IMNEXERIO](https://github.com/imnexerio)</sub>
  <br><br>
</div>