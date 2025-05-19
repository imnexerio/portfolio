# Modern GitHub Portfolio Website

![GitHub Portfolio](https://img.shields.io/badge/Portfolio-GitHub-blue)
![Version](https://img.shields.io/badge/Version-1.0-green)
![License](https://img.shields.io/badge/License-AGPL--3.0-yellow)

A modern, responsive portfolio website that dynamically displays your GitHub projects and statistics. This portfolio is designed to showcase your skills, projects, and professional information in an elegant and interactive way.

## ✨ Features

- **GitHub Integration**: Automatically fetches and displays your repositories, contributions, and statistics
- **Responsive Design**: Fully responsive layout that works across all devices
- **Light/Dark Mode**: Toggle between light and dark themes
- **Custom Themes**: Choose from multiple color themes or create your own
- **Modern Effects**: Includes parallax scrolling, animations, and 3D effects
- **Self-Deployable**: Generate and download a custom version of the portfolio with your information

## 🚀 Quick Start

1. Clone this repository
2. Open `js/github-config.js` and update your GitHub username
3. Customize your personal information in the profile sections
4. Deploy to your preferred hosting service (GitHub Pages, Netlify, Vercel, etc.)

## 🛠️ Configuration

### GitHub Integration

Edit the `js/github-config.js` file to set your GitHub username and optional access token:

```javascript
// Private GitHub credentials
const _username = 'your-github-username';
const _token = 'your-github-token'; // Optional but recommended for higher API limits
```

> **Note**: If you include a GitHub token in your code, make sure the repository is private or use environment variables for deployment.

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

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography
- [GitHub API](https://docs.github.com/en/rest) for project data