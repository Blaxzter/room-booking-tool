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

## 🚀 Installation

Run `docker-compose up` to start the development server.

### Backend - Directus Setup
This project uses the open source cms [directus](https://directus.io/).

The image that is hosed on [dockerhub](https://hub.docker.com/repository/docker/blaxzter/bookitool-directus/general) has the required plugins bundled in. 
After the directus instance is running you have to create the schema, roles and permissions.  
The extension used is [directus-sync](https://github.com/tractr/directus-sync?tab=readme-ov-file#installation). 

```sh
npx directus-sync push -u http://localhost:8055 -e 'email' -p 'password'
```
