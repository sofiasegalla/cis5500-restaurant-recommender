import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav className='fixed left-0 top-0 z-50 flex w-full items-center justify-between gap-4 bg-rose-600 px-12 py-4 shadow'>
            <Link
                to='/'
                className='text-4xl font-medium leading-tight tracking-tighter text-white no-underline antialiased'
            >
                Dine&Dish
            </Link>
            <div className='flex gap-8'>
                <Link
                    className='text-xl font-semibold text-white no-underline'
                    to='/restaurant-search'
                >
                    Restaurant Search
                </Link>
                <Link
                    className='text-xl font-semibold text-white no-underline'
                    to='/recipe-search'
                >
                    Recipe Search
                </Link>
                <Link
                    className='text-xl font-semibold text-white no-underline'
                    to='/chef-it-up'
                >
                    Chef it UP
                </Link>
            </div>
        </nav>
    );
}
