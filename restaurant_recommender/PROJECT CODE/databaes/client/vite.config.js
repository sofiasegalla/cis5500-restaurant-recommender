import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/random_restaurant': 'http://localhost:8080',
            '/random_recipe': 'http://localhost:8080',
            '/recipe_by_id': 'http://localhost:8080',
            '/recipe_by_cuisine': 'http://localhost:8080',
            '/restaurant_by_cuisine': 'http://localhost:8080',
            '/restaurant_search': 'http://localhost:8080',
            '/unique_search': 'http://localhost:8080',
            '/recipe_search': 'http://localhost:8080',
            '/recipe_by_restaurant_name': 'http://localhost:8080',
            '/match_restaurants': 'http://localhost:8080',
            '/search_by_city': 'http://localhost:8080',
        },
    },
});
