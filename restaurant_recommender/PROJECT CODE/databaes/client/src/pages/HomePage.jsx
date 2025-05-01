import { useEffect, useState } from 'react';
import Hr from '../components/Hr';
import { Link } from 'react-router-dom';

export default function HomePage() {
    const [randomRestaurant, setRandomRestaurant] = useState('');
    const [randomRecipe, setRandomRecipe] = useState('');

    useEffect(() => {
        fetch(`/random_restaurant`)
            .then((response) => response.json())
            .then((data) => setRandomRestaurant(data));
    }, []);

    useEffect(() => {
        fetch(`/random_recipe`)
            .then((response) => response.json())
            .then((data) => setRandomRecipe(data));
    }, []);

    return (
        <>
            <main className='flex flex-col items-center'>
                <h1 className='text-gray-800'>Welcome to Dine&Dish</h1>
                <h3 className='max-w-xl pb-12 text-gray-500'>
                    Where the vibrant world of dining out meets the personal
                    touch of home-cooked meals.
                </h3>
                <Hr className='bg-gray-300' />
                <section className='flex w-full gap-8 pt-12'>
                    <div className='w-full '>
                        <h2 className='pl-4'>Restaurant Spotlight</h2>
                        <div className='rounded-lg border bg-white px-8 py-4 shadow'>
                            <div>
                                {randomRestaurant[0] ? (
                                    <>
                                        <h3 className='pb-0 text-gray-800'>
                                            {randomRestaurant[0].name}
                                        </h3>
                                        <p>
                                            {randomRestaurant[0].city},{' '}
                                            {randomRestaurant[0].state}
                                        </p>
                                        <p>
                                            Rating: {randomRestaurant[0].stars}{' '}
                                            stars
                                        </p>
                                    </>
                                ) : (
                                    'Loading restaurant spotlight...'
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <h2 className='pl-4'>Recipe Spotlight</h2>
                        <div className='rounded-lg border bg-white px-8 py-4 shadow duration-150 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'>
                            {randomRecipe[0] ? (
                                <Link
                                    className='no-underline'
                                    to={`/recipe/${randomRecipe[0].recipe_id}`}
                                >
                                    <h3 className='text-gray-800 '>
                                        {randomRecipe[0].name}
                                    </h3>
                                    <p className='text-black'>
                                        {randomRecipe[0].description}
                                    </p>
                                </Link>
                            ) : (
                                'Loading recipe spotlight...'
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
