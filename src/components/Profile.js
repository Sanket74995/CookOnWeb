import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Account.scss';

const AUTH_API = 'http://localhost:5000/api/auth';
const RECIPE_API = 'http://localhost:5000/api/recipes';

const Profile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [myRecipes, setMyRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      const res = await fetch(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
        });
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
      alert('Profile updated');
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      alert(data.message || 'Failed');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    const confirmed = window.confirm('Delete this recipe permanently?');
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
      alert(error.message || 'Unable to delete recipe');
    }
  };

  const initials =
    (form.firstName?.[0] || '').toUpperCase() ||
    (form.lastName?.[0] || '').toUpperCase() ||
    'U';

  return (
    <div className="page-container">
      <div className="account-page">
        <div className="account-card account-card--highlight">
          <div className="account-header">
            <div>
              <h2 className="account-header__title">Edit Profile</h2>
              <p className="account-header__subtitle">
                Update your name and email used across CookOnWeb.
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
              <div className="dashboard-empty">Loading your recipes...</div>
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
                <div className="name">
                  {form.firstName || 'User'} {form.lastName}
                </div>
                <div className="email">{form.email || 'no-email@cookonweb.app'}</div>
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
