import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Recipes.scss';
import RecipeCard from './RecipeCard';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [selectedDiet, setSelectedDiet] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [isCuisineDropdownOpen, setIsCuisineDropdownOpen] = useState(false);
    const [isDietDropdownOpen, setIsDietDropdownOpen] = useState(false);
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/recipes');
                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data);
                    setFilteredRecipes(data);
                    // Extract unique cuisines
                    const uniqueCuisines = [...new Set(data.map(recipe => recipe.cuisine))].sort();
                    setCuisines(uniqueCuisines);

                    // Extract unique tags
                    const allTags = data.flatMap(recipe => recipe.tags || []);
                    const uniqueTags = [...new Set(allTags)].sort();
                    setAvailableTags(uniqueTags);
                } else {
                    console.error('Failed to fetch recipes');
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    // Helper function to check if recipe contains meat
    const hasMeat = (recipe) => {
        const meatKeywords = /meat|chicken|beef|pork|fish|seafood|lamb|turkey|duck|goat|venison/i;
        return recipe.ingredients && recipe.ingredients.some(ing => meatKeywords.test(ing.name));
    };

    useEffect(() => {
        let filtered = recipes;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(recipe =>
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );
        }

        // Filter by selected cuisines
        if (selectedCuisines.length > 0 && !selectedCuisines.includes('All')) {
            filtered = filtered.filter(recipe => selectedCuisines.includes(recipe.cuisine));
        }

        // Filter by diet
        if (selectedDiet === 'Vegetarian') {
            filtered = filtered.filter(recipe => !hasMeat(recipe));
        } else if (selectedDiet === 'Non-Vegetarian') {
            filtered = filtered.filter(recipe => hasMeat(recipe));
        }

        // Filter by selected tags
        if (selectedTags.length > 0) {
            filtered = filtered.filter(recipe =>
                recipe.tags && selectedTags.every(tag => recipe.tags.includes(tag))
            );
        }

        setFilteredRecipes(filtered);
    }, [recipes, searchTerm, selectedCuisines, selectedDiet, selectedTags]);

    const handleRecipeClick = (recipeId) => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            // User is logged in, navigate to recipe detail page
            navigate(`/recipe/${recipeId}`);
        } else {
            // User is not logged in, navigate to register page
            navigate('/register');
        }
    };

    // Group filtered recipes by cuisine
    const recipesByCuisine = useMemo(() => {
        const grouped = {};
        filteredRecipes.forEach(recipe => {
            if (!grouped[recipe.cuisine]) {
                grouped[recipe.cuisine] = [];
            }
            grouped[recipe.cuisine].push(recipe);
        });
        return grouped;
    }, [filteredRecipes]);

    if (loading) {
        return <div className="recipes-loading">Loading recipes...</div>;
    }

    return (
        <div className="recipes-container">
            <div className="recipes-header">
                <h1>All Recipes</h1>
                <p>Discover amazing recipes from around the world</p>
            </div>

            <div className="filters-section">
                <div className="filter-item">
                    <label htmlFor="search">Search:</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search recipes, tags, or ingredients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <label>Cuisine:</label>
                    <div className="custom-dropdown">
                        <button
                            className="dropdown-button"
                            onClick={() => setIsCuisineDropdownOpen(!isCuisineDropdownOpen)}
                        >
                            {selectedCuisines.length === 0 ? 'Select Cuisines' : selectedCuisines.includes('All') ? 'All' : selectedCuisines.join(', ')}
                        </button>
                        {isCuisineDropdownOpen && (
                            <div className="dropdown-options">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedCuisines.includes('All')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedCuisines(['All']);
                                            } else {
                                                setSelectedCuisines([]);
                                            }
                                        }}
                                    />
                                    All
                                </label>
                                {cuisines.map(cuisine => (
                                    <label key={cuisine}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCuisines.includes(cuisine)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedCuisines(prev => [...prev.filter(c => c !== 'All'), cuisine]);
                                                } else {
                                                    setSelectedCuisines(prev => prev.filter(c => c !== cuisine));
                                                }
                                            }}
                                        />
                                        {cuisine}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="filter-item">
                    <label>Diet:</label>
                    <div className="custom-dropdown">
                        <button
                            className="dropdown-button"
                            onClick={() => setIsDietDropdownOpen(!isDietDropdownOpen)}
                        >
                            {selectedDiet}
                        </button>
                        {isDietDropdownOpen && (
                            <div className="dropdown-options">
                                {['All', 'Vegetarian', 'Non-Vegetarian'].map(diet => (
                                    <label key={diet}>
                                        <input
                                            type="radio"
                                            name="diet"
                                            value={diet}
                                            checked={selectedDiet === diet}
                                            onChange={(e) => {
                                                setSelectedDiet(e.target.value);
                                                setIsDietDropdownOpen(false);
                                            }}
                                        />
                                        {diet}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>



                <div className="filter-item">
                    <button
                        className="reset-button"
                        onClick={() => {
                            setSelectedCuisines([]);
                            setSelectedDiet('All');
                            setSearchTerm('');
                            setSelectedTags([]);
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {Object.entries(recipesByCuisine).sort(([, a], [, b]) => b.length - a.length).map(([cuisine, recipes]) => (
                <section key={cuisine} className="cuisine-section">
                    <h2>{cuisine}</h2>
                    <div className="cuisine-recipes" >
                        {recipes.map(recipe => (
                            <div key={recipe._id} onClick={() => handleRecipeClick(recipe._id)} className="recipe-card-wrapper">
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Recipes;
