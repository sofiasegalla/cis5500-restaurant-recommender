# Dine&Dish
cis5500 group project

## Instructions to run locally
### Server
```
$ cd server
$ npm install
$ npm start
```
In a new terminal window:
### Client
```
$ cd client
$ npm install
$ npm run dev
```
Make sure you have two terminal windows open running the client and the server.

To view the production build locally you can run `npm build` and then `npm preview` 

## Delpoyment
Our app is also deployed on Heroku. Here is the link: https://dine-and-dish-18a762d38544.herokuapp.com/

## Dependencies
In the client directory's client/package.json:
```
"leaflet": "^1.9.4"
"react": "^18.2.0"
"react-dom": "^18.2.0"
"react-leaflet": "^4.2.1"
"react-router-dom": "^6.20.1"
```

In the server directory's server/package.json:
```
"cors": "^2.8.5"
"dotenv": "^16.3.1"
"express": "^4.18.2"
"mysql": "^2.18.1"
"nodemon": "^3.0.1"
```
