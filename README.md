# book-rest-api
Simple single file REST-API using:
- [ExpressJS](https://expressjs.com) For basic routing handler
- [Sequelize](http://docs.sequelizejs.com) for Databases (MySQL) ORM
- [body-parser](https://github.com/expressjs/body-parser) for HTTP POST method handler
- [multer](https://github.com/expressjs/multer) for multipart-form and file upload handling
- MySQL database
---
### Install
Make sure you have installed [NodeJS](https://nodejs.org/) and MySQL server on your local machine.

1. Clone this repo to your local machine
2. Create new database using MySQL database. Grab **bookstore.sql** included in this repo and import into your MySQL server.
3. `cd` to your local repo directory and run `npm install` using Terminal or Windows PowerShell
4. Please look into lines bellow and configure your database and port:
```javascript
//Set app config
const port = 3000;
const baseUrl = 'http://localhost:'+port;

//Connect to database
const sequelize = new Sequelize('bookstore', 'root', 'yourpassword', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
```
5. Run `node index.js` to start the server
---


### Routes
`GET /tugas/`
Get all tugas

`GET /tugas/<id>`
Get tugas by ID

`POST /tugas/`
Add new tugas into collection

`PUT /tugas/`
Update existing tugas

`DELETE /tugas/<id>`
Delete book by ID

---
### Test
You can get [Postman](https://www.getpostman.com/) collections of this REST-API [here](https://www.getpostman.com/collections/d07bc76008eb2d618c6f)
