import { useState } from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function ChefItUp() {
    const [recipes, setRecipes] = useState([]);
    const [favRestaurant, setFavRestaurant] = useState('');
    const [userInputCity, setUserInputCity] = useState('');
    const [data, setData] = useState([]);

    const [userInputWord, setUserInputWord] = useState('');
    const [restaurants, setRestaurants] = useState([]);

    const getRecipes = () => {
        fetch(`/recipe_by_restaurant_name/${encodeURIComponent(favRestaurant)}`)
            .then((res) => res.json())
            .then((resJson) => {
                setRecipes(resJson);
            })
            .catch((error) => console.error('Error:', error));
    };

    const searchByLocation = () => {
        fetch(`/search_by_city/${encodeURIComponent(userInputCity)}`)
            .then((res) => res.json())
            .then((resJson) => {
                setData(resJson);
            })
            .catch((err) => console.error(err));
    };

    const searchByRecipe = () => {
        fetch(`/match_restaurants?word=${encodeURIComponent(userInputWord)}`)
            .then((res) => res.json())
            .then((resJson) => {
                setRestaurants(resJson);
            })
            .catch((err) => console.error(err));
    };

    return (
        <main className='flex flex-col'>
            <h1>Chef It Up</h1>
            <p>
                Here’s where things get juicy. Ever wanted to cook that dish
                from your favorite restaurant? Now you can! Input your favorite
                restaurant and get recipes that are similar to that restaurant!
                Wow!
            </p>
            <div className='mb-8 flex items-center gap-4'>
                <input
                    type='text'
                    className='w-1/2 rounded-md border p-2 shadow'
                    placeholder='Enter your favorite restaurant'
                    value={favRestaurant}
                    onChange={(e) => setFavRestaurant(e.target.value)}
                />
                <Button onClick={getRecipes}>Get Recipes</Button>
            </div>
            <p>
                You can also get the recipes for dishes from the top restaurants
                in a city of your choosing.
            </p>
            <div className='mb-8 flex items-center gap-4'>
                <input
                    type='text'
                    className='w-1/2 rounded-md border p-2 shadow'
                    placeholder='Enter a city'
                    value={userInputCity}
                    onChange={(e) => setUserInputCity(e.target.value)}
                />
                <Button onClick={searchByLocation}>Get Recipes</Button>
            </div>
            <p>
                You can also get the restaurants that serve a recipe that has a
                tag of your choosing. Try ‘chicken’!
            </p>
            <div className='mb-8 flex items-center gap-4'>
                <input
                    type='text'
                    className='w-1/2 rounded-md border p-2 shadow'
                    placeholder='Enter a tag'
                    value={userInputWord}
                    onChange={(e) => setUserInputWord(e.target.value)}
                />
                <Button onClick={searchByRecipe}>Get Restaurants</Button>
            </div>
            <div className='flex flex-col gap-4'>
                {recipes.map((recipe) => (
                    <div
                        key={recipe.recipe_id}
                        className='max-w-2xl rounded-lg border bg-white px-8 py-4 shadow duration-150 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]'
                    >
                        <Link
                            className=' no-underline'
                            to={`/recipe/${recipe.recipe_id}`}
                        >
                            <h3 className='text-black'>{recipe.name}</h3>
                            <p className='text-black'>{recipe.description}</p>
                        </Link>
                    </div>
                ))}
            </div>
            <div className='flex flex-col gap-4'>
                {data.map((dish) => (
                    <div
                        key={`${dish.recipe_id}-${dish.Restaurant_Name}`}
                        className='max-w-2xl rounded-lg border bg-white px-8 py-4 shadow duration-150 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]'
                    >
                        <Link
                            className=' no-underline'
                            to={`/recipe/${dish.recipe_id}`}
                        >
                            <h3 className='text-black'>
                                {dish.Recipe_Name} (from {dish.Restaurant_Name})
                            </h3>
                            <p className='text-black'>
                                {dish.Recipe_Description}
                            </p>
                        </Link>
                    </div>
                ))}
            </div>
            <div className='flex flex-col gap-4'>
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.name}
                        className='max-w-2xl rounded-lg border bg-white px-8 py-4 shadow duration-150 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]'
                    >
                        <div className=' no-underline'>
                            <h3 className='text-black'>{restaurant.name}</h3>
                            <p className='text-black'>
                                {restaurant.categories}
                            </p>
                            <p>
                                {restaurant.city}, {restaurant.state}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
