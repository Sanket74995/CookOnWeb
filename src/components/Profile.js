import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Account.scss';
import Loader from './Loader';
import { API_BASE } from '../config';

const AUTH_API = `${API_BASE}/api/auth`;
const RECIPE_API = `${API_BASE}/api/recipes`;

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [accountUser, setAccountUser] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccountUser(parsedUser);
        setForm({
          firstName: parsedUser.firstName || '',
          lastName: parsedUser.lastName || '',
          email: parsedUser.email || '',
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const nextUser = {
            ...data,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
          };
          setAccountUser(nextUser);
          setForm({
            firstName: nextUser.firstName,
            lastName: nextUser.lastName,
            email: nextUser.email,
          });
          localStorage.setItem('user', JSON.stringify(nextUser));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    const fetchMyRecipes = async () => {
      try {
        const res = await fetch(`${RECIPE_API}/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMyRecipes(data);
        }
      } catch (error) {
        console.error('Failed to fetch my recipes:', error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchProfile();
    fetchMyRecipes();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${AUTH_API}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      const updatedUser = data.user || form;
      setAccountUser(updatedUser);
      setForm({
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        email: updatedUser.email || '',
      });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert(t('profile_updated'));
    } else {
      alert(data.message || t('failed'));
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    const confirmed = window.confirm(t('delete_recipe_confirmation'));
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${RECIPE_API}/${recipeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete recipe');
      }

      setMyRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
    } catch (error) {
      console.error('Delete recipe failed:', error);
      alert(error.message || t('unable_delete_recipe'));
    }
  };

  const displayUser = useMemo(() => ({
    firstName: form.firstName || accountUser?.firstName || '',
    lastName: form.lastName || accountUser?.lastName || '',
    email: form.email || accountUser?.email || '',
  }), [accountUser, form.email, form.firstName, form.lastName]);

  const displayName = [displayUser.firstName, displayUser.lastName].filter(Boolean).join(' ').trim() || 'User';
  const displayEmail = displayUser.email || 'no-email@cookonweb.app';

  const initials =
    (displayUser.firstName?.[0] || '').toUpperCase() ||
    (displayUser.lastName?.[0] || '').toUpperCase() ||
    (displayEmail?.[0] || 'U').toUpperCase();

  return (
    <div className="page-container">
      <div className="account-page">
        <div className="account-card account-card--highlight">
          <div className="account-header">
            <div>
              <h2 className="account-header__title">{t('edit_profile')}</h2>
              <p className="account-header__subtitle">
                {t('edit_profile_subtitle')}
              </p>
            </div>
          </div>

          <form className="account-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <div className="field-hint">
                This email is used for login and important account updates.
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn-ghost" onClick={() => navigate('/add-recipe')}>
                Add Recipe
              </button>
            </div>
          </form>

          <div className="dashboard-section">
            <div className="dashboard-header">
              <h3>My Recipes</h3>
              <button className="btn-ghost" type="button" onClick={() => navigate('/add-recipe')}>
                Create new
              </button>
            </div>

            {loadingRecipes ? (
              <Loader label="Loading your recipes..." variant="card" size="sm" />
            ) : myRecipes.length === 0 ? (
              <div className="dashboard-empty">
                You have not published any recipes yet.
              </div>
            ) : (
              <div className="dashboard-recipes">
                {myRecipes.map((recipe) => (
                  <article key={recipe._id} className="dashboard-recipe-card">
                    <img src={recipe.image} alt={recipe.title} />
                    <div className="dashboard-recipe-card__body">
                      <div>
                        <h4>{recipe.title}</h4>
                        <p>{recipe.description}</p>
                        <div className="dashboard-recipe-meta">
                          <span>{recipe.cuisine}</span>
                          <span>{recipe.rating?.average || 0}/5</span>
                          <span>{recipe.reviews?.length || 0} reviews</span>
                        </div>
                      </div>

                      <div className="dashboard-recipe-actions">
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => navigate(`/recipe/${recipe._id}`)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => navigate(`/recipe/${recipe._id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-ghost btn-ghost--danger"
                          onClick={() => handleDeleteRecipe(recipe._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="account-side">
          <div className="account-card account-card--muted">
            <div className="account-summary">
              <div className="account-summary__avatar">{initials}</div>
              <div className="account-summary__info">
                <div className="name">{displayName}</div>
                <div className="email">{displayEmail}</div>
              </div>
            </div>

            <ul className="account-list">
              <li>
                <span>Recipes Published</span>
                <span className="value">{myRecipes.length}</span>
              </li>
              <li>
                <span>Total Reviews</span>
                <span className="value">
                  {myRecipes.reduce((sum, recipe) => sum + (recipe.reviews?.length || 0), 0)}
                </span>
              </li>
              <li>
                <span>Status</span>
                <span className="status-pill">Active</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
