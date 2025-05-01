const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

const random_restaurant = async function (req, res) {
    connection.query(
        `SELECT * FROM yelp_restaurants WHERE stars > 4 ORDER BY RAND() LIMIT 1;`,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// this takes about 500ms to run
// const random_recipe = async function (req, res) {
//     connection.query(
//         `SELECT * FROM recipes ORDER BY RAND() LIMIT 1;`,
//         (err, results) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send("Server Error");
//             } else {
//                 res.status(200).send(results);
//             }
//         }
//     );
// };

// takes about 250ms to run
const random_recipe = async function (req, res) {
    // Generate a random start point between 1 and 499,000
    const randomStart = Math.floor(Math.random() * 499000) + 1;
    const randomEnd = randomStart + 200;

    connection.query(
        `SELECT * FROM recipes WHERE recipe_id BETWEEN ? AND ? ORDER BY RAND() LIMIT 1;`,
        [randomStart, randomEnd],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// this wasn't on our sheet, it's just useful for the recipe page
const recipe_by_id = async function (req, res) {
    const recipeId = req.params.recipe_id;
    connection.query(
        `SELECT * FROM recipes WHERE recipe_id = ?;`,
        [recipeId],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// QUERY 1
const recipe_by_cuisine = async function (req, res) {
    const userInputCuisine = decodeURI(req.params.word);
    if (!userInputCuisine) {
        return res.status(400).send("Cuisine input is required.");
    }

    connection.query(
        // `SELECT R.name, R.description, R.recipe_id
        // FROM recipes R
        // WHERE R.tags LIKE '%${userInputCuisine}%'`,
        `SELECT R.name, R.description, R.recipe_id
         FROM recipes R
         WHERE MATCH(R.tags) AGAINST( ? IN BOOLEAN MODE);`,
        ["+" + userInputCuisine], // Parameterize the user input
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// QUERY 2
const restaurant_by_cuisine = async function (req, res) {
    const userInputCuisine = decodeURI(req.query.word);
    if (!userInputCuisine) {
        return res.status(400).send("Cuisine input is required.");
    }
    connection.query(
        `SELECT RES.name, RES.review_count, RES.address, RES.city, RES.state, RES.Stars
        FROM yelp_restaurants RES
        WHERE FIND_IN_SET(?, RES.categories) > 0`,
        [userInputCuisine],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// QUERY 4
// for testing: http://localhost:8080/restaurant_search?word=chinese&reviewCount=1&userInputState=CA&userInputStars=4
const restaurant_search = async function (req, res) {
    const userInputWord = decodeURI(req.query.word);
    const userInputReviewCount =
        req.query.reviewCount === "" ? 1 : req.query.reviewCount ?? 0;
    const userInputState = req.query.userInputState;
    const userInputStars =
        req.query.userInputStars !== "" ? req.query.userInputStars : 0;
    const userInputIsOpen = req.query.isOpen;

    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder === "DESC" ? "DESC" : "ASC";

    connection.query(
        `SELECT DISTINCT RES.name, RES.review_count, RES.address, RES.city, RES.state, RES.Stars, RES.categories
        FROM yelp_restaurants RES
        JOIN yelp_reviews R on R.business_id = RES.business_ID
        WHERE (RES.name LIKE '%${userInputWord}%' or RES.categories LIKE '%${userInputWord}%')
        AND RES.state LIKE '%${userInputState}%'
        AND RES.Stars > ${userInputStars}
        AND RES.review_count > ${userInputReviewCount}
        AND RES.is_open = ${userInputIsOpen}
        ORDER BY RES.${sortField} ${sortOrder};
`,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// QUERY 5
const unique_search = async function (req, res) {
    const userInputCity =
        req.query.userInputCity !== ""
            ? req.query.userInputCity
            : "Philadelphia";

    if (!userInputCity) {
        return res.status(400).send("City input is required.");
    }

    connection.query(
        `WITH T AS (
            SELECT DISTINCT R1.business_id, R1.longitude, R1.latitude
            FROM yelp_restaurants R1
            WHERE EXISTS (
                SELECT *
                FROM yelp_restaurants R2
                WHERE R1.business_id <> R2.business_id
                  AND R1.categories = R2.categories
                  AND R2.city = '${userInputCity}'
                  AND R1.city = '${userInputCity}'
            )
        )
        SELECT R.name, R.categories, R.city, R.state, R.latitude, R.longitude
        FROM yelp_restaurants R
        WHERE R.business_id NOT IN (SELECT business_id FROM T)
          AND R.city = '${userInputCity}'
        ORDER BY R.stars DESC
        LIMIT 100;
`,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// test: http://localhost:8080/recipe_search?word=chocolate&minSteps=2&maxSteps=10&minMinutes=15&maxMinutes=60
// QUERY 6
const recipe_search = async function (req, res) {
    const userInputWord = decodeURI(req.query.word);
    const userInputMinSteps =
        req.query.minSteps === "" ? 1 : req.query.minSteps ?? 1;
    const userInputMaxSteps =
        req.query.maxSteps === "" ? 100 : req.query.maxSteps ?? 100;
    const userInputMinMinutes =
        req.query.minMinutes === "" ? 1 : req.query.minMinutes ?? 1;
    const userInputMaxMinutes =
        req.query.maxMinutes === "" ? 1440 : req.query.maxMinutes ?? 1440;

    console.log(userInputMinSteps);

    connection.query(
        `SELECT DISTINCT R.name, R.description, R.recipe_id
        FROM recipes AS R
        INNER JOIN recipe_reviews AS V
        ON R.recipe_id = V.recipe_id
        WHERE (R.description LIKE '%${userInputWord}%'
            OR MATCH(R.tags) AGAINST('+${userInputWord}' IN BOOLEAN MODE)
            OR V.review LIKE '%${userInputWord}%'
            OR R.name LIKE '%${userInputWord}%'
            OR R.ingredients LIKE '%${userInputWord}%')
            AND R.n_steps BETWEEN ${userInputMinSteps} AND ${userInputMaxSteps}
            AND R.minutes BETWEEN ${userInputMinMinutes} AND ${userInputMaxMinutes};
`,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// // QUERY 7
// const count_recipes = async function (req, res) {
//     connection.query(
//         `SELECT R.name as dish, COUNT(*) as numRecipes
//         FROM recipes R
//         GROUP BY R.name
//         ORDER BY COUNT(*) DESC;`,
//         (err, results) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send("Server Error");
//             } else {
//                 res.status(200).send(results);
//             }
//         }
//     );
// };

// QUERY 8
// test: http://localhost:8080/recipe_by_restaurant_name/Chick-fil-A
const recipe_by_restaurant_name = async function (req, res) {
    const userInputResName = decodeURI(req.params.res_name);
    console.log(userInputResName);

    connection.query(
        `WITH RelevantCategories AS (
            SELECT
                SUBSTRING_INDEX(SUBSTRING_INDEX(yr.categories, ', ', 1), ', ', -1) AS cat1,
                SUBSTRING_INDEX(SUBSTRING_INDEX(yr.categories, ', ', 2), ', ', -1) AS cat2,
                SUBSTRING_INDEX(SUBSTRING_INDEX(yr.categories, ', ', 3), ', ', -1) AS cat3
            FROM yelp_restaurants yr
            WHERE yr.name LIKE ?
            LIMIT 1
        )
        SELECT r.name, r.recipe_id, r.description,
            (
                (IF(r.tags LIKE CONCAT('%', cat1, '%'), 1, 0)) +
                (IF(r.tags LIKE CONCAT('%', cat2, '%'), 1, 0)) +
                (IF(r.tags LIKE CONCAT('%', cat3, '%'), 1, 0))
            ) AS overlapping_tag_count
        FROM recipes r, RelevantCategories
        WHERE
            r.tags LIKE CONCAT('%', cat1, '%') OR
            r.tags LIKE CONCAT('%', cat2, '%') OR
            r.tags LIKE CONCAT('%', cat3, '%')
        ORDER BY overlapping_tag_count DESC
        LIMIT 15;`,
        [`%${userInputResName}%`],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// QUERY 9
const match_restaurants = async function (req, res) {
    const userInputWord = decodeURI(req.query.word);

    if (!userInputWord) {
        return res.status(400).send("Word input is required.");
    }

    connection.query(
        `WITH temp AS (
            SELECT r.name AS name, r.description AS recipe_description
            FROM recipes r
            WHERE r.description LIKE ? OR MATCH(r.tags) AGAINST(? IN BOOLEAN MODE)
            LIMIT 500
        ), ids AS (
            SELECT business_id
            FROM yelp_tips
            JOIN temp t1 ON text LIKE CONCAT('%', t1.name, '%')
        )
        SELECT s.name, s.review_count, s.address, s.city, s.state, s.stars, s.categories
        FROM yelp_restaurants s
        JOIN ids ON s.business_id = ids.business_id
        WHERE s.stars > 3 AND s.review_count > 10`,
        [`%${userInputWord}%`, `%${userInputWord}%`],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                res.status(200).send(results);
            }
        }
    );
};

// QUERY 10
// THIS ONE NEEDS TO BE OPTIMIZED
const search_by_city = async function (req, res) {
    const userInputCity = decodeURI(req.params.city);

    if (!userInputCity) {
        return res.status(400).send("City input is required.");
    }

    let query;
    if (userInputCity.toLowerCase() === "philadelphia") {
        // If user input is Philadelphia, use the "materialized view"
        query = `SELECT * FROM materialized_view_query_10_philly;`;
    } else {
        query = `WITH Reviews AS (
                    WITH Best_Rest AS (
                        SELECT B.business_id, B.name, B.city, B.state
                        FROM yelp_restaurants B
                        WHERE city = '${userInputCity}'
                        ORDER BY B.review_count DESC
                        LIMIT 30
                    )
                    SELECT DISTINCT(R.name) AS Rest, R.city, R.state, V.review_text AS text
                    FROM Best_Rest R
                    JOIN yelp_reviews V ON V.business_id = R.business_id
                ),
                Rec AS (
                    SELECT recipes.name AS Recipe, recipes.description
                    FROM recipes
                    JOIN recipe_reviews ON recipes.recipe_id = recipe_reviews.recipe_id
                    GROUP BY recipes.name, recipes.description
                )
                SELECT DISTINCT (C.Recipe) AS Recipe_Name, C.description AS Recipe_Description, V.Rest AS Restaurant_Name, V.City, V.State
                FROM Rec C
                JOIN Reviews V ON V.text LIKE CONCAT('%', C.Recipe, '%');`;
    }

    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error processing your request");
        } else {
            res.status(200).send(results);
        }
    });
};

// export the name of the route here
module.exports = {
    random_restaurant,
    random_recipe,
    recipe_by_id,
    recipe_search,
    restaurant_by_cuisine,
    restaurant_search,
    unique_search,
    recipe_by_cuisine,
    recipe_by_restaurant_name,
    match_restaurants,
    search_by_city,
};
