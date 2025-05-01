const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");
const path = require("path");

const app = express();

const port = process.env.PORT || config.server_port;

app.use(
    cors({
        origin: "*",
    })
);

app.get("/random_restaurant", routes.random_restaurant);
app.get("/random_recipe", routes.random_recipe);
app.get("/recipe_by_id/:recipe_id", routes.recipe_by_id);
app.get("/recipe_by_cuisine/:word", routes.recipe_by_cuisine);
app.get("/restaurant_by_cuisine/:word", routes.restaurant_by_cuisine);
app.get("/restaurant_search", routes.restaurant_search);
app.get("/unique_search", routes.unique_search);
app.get("/recipe_search", routes.recipe_search);
// app.get("/count_recipes", routes.count_recipes);
app.get(
    "/recipe_by_restaurant_name/:res_name",
    routes.recipe_by_restaurant_name
);
app.get("/match_restaurants", routes.match_restaurants);
app.get("/search_by_city/:city", routes.search_by_city);

app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running at ${port}/`);
});

module.exports = app;
