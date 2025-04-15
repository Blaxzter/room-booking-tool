# 📅 BookiTool

![Docker Repository available](https://img.shields.io/badge/docker--hub-available-brightgreen)
![Frontend Docker Image Version](https://img.shields.io/docker/v/blaxzter/bookitool-frontend?sort=date)
![Docker Pulls](https://img.shields.io/docker/pulls/blaxzter/bookitool-frontend)
![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/blaxzter/bookitool-frontend?sort=date)
[![Quality Gate Status](https://sonarqube.fabraham.dev/api/project_badges/measure?project=Blaxzter_room-booking-tool_AZGtr7PlGScuunZVyOtX&metric=alert_status&token=sqb_22a9bebb77a4ce308aa4bbe491dc949d0bb6b89c)](https://sonarqube.fabraham.dev/dashboard?id=Blaxzter_room-booking-tool_AZGtr7PlGScuunZVyOtX)
[![Maintainability Rating](https://sonarqube.fabraham.dev/api/project_badges/measure?project=Blaxzter_room-booking-tool_AZGtr7PlGScuunZVyOtX&metric=sqale_rating&token=sqb_22a9bebb77a4ce308aa4bbe491dc949d0bb6b89c)](https://sonarqube.fabraham.dev/dashboard?id=Blaxzter_room-booking-tool_AZGtr7PlGScuunZVyOtX)
  
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/fabraham)


![Booki Tool Dashboard Image](https://github.com/Blaxzter/room-booking-tool/blob/main/github-pages/bookitool-dashboard.png?raw=true)

### 🔎 View can view an app overview on the [github pages](https://blaxzter.github.io/room-booking-tool/). (https://blaxzter.github.io/room-booking-tool/)

## 📚 About
BookiTool is a room booking tool that allows users to book rooms, manage bookings, and receive notifications. 
It is built with [Directus](https://directus.io/), a headless CMS, [Vue.js](https://vuejs.org/) with [shadcn-vue](https://www.shadcn-vue.com/docs/components/accordion) for components, and [Tailwind CSS](https://tailwindcss.com/) for styling.   
The tool is designed to be easy to use and customizable, with features like email verification, anonymous access, and Telegram notifications.

You can try out the tool by visiting the [bookitool.net](https://bookitool.net/) website which runs in the demo mode.

## 🛠️ Features
- **Room Booking**: Users can book rooms for specific dates and times.
- **Booking Management**: Admins can view and manage all bookings.
- **User Authentication**: Users can create accounts and log in.
- **Notifications**: Users can receive notifications via email or Telegram. 
- **Demo Mode**: Prohibits file upload, limits object / booking creations and allows users to request a upgrade.

### 🚧 Missing Features
- Email Verification for booking requests
- Multiple bookings for the same room at the same time
- Password reset functionality for users

## 🚀 Installation

### Quick Start
The fastest way to get started is using our installation script:

```bash
curl https://raw.githubusercontent.com/Blaxzter/room-booking-tool/refs/heads/main/setup.sh | bash
```

⚠️ **Security Note**: Always review scripts before running them with bash! While convenient, piping curl directly to bash can be dangerous.

### What the Setup Script Does
1. Downloads required configuration files (docker-compose.yml, config.env, .env)
2. Starts Docker containers
3. Initializes Directus with the correct schema
4. Configures system settings
5. Sets up proper user roles

### Optional: Telegram Bot Setup
To enable Telegram notifications:

1. Get a Telegram bot token from [@BotFather](https://t.me/botfather)
2. Run the setup script again with your token:
   ```bash
   ./setup.sh
   ```
3. Choose 'y' when prompted about Telegram setup
4. Enter your bot token

### Manual Installation
If you prefer to set everything up manually:

1. Clone the repository:
   ```bash
   git clone https://github.com/Blaxzter/room-booking-tool.git
   cd room-booking-tool
   ```

2. Copy configuration files `cp .env.example .env`
   1. Edit the `.env` file and config file to configure your settings.

3. Start the containers:
   ```bash
   docker-compose up -d
   ```

4. Initialize Directus schema:
   ```bash
   npx directus-sync push \
     -u http://localhost:8055 \
     -e your@email.com \
     -p yourpassword
   ```
