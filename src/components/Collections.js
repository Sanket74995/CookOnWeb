import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../config';
import '../styles/Collections.scss';

const Collections = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCollection, setNewCollection] = useState({
        name: '',
        description: '',
        isPublic: false,
        tags: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCollections(data);
            } else {
                console.error('Failed to fetch collections');
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollection.name.trim()) return;

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newCollection,
                    tags: newCollection.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCollections(prev => [data.collection, ...prev]);
                setNewCollection({ name: '', description: '', isPublic: false, tags: '' });
                setShowCreateForm(false);
            } else {
                console.error('Failed to create collection');
            }
        } catch (error) {
            console.error('Error creating collection:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCollection = async (collectionId) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections/${collectionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCollections(prev => prev.filter(c => c._id !== collectionId));
            } else {
                console.error('Failed to delete collection');
            }
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    if (loading) {
        return <div className="collections-page"><div className="loading">Loading collections...</div></div>;
    }

    return (
        <div className="collections-page">
            <div className="collections-header">
                <h1>My Recipe Collections</h1>
                <button
                    className="create-collection-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : 'Create Collection'}
                </button>
            </div>

            {showCreateForm && (
                <form className="create-collection-form" onSubmit={handleCreateCollection}>
                    <div className="form-group">
                        <label htmlFor="name">Collection Name *</label>
                        <input
                            type="text"
                            id="name"
                            value={newCollection.name}
                            onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder="e.g., Italian Dishes, Quick Meals"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={newCollection.description}
                            onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your collection..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            value={newCollection.tags}
                            onChange={(e) => setNewCollection(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="e.g., italian, pasta, quick"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={newCollection.isPublic}
                                onChange={(e) => setNewCollection(prev => ({ ...prev, isPublic: e.target.checked }))}
                            />
                            Make this collection public
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={saving}>
                            {saving ? 'Creating...' : 'Create Collection'}
                        </button>
                    </div>
                </form>
            )}

            <div className="collections-grid">
                {collections.length === 0 ? (
                    <div className="empty-state">
                        <h3>No collections yet</h3>
                        <p>Create your first collection to organize your favorite recipes!</p>
                    </div>
                ) : (
                    collections.map(collection => (
                        <div key={collection._id} className="collection-card">
                            <div className="collection-header">
                                <h3>{collection.name}</h3>
                                <div className="collection-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/collections/${collection._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteCollection(collection._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {collection.description && (
                                <p className="collection-description">{collection.description}</p>
                            )}

                            <div className="collection-meta">
                                <span>{collection.recipes.length} recipes</span>
                                {collection.isPublic && <span className="public-badge">Public</span>}
                            </div>

                            {collection.tags.length > 0 && (
                                <div className="collection-tags">
                                    {collection.tags.map((tag, index) => (
                                        <span key={index} className="tag">#{tag}</span>
                                    ))}
                                </div>
                            )}

                            {collection.recipes.length > 0 && (
                                <div className="collection-preview">
                                    {collection.recipes.slice(0, 3).map(recipe => (
                                        <div key={recipe._id} className="preview-recipe">
                                            <img src={`${API_BASE}${recipe.image}`} alt={recipe.title} />
                                            <span>{recipe.title}</span>
                                        </div>
                                    ))}
                                    {collection.recipes.length > 3 && (
                                        <div className="more-recipes">
                                            +{collection.recipes.length - 3} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Collections;