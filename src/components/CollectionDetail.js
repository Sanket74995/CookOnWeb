import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../config';
import '../styles/CollectionDetail.scss';

const CollectionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        isPublic: false,
        tags: []
    });
    const [saving, setSaving] = useState(false);
    const [availableRecipes, setAvailableRecipes] = useState([]);
    const [showAddRecipes, setShowAddRecipes] = useState(false);

    useEffect(() => {
        fetchCollection();
        fetchAvailableRecipes();
    }, [id]);

    const fetchCollection = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCollection(data);
                setEditForm({
                    name: data.name,
                    description: data.description,
                    isPublic: data.isPublic,
                    tags: data.tags
                });
            } else {
                console.error('Failed to fetch collection');
                navigate('/collections');
            }
        } catch (error) {
            console.error('Error fetching collection:', error);
            navigate('/collections');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableRecipes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/recipes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAvailableRecipes(data.recipes || []);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const handleUpdateCollection = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const data = await response.json();
                setCollection(data.collection);
                setEditing(false);
            } else {
                console.error('Failed to update collection');
            }
        } catch (error) {
            console.error('Error updating collection:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddRecipe = async (recipeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${id}/recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ recipeId })
            });

            if (response.ok) {
                fetchCollection(); // Refresh collection data
                setShowAddRecipes(false);
            } else {
                console.error('Failed to add recipe');
            }
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    const handleRemoveRecipe = async (recipeId) => {
        if (!window.confirm('Remove this recipe from the collection?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${id}/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchCollection(); // Refresh collection data
            } else {
                console.error('Failed to remove recipe');
            }
        } catch (error) {
            console.error('Error removing recipe:', error);
        }
    };

    if (loading) {
        return <div className="collection-detail-page"><div className="loading">Loading collection...</div></div>;
    }

    if (!collection) {
        return <div className="collection-detail-page"><div className="error">Collection not found</div></div>;
    }

    const collectionRecipeIds = collection.recipes.map(r => r._id);
    const recipesToAdd = availableRecipes.filter(recipe => !collectionRecipeIds.includes(recipe._id));

    return (
        <div className="collection-detail-page">
            <div className="collection-header">
                <button className="back-btn" onClick={() => navigate('/collections')}>
                    ← Back to Collections
                </button>

                <div className="header-actions">
                    <button className="edit-btn" onClick={() => setEditing(!editing)}>
                        {editing ? 'Cancel' : 'Edit Collection'}
                    </button>
                    <button className="add-recipes-btn" onClick={() => setShowAddRecipes(!showAddRecipes)}>
                        {showAddRecipes ? 'Cancel' : 'Add Recipes'}
                    </button>
                </div>
            </div>

            {editing ? (
                <form className="edit-collection-form" onSubmit={handleUpdateCollection}>
                    <div className="form-group">
                        <label htmlFor="name">Collection Name *</label>
                        <input
                            type="text"
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={editForm.description}
                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            value={editForm.tags.join(', ')}
                            onChange={(e) => setEditForm(prev => ({
                                ...prev,
                                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                            }))}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={editForm.isPublic}
                                onChange={(e) => setEditForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                            />
                            Make this collection public
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="collection-info">
                    <h1>{collection.name}</h1>
                    {collection.description && <p className="description">{collection.description}</p>}

                    <div className="collection-meta">
                        <span>{collection.recipes.length} recipes</span>
                        {collection.isPublic && <span className="public-badge">Public</span>}
                        <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
                    </div>

                    {collection.tags.length > 0 && (
                        <div className="collection-tags">
                            {collection.tags.map((tag, index) => (
                                <span key={index} className="tag">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {showAddRecipes && (
                <div className="add-recipes-section">
                    <h3>Add Recipes to Collection</h3>
                    {recipesToAdd.length === 0 ? (
                        <p>No more recipes available to add.</p>
                    ) : (
                        <div className="recipes-grid">
                            {recipesToAdd.map(recipe => (
                                <div key={recipe._id} className="recipe-card">
                                    <img src={`${API_BASE}${recipe.image}`} alt={recipe.title} />
                                    <div className="recipe-info">
                                        <h4>{recipe.title}</h4>
                                        <p>{recipe.cuisine} • {recipe.category}</p>
                                        <div className="rating">★ {recipe.rating?.average?.toFixed(1) || 'N/A'}</div>
                                    </div>
                                    <button
                                        className="add-btn"
                                        onClick={() => handleAddRecipe(recipe._id)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="recipes-section">
                <h2>Recipes in this Collection</h2>
                {collection.recipes.length === 0 ? (
                    <div className="empty-state">
                        <p>No recipes in this collection yet.</p>
                        <button onClick={() => setShowAddRecipes(true)}>Add some recipes</button>
                    </div>
                ) : (
                    <div className="recipes-grid">
                        {collection.recipes.map(recipe => (
                            <div key={recipe._id} className="recipe-card">
                                <img src={`${API_BASE}${recipe.image}`} alt={recipe.title} />
                                <div className="recipe-info">
                                    <h4>{recipe.title}</h4>
                                    <p>{recipe.cuisine} • {recipe.category}</p>
                                    <div className="rating">★ {recipe.rating?.average?.toFixed(1) || 'N/A'}</div>
                                    <div className="recipe-times">
                                        <span>Prep: {recipe.prepTime}min</span>
                                        <span>Cook: {recipe.cookTime}min</span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemoveRecipe(recipe._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionDetail;