import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../config';
import '../styles/Collections.scss';
import Loader from './Loader';
import {
    fetchSubscriptionDetails,
    getPremiumFeatureMessage,
    getStoredSubscriptionDetails,
    isPremiumSubscription,
    subscribeToSubscriptionChanges,
} from '../utils/subscription';

const getImageSrc = (image) => {
    const value = String(image || '').trim();
    if (!value) return '';
    return value.startsWith('http://') || value.startsWith('https://') ? value : `${API_BASE}${value}`;
};

const Collections = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState('all');
    const [newCollection, setNewCollection] = useState({
        name: '',
        description: '',
        isPublic: false,
        tags: ''
    });
    const [saving, setSaving] = useState(false);
    const [subscription, setSubscription] = useState(() => getStoredSubscriptionDetails());
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchCollections();
        fetchSubscriptionDetails().then(setSubscription).catch(() => null);
        return subscribeToSubscriptionChanges(setSubscription);
    }, []);

    const fetchCollections = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch collections');
            }

            const data = await response.json();
            setCollections(data);
        } catch (error) {
            console.error('Error fetching collections:', error);
            setStatusMessage('Unable to load collections right now.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollection.name.trim()) return;
        if (!isPremiumSubscription(subscription)) {
            alert(getPremiumFeatureMessage('Saving recipe collections'));
            return;
        }

        setSaving(true);
        setStatusMessage('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/collections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newCollection,
                    tags: newCollection.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create collection');
            }

            setCollections((prev) => [data.collection, ...prev]);
            setNewCollection({ name: '', description: '', isPublic: false, tags: '' });
            setShowCreateForm(false);
            setStatusMessage('Collection created successfully.');
        } catch (error) {
            console.error('Error creating collection:', error);
            setStatusMessage(error.message || 'Unable to create collection.');
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
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete collection');
            }

            setCollections((prev) => prev.filter((collection) => collection._id !== collectionId));
            setStatusMessage('Collection deleted.');
        } catch (error) {
            console.error('Error deleting collection:', error);
            setStatusMessage('Unable to delete collection.');
        }
    };

    const filteredCollections = useMemo(() => {
        return collections.filter((collection) => {
            const matchesVisibility =
                visibilityFilter === 'all' ||
                (visibilityFilter === 'public' && collection.isPublic) ||
                (visibilityFilter === 'private' && !collection.isPublic);

            const haystack = [
                collection.name,
                collection.description,
                ...(collection.tags || [])
            ].join(' ').toLowerCase();

            const matchesSearch = haystack.includes(searchTerm.trim().toLowerCase());
            return matchesVisibility && matchesSearch;
        });
    }, [collections, searchTerm, visibilityFilter]);

    const totalRecipes = collections.reduce((sum, collection) => sum + (collection.recipes?.length || 0), 0);
    const publicCount = collections.filter((collection) => collection.isPublic).length;

    if (loading) {
        return (
            <div className="collections-page">
                <Loader label={t('loading_collections')} variant="section" />
            </div>
        );
    }

    return (
        <div className="collections-page">
            <section className="collections-hero">
                <div>
                    <p className="collections-eyebrow">Collections Studio</p>
                    <h1>{t('my_recipe_collections')}</h1>
                    <p className="collections-copy">
                        Group recipes by goal, event, season, or mood so you can return to the right cooking plan fast.
                    </p>
                </div>
                <button
                    className="create-collection-btn"
                    onClick={() => setShowCreateForm((prev) => !prev)}
                    disabled={!isPremiumSubscription(subscription)}
                >
                    {showCreateForm ? t('cancel') : t('create_collection')}
                </button>
            </section>

            <section className="collections-stats">
                <article>
                    <strong>{collections.length}</strong>
                    <span>Boards</span>
                </article>
                <article>
                    <strong>{totalRecipes}</strong>
                    <span>Saved recipes</span>
                </article>
                <article>
                    <strong>{publicCount}</strong>
                    <span>Public boards</span>
                </article>
            </section>

            {!isPremiumSubscription(subscription) && (
                <div className="collections-banner">
                    <p>Premium unlocks collection creation, recipe organization, and public sharing.</p>
                </div>
            )}

            {statusMessage && <div className="collections-status">{statusMessage}</div>}

            <section className="collections-toolbar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, note, or tag"
                />
                <div className="collections-filters">
                    <button
                        type="button"
                        className={visibilityFilter === 'all' ? 'active' : ''}
                        onClick={() => setVisibilityFilter('all')}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={visibilityFilter === 'public' ? 'active' : ''}
                        onClick={() => setVisibilityFilter('public')}
                    >
                        Public
                    </button>
                    <button
                        type="button"
                        className={visibilityFilter === 'private' ? 'active' : ''}
                        onClick={() => setVisibilityFilter('private')}
                    >
                        Private
                    </button>
                </div>
            </section>

            {showCreateForm && (
                <form className="create-collection-form" onSubmit={handleCreateCollection}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">{t('collection_name_required')}</label>
                            <input
                                type="text"
                                id="name"
                                value={newCollection.name}
                                onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                                required
                                placeholder={t('example_collection_name')}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">{t('tags_comma_separated')}</label>
                            <input
                                type="text"
                                id="tags"
                                value={newCollection.tags}
                                onChange={(e) => setNewCollection((prev) => ({ ...prev, tags: e.target.value }))}
                                placeholder={t('example_tags')}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">{t('collection_description')}</label>
                        <textarea
                            id="description"
                            value={newCollection.description}
                            onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder={t('describe_collection')}
                            rows="3"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={newCollection.isPublic}
                                onChange={(e) => setNewCollection((prev) => ({ ...prev, isPublic: e.target.checked }))}
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
                {filteredCollections.length === 0 ? (
                    <div className="empty-state">
                        <h3>{collections.length === 0 ? t('no_collections_yet') : 'No collections match your filters'}</h3>
                        <p>{collections.length === 0 ? t('create_first_collection') : 'Try a different search term or visibility filter.'}</p>
                    </div>
                ) : (
                    filteredCollections.map((collection) => (
                        <article key={collection._id} className="collection-card">
                            <div className="collection-card__top">
                                <div>
                                    <div className="collection-chip-row">
                                        <span className={`visibility-chip ${collection.isPublic ? 'is-public' : 'is-private'}`}>
                                            {collection.isPublic ? t('public') : 'Private'}
                                        </span>
                                        <span className="recipe-count-chip">
                                            {t('recipes_count', { count: collection.recipes.length })}
                                        </span>
                                    </div>
                                    <h3>{collection.name}</h3>
                                </div>
                                <button className="delete-btn" onClick={() => handleDeleteCollection(collection._id)}>
                                    {t('delete')}
                                </button>
                            </div>

                            <p className="collection-description">
                                {collection.description || 'No description yet. Use this board to group recipes for a theme or cooking goal.'}
                            </p>

                            {collection.tags.length > 0 && (
                                <div className="collection-tags">
                                    {collection.tags.map((tag) => (
                                        <span key={tag} className="tag">#{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className="collection-preview">
                                {collection.recipes.slice(0, 3).map((recipe) => (
                                    <button
                                        key={recipe._id}
                                        type="button"
                                        className="preview-recipe"
                                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                                    >
                                        {recipe.image ? (
                                            <img src={getImageSrc(recipe.image)} alt={recipe.title} />
                                        ) : (
                                            <div className="preview-fallback">{recipe.title.charAt(0)}</div>
                                        )}
                                        <span>{recipe.title}</span>
                                    </button>
                                ))}
                                {collection.recipes.length === 0 && (
                                    <div className="preview-empty">No recipes saved yet</div>
                                )}
                            </div>

                            <div className="collection-card__footer">
                                <span>Updated {new Date(collection.updatedAt || collection.createdAt).toLocaleDateString()}</span>
                                <button className="open-btn" onClick={() => navigate(`/collections/${collection._id}`)}>
                                    Open Collection
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
};

export default Collections;
