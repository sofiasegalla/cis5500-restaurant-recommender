import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import RestaurantSearch from './pages/RestaurantSearch';
import RecipeSearch from './pages/RecipeSearch';
import ChefItUp from './pages/ChefItUp';
import 'leaflet/dist/leaflet.css';
import RecipePage from './pages/RecipePage';

function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route
                    path='/restaurant-search'
                    element={<RestaurantSearch />}
                />
                <Route path='/recipe-search' element={<RecipeSearch />} />
                <Route path='/chef-it-up' element={<ChefItUp />} />
                <Route path='/recipe/:recipeId' element={<RecipePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
