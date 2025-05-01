import { useState } from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function RecipeSearchPage() {
    const [data, setData] = useState([]);
    const [searchWord, setSearchWord] = useState('');
    const [minSteps, setMinSteps] = useState('');
    const [maxSteps, setMaxSteps] = useState('');
    const [minMinutes, setMinMinutes] = useState('');
    const [maxMinutes, setMaxMinutes] = useState('');

    const [cuisine, setCuisine] = useState('');
    const [restaurantName, setRestaurantName] = useState('');

    const advancedSearch = () => {
        fetch(
            `/recipe_search?word=${encodeURIComponent(searchWord)}` +
                `&minSteps=${minSteps}&maxSteps=${maxSteps}` +
                `&minMinutes=${minMinutes}&maxMinutes=${maxMinutes}`
        )
            .then((res) => res.json())
            .then((resJson) => {
                setData(resJson);
            });
    };

    const searchByCuisine = () => {
        fetch(`/recipe_by_cuisine/${encodeURIComponent(cuisine)}`)
            .then((res) => res.json())
            .then((resJson) => {
                setData(resJson);
            });
    };

    const searchByRestaurant = () => {
        fetch(
            `/recipe_by_restaurant_name/${encodeURIComponent(restaurantName)}`
        )
            .then((res) => res.json())
            .then((resJson) => {
                setData(resJson);
            });
    };

    return (
        <main>
            <h1>Recipe Search</h1>
            <div className='py-6'>
                <h2>Search by cuisine</h2>
                <div className='mb-4'>
                    <input
                        type='text'
                        className='rounded-md border p-2 shadow'
                        placeholder='Enter a cuisine'
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                    />
                </div>
                <Button onClick={searchByCuisine}>Search for cuisine</Button>
            </div>
            {/* <div className='py-6'>
                <h2>Search by restaurant</h2>
                <p>
                    Search for recipes from your favorite restaurants. Try Taco
                    Bell!
                </p>
                <div className='mb-4'>
                    <input
                        type='text'
                        className='rounded-md border p-2 shadow'
                        placeholder='Enter a restaurant name'
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                    />
                </div>
                <Button onClick={searchByRestaurant}>Search for recipes</Button>
            </div> */}
            <div className='py-6'>
                <h2>Advanced search</h2>
                <div className='mb-4'>
                    <input
                        type='text'
                        className='rounded-md border p-2 shadow'
                        placeholder='Recipe title'
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                    />
                </div>
                <div className='mb-4 grid grid-cols-2 gap-4'>
                    <input
                        type='number'
                        className='rounded-md border p-2 shadow'
                        placeholder='Minimum recipe steps'
                        value={minSteps}
                        onChange={(e) => setMinSteps(e.target.value)}
                    />
                    <input
                        type='number'
                        className='rounded-md border p-2 shadow'
                        placeholder='Maximum recipe steps'
                        value={maxSteps}
                        onChange={(e) => setMaxSteps(e.target.value)}
                    />
                    <input
                        type='number'
                        className='rounded-md border p-2 shadow'
                        placeholder='Minimum recipe time (in minutes)'
                        value={minMinutes}
                        onChange={(e) => setMinMinutes(e.target.value)}
                    />
                    <input
                        type='number'
                        className='rounded-md border p-2 shadow'
                        placeholder='Minimum recipe time (in minutes)'
                        value={maxMinutes}
                        onChange={(e) => setMaxMinutes(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <Button onClick={advancedSearch}>Advanced search</Button>
                </div>
                <div className='flex max-w-3xl flex-col gap-8 pt-12'>
                    {data.map((recipe, index) => (
                        <div
                            key={index}
                            className='rounded-lg border bg-white px-8 py-4 shadow duration-150 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]'
                        >
                            <Link
                                className=' no-underline'
                                to={`/recipe/${recipe.recipe_id}`}
                            >
                                <h3 className='pb-2 font-bold text-black'>
                                    {recipe.name}
                                </h3>
                                {recipe.description !== 'NA' ? (
                                    <p className='text-black'>
                                        {recipe.description}
                                    </p>
                                ) : (
                                    ''
                                )}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
