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
        if (!window.confirm(t('delete_collection_confirmation'))) return;

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
        return <div className="collections-page"><div className="loading">{t('loading_collections')}</div></div>;
    }

    return (
        <div className="collections-page">
            <div className="collections-header">
                <h1>{t('my_recipe_collections')}</h1>
                <button
                    className="create-collection-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? t('cancel') : t('create_collection')}
                </button>
            </div>

            {showCreateForm && (
                <form className="create-collection-form" onSubmit={handleCreateCollection}>
                    <div className="form-group">
                        <label htmlFor="name">{t('collection_name_required')}</label>
                        <input
                            type="text"
                            id="name"
                            value={newCollection.name}
                            onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder={t('example_collection_name')}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">{t('collection_description')}</label>
                        <textarea
                            id="description"
                            value={newCollection.description}
                            onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                            placeholder={t('describe_collection')}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">{t('tags_comma_separated')}</label>
                        <input
                            type="text"
                            id="tags"
                            value={newCollection.tags}
                            onChange={(e) => setNewCollection(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder={t('example_tags')}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={newCollection.isPublic}
                                onChange={(e) => setNewCollection(prev => ({ ...prev, isPublic: e.target.checked }))}
                            />
                            {t('make_collection_public')}
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={saving}>
                            {saving ? t('creating') : t('create_collection')}
                        </button>
                    </div>
                </form>
            )}

            <div className="collections-grid">
                {collections.length === 0 ? (
                    <div className="empty-state">
                        <h3>{t('no_collections_yet')}</h3>
                        <p>{t('create_first_collection')}</p>
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
                                        {t('view')}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteCollection(collection._id)}
                                    >
                                        {t('delete')}
                                    </button>
                                </div>
                            </div>

                            {collection.description && (
                                <p className="collection-description">{collection.description}</p>
                            )}

                            <div className="collection-meta">
                                <span>{t('recipes_count', { count: collection.recipes.length })}</span>
                                {collection.isPublic && <span className="public-badge">{t('public')}</span>}
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
                                            {t('more_recipes', { count: collection.recipes.length - 3 })}
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