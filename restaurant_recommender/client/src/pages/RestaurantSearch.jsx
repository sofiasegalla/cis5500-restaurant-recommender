import { useState } from 'react';
import MapComponent from '../components/Map';
import Button from '../components/Button';

export default function RestaurantSearch() {
    const [restaurants, setRestaurants] = useState([]);
    const [searchWord, setSearchWord] = useState('');
    const [reviewCount, setReviewCount] = useState('');
    const [state, setState] = useState('');
    const [stars, setStars] = useState('');
    const [isOpen, setIsOpen] = useState('true'); // New state for open status
    const [sortField, setSortField] = useState('name'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('ASC'); // Default sorting order

    const [data, setData] = useState([]);
    const [userInputCity, setUserInputCity] = useState('');

    const searchRestaurants = () => {
        fetch(
            `/restaurant_search` +
                `?word=${encodeURIComponent(searchWord)}` +
                `&reviewCount=${reviewCount}` +
                `&userInputState=${encodeURIComponent(state)}` +
                `&userInputStars=${stars}` +
                `&isOpen=${isOpen}` +
                `&sortField=${sortField}` +
                `&sortOrder=${sortOrder}`
        )
            .then((res) => res.json())
            .then((resJson) => {
                setRestaurants(resJson);
            })
            .catch((error) => console.error('Error:', error));
    };

    const searchByLocation = () => {
        fetch(
            `/unique_search?userInputCity=${encodeURIComponent(userInputCity)}`
        )
            .then((res) => res.json())
            .then((resJson) => {
                setData(resJson);
            })
            .catch((err) => console.error(err));
    };

    return (
        <main className='flex flex-col'>
            <h1>Restaurant Search</h1>

            <h2 className='pb-0'>Unique Restaurants by City</h2>
            <p>
                A unique restaurant has categories that are not shared by any
                other restaurant in the city.
            </p>
            <div className='mb-8 flex items-center gap-4'>
                <input
                    type='text'
                    className='rounded-md border p-2 shadow'
                    placeholder='Enter a city'
                    value={userInputCity}
                    onChange={(e) => setUserInputCity(e.target.value)}
                />
                <Button className='max-w-xl' onClick={searchByLocation}>
                    Search for unique restaurants
                </Button>
            </div>
            <div className='z-10 pb-8'>
                <MapComponent results={data} />
            </div>

            <div className='py-6'>
                <h2>Advanced Restaurant Search</h2>
                <div className='mb-4'>
                    <input
                        type='text'
                        className='rounded-md border p-2 shadow'
                        placeholder='Search by keyword'
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                    />
                </div>
                <div className='mb-4 grid grid-cols-2 gap-4'>
                    <input
                        type='number'
                        className='rounded-md border p-2 shadow'
                        placeholder='Minimum review count'
                        value={reviewCount}
                        onChange={(e) => setReviewCount(e.target.value)}
                    />
                    <input
                        type='text'
                        className='rounded-md border p-2 shadow'
                        placeholder='State'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    <input
                        type='number'
                        step='0.1'
                        className='rounded-md border p-2 shadow'
                        placeholder='Minimum star rating'
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                    />
                    {/* Radio buttons for Open/Closed status */}
                    <div className='mb-4 flex gap-4'>
                        <label>
                            <input
                                className='mr-2'
                                type='radio'
                                value='true'
                                checked={isOpen === 'true'}
                                onChange={() => setIsOpen('true')}
                            />
                            Open
                        </label>
                        <label>
                            <input
                                className='mr-2'
                                type='radio'
                                value='false'
                                checked={isOpen === 'false'}
                                onChange={() => setIsOpen('false')}
                            />
                            Permanently Closed
                        </label>
                    </div>
                    <div className='mb-4'>
                        <label>Sort by: </label>
                        <select
                            className='ml-2 rounded-md border p-2 shadow'
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                        >
                            <option value='name'>Name</option>
                            <option value='review_count'>Review Count</option>
                            <option value='Stars'>Stars</option>
                        </select>
                        <select
                            className='ml-2 rounded-md border p-2 shadow'
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value='ASC'>Ascending</option>
                            <option value='DESC'>Descending</option>
                        </select>
                    </div>
                </div>
                <div className='mb-4'>
                    <Button onClick={searchRestaurants}>Search</Button>
                </div>
            </div>
            <div className='flex max-w-3xl flex-col gap-8 pt-12'>
                {restaurants.map((restaurant, index) => (
                    <div
                        key={index}
                        className='rounded-lg border bg-white px-8 py-4 shadow' //duration-150 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]
                    >
                        <div className=' no-underline'>
                            <h3 className='pb-2 font-bold text-black'>
                                {restaurant.name}
                            </h3>
                            <p className='text-black'>
                                {restaurant.address}, {restaurant.city}{' '}
                                {restaurant.state}
                            </p>
                            <p className='text-black'>
                                Stars: {restaurant.Stars}
                            </p>
                            <p className='text-black'>
                                Review Count: {restaurant.review_count}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
