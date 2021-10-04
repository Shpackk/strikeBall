# StrikeBall

## Node.js based API

> Designed to improve user experience in creation and participation in StrikBall games

## 👀 Features

Supports 3 roles:
For User

- SignUp
- Make a "forgot-password" request
- Join or Leave certain team
- View/Change profile

For Manager

- SignUp
- Make a "forgot-password" request
- Accept/decline user's request to join or leave team
- Kick player from team
- View certain player by id

For Admin

- Pre-added user to DB
- Accept/decline users request to join or leave team
- Kick player from team
- Accept/decline request to register as manager
- Ban/Unban user
- Kick player from team
- View certain player by id

For Everyone

- Login
- View players by teams
- View/Change profile
- View players by team or filter all players by certain team

## Tech

- [Node.JS](https://nodejs.org/en/) - Express
- [PostgreSQL](https://www.postgresql.org) - Sequelize, Sequelize-Cli,Pg, Pg-hstore
- [MongoDB](https://www.mongodb.com/cloud/atlas/lp/try2?utm_content=controlhterms&utm_source=google&utm_campaign=gs_emea_ukraine_search_core_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624575&gclid=CjwKCAjwvuGJBhB1EiwACU1AibG0AG6A_2dQ7f10inHIgdnyYhXTjJZnXA-8dx-RErEQq2WAtu9nrBoCjIEQAvD_BwE) - Mongoose
- [Passport](http://www.passportjs.org) - Passport-JWT, Passport-Google-Oauth2
- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken) - Token handle
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password Encrypting
- [EJS](https://ejs.co) - Templates for Front-End
- [JEST](https://jestjs.io) - Unit tests
- [SuperTest](https://www.npmjs.com/package/supertest) - End-to-End testing
- [Multer](https://www.npmjs.com/package/multer) - Files Uploading
- [NodeMailer](https://nodemailer.com/about/) - Mailing module
- [Nodemon](https://nodemon.io) - Dev automation
- [Socket.io](https://socket.io) - Messaging on Front-End

## Installation

Install the dependencies and devDependencies and start the server.

```sh
git clone git@github.com:Shpackk/strikeBall.git
npm i
npm run seed
npm run dev
```

## Testing

```sh
npm run test
```

## Docker

```sh
docker-compose up -it
```

If you made some changes, run :

```sh
docker-compose up --build -it
```

## License - MIT
