import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { parseStringArray } from '../utils/helpers';

export default function RecipePage() {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        fetch(`/recipe_by_id/${recipeId}`)
            .then((res) => res.json())
            .then((resJson) => setRecipe(resJson));
    }, [recipeId]);

    if (!recipe) {
        return <h1>Loading...</h1>;
    }

    return (
        <main>
            <h1 className='pb-4'>{recipe[0].name}</h1>
            <p>
                Time to prepare: <strong>{recipe[0].minutes} minutes</strong>
            </p>
            <p>{recipe[0].description}</p>
            <article className='flex gap-8'>
                <div className='w-1/4'>
                    <p className='pb-0 font-bold'>Ingredients:</p>
                    <ul className='pb-8'>
                        {parseStringArray(recipe[0].ingredients).map(
                            (ingredient) => (
                                <li key={ingredient}>{ingredient}</li>
                            )
                        )}
                    </ul>
                </div>
                <div className='w-3/4'>
                    <p className='pb-0 font-bold'>Steps:</p>
                    <ol>
                        {parseStringArray(recipe[0].steps).map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                </div>
            </article>
        </main>
    );
}
