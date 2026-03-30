import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import '../styles/CollectionDetail.scss';
import Loader from './Loader';
import { fetchSubscriptionDetails, getPremiumFeatureMessage, isPremiumSubscription } from '../utils/subscription';

const getImageSrc = (image) => {
    const value = String(image || '').trim();
    if (!value) return '';
    return value.startsWith('http://') || value.startsWith('https://') ? value : `${API_BASE}${value}`;
};

const CollectionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [subscription, setSubscription] = useState(null);
    const [recipeSearch, setRecipeSearch] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchCollection();
        fetchAvailableRecipes();
        fetchSubscriptionDetails().then(setSubscription).catch(() => null);
    }, [id]);

    const fetchCollection = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch collection');
            }

            const data = await response.json();
            setCollection(data);
            setEditForm({
                name: data.name,
                description: data.description,
                isPublic: data.isPublic,
                tags: data.tags
            });
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
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setAvailableRecipes(Array.isArray(data) ? data : (data.recipes || []));
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const handleUpdateCollection = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update collection');
            }

            setCollection(data.collection);
            setEditing(false);
            setStatusMessage('Collection updated.');
        } catch (error) {
            console.error('Error updating collection:', error);
            setStatusMessage(error.message || 'Unable to update collection.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddRecipe = async (recipeId) => {
        if (!isPremiumSubscription(subscription)) {
            alert(getPremiumFeatureMessage('Saving recipes to collections'));
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${id}/recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ recipeId })
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add recipe');
            }

            await fetchCollection();
            setStatusMessage('Recipe added to collection.');
        } catch (error) {
            console.error('Error adding recipe:', error);
            setStatusMessage(error.message || 'Unable to add recipe.');
        }
    };

    const handleRemoveRecipe = async (recipeId) => {
        if (!window.confirm('Remove this recipe from the collection?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${id}/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove recipe');
            }

            await fetchCollection();
            setStatusMessage('Recipe removed from collection.');
        } catch (error) {
            console.error('Error removing recipe:', error);
            setStatusMessage('Unable to remove recipe.');
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setStatusMessage('Collection link copied.');
        } catch (error) {
            setStatusMessage('Unable to copy collection link.');
        }
    };

    const collectionRecipeIds = useMemo(() => collection?.recipes.map((recipe) => recipe._id) || [], [collection]);

    const recipesToAdd = useMemo(() => {
        return availableRecipes
            .filter((recipe) => !collectionRecipeIds.includes(recipe._id))
            .filter((recipe) => {
                const haystack = `${recipe.title} ${recipe.cuisine} ${recipe.category} ${(recipe.tags || []).join(' ')}`.toLowerCase();
                return haystack.includes(recipeSearch.trim().toLowerCase());
            });
    }, [availableRecipes, collectionRecipeIds, recipeSearch]);

    const averageCookTime = collection?.recipes?.length
        ? Math.round(collection.recipes.reduce((sum, recipe) => sum + Number(recipe.cookTime || 0) + Number(recipe.prepTime || 0), 0) / collection.recipes.length)
        : 0;

    if (loading) {
        return (
            <div className="collection-detail-page">
                <Loader label="Loading collection..." variant="section" />
            </div>
        );
    }

    if (!collection) {
        return <div className="collection-detail-page"><div className="error">Collection not found</div></div>;
    }

    return (
        <div className="collection-detail-page">
            <section className="collection-hero">
                <button className="back-btn" onClick={() => navigate('/collections')}>
                    Back to Collections
                </button>

                <div className="collection-hero__content">
                    <div>
                        <div className="hero-chip-row">
                            <span className={`visibility-chip ${collection.isPublic ? 'is-public' : 'is-private'}`}>
                                {collection.isPublic ? 'Public' : 'Private'}
                            </span>
                            <span className="meta-chip">{collection.recipes.length} recipes</span>
                            <span className="meta-chip">Avg time {averageCookTime} min</span>
                        </div>
                        <h1>{collection.name}</h1>
                        <p>{collection.description || 'Use this board to collect recipes for a theme, event, health goal, or cooking experiment.'}</p>
                    </div>

                    <div className="header-actions">
                        <button className="ghost-btn" onClick={handleCopyLink}>Copy Link</button>
                        <button className="edit-btn" onClick={() => setEditing((prev) => !prev)}>
                            {editing ? 'Close Editor' : 'Edit Collection'}
                        </button>
                        <button className="add-recipes-btn" onClick={() => setShowAddRecipes((prev) => !prev)}>
                            {showAddRecipes ? 'Hide Recipe Library' : 'Add Recipes'}
                        </button>
                    </div>
                </div>
            </section>

            {statusMessage && <div className="detail-status">{statusMessage}</div>}

            {!isPremiumSubscription(subscription) && (
                <div className="detail-banner">
                    Premium plan required to add new recipes into collections.
                </div>
            )}

            {editing && (
                <form className="edit-collection-form" onSubmit={handleUpdateCollection}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Collection Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">Tags</label>
                            <input
                                type="text"
                                id="tags"
                                value={editForm.tags.join(', ')}
                                onChange={(e) => setEditForm((prev) => ({
                                    ...prev,
                                    tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean)
                                }))}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={editForm.description}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                            rows="3"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={editForm.isPublic}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, isPublic: e.target.checked }))}
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
            )}

            {showAddRecipes && (
                <section className="add-recipes-section">
                    <div className="section-header">
                        <div>
                            <h3>Add Recipes to Collection</h3>
                            <p>Search your recipe library and add what belongs in this board.</p>
                        </div>
                        <input
                            type="text"
                            value={recipeSearch}
                            onChange={(e) => setRecipeSearch(e.target.value)}
                            placeholder="Search recipe library"
                        />
                    </div>

                    {recipesToAdd.length === 0 ? (
                        <p className="empty-copy">No more recipes match this search.</p>
                    ) : (
                        <div className="recipe-library-grid">
                            {recipesToAdd.slice(0, 18).map((recipe) => (
                                <article key={recipe._id} className="library-card">
                                    {recipe.image ? (
                                        <img src={getImageSrc(recipe.image)} alt={recipe.title} />
                                    ) : (
                                        <div className="image-fallback">{recipe.title.charAt(0)}</div>
                                    )}
                                    <div className="library-card__body">
                                        <h4>{recipe.title}</h4>
                                        <p>{recipe.cuisine} · {recipe.category}</p>
                                        <button className="add-btn" onClick={() => handleAddRecipe(recipe._id)}>
                                            Add to Collection
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}

            <section className="recipes-section">
                <div className="section-header">
                    <div>
                        <h2>Recipes in this Collection</h2>
                        <p>Open, compare, and trim your saved lineup.</p>
                    </div>
                </div>

                {collection.tags.length > 0 && (
                    <div className="collection-tags">
                        {collection.tags.map((tag) => (
                            <span key={tag} className="tag">#{tag}</span>
                        ))}
                    </div>
                )}

                {collection.recipes.length === 0 ? (
                    <div className="empty-state">
                        <p>No recipes in this collection yet.</p>
                        <button onClick={() => setShowAddRecipes(true)}>Add some recipes</button>
                    </div>
                ) : (
                    <div className="recipes-grid">
                        {collection.recipes.map((recipe) => (
                            <article key={recipe._id} className="recipe-card">
                                {recipe.image ? (
                                    <img src={getImageSrc(recipe.image)} alt={recipe.title} />
                                ) : (
                                    <div className="image-fallback">{recipe.title.charAt(0)}</div>
                                )}
                                <div className="recipe-info">
                                    <h4>{recipe.title}</h4>
                                    <p>{recipe.cuisine} · {recipe.category}</p>
                                    <div className="recipe-times">
                                        <span>{recipe.prepTime} min prep</span>
                                        <span>{recipe.cookTime} min cook</span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button className="view-btn" onClick={() => navigate(`/recipe/${recipe._id}`)}>
                                        View
                                    </button>
                                    <button className="remove-btn" onClick={() => handleRemoveRecipe(recipe._id)}>
                                        Remove
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default CollectionDetail;
