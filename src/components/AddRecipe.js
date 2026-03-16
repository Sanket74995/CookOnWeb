import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "../styles/AddRecipe.scss";

const API = "http://localhost:5000/api/recipes";

const emptyForm = {
  title: "",
  description: "",
  ingredients: "",
  instructions: "",
  prepTime: "",
  cookTime: "",
  difficulty: "medium",
  category: "",
  cuisine: "",
  servings: "",
  tags: "",
};
const quickDietaryTags = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'high-protein', 'low-carb', 'diabetic-friendly', 'heart-healthy'];

const AddRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      return undefined;
    }

    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API}/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load recipe");
        }

        setForm({
          title: data.title || "",
          description: data.description || "",
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients
                .map((item) => [item.quantity, item.unit, item.name].filter(Boolean).join(" "))
                .join(", ")
            : "",
          instructions: Array.isArray(data.instructions)
            ? data.instructions.map((item) => item.description).join("\n")
            : "",
          prepTime: data.prepTime ?? "",
          cookTime: data.cookTime ?? "",
          difficulty: data.difficulty || "medium",
          category: data.category || "",
          cuisine: data.cuisine || "",
          servings: data.servings ?? "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        });
        setPreview(data.image || null);
      } catch (error) {
        console.error("Failed to load recipe for editing:", error);
        alert(t('unable_load_recipe'));
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    if (!image) {
      return undefined;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addQuickTag = (tag) => {
    setForm((prev) => {
      const existing = prev.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (existing.includes(tag)) {
        return prev;
      }

      return {
        ...prev,
        tags: [...existing, tag].join(', ')
      };
    });
  };

  const validateForm = () => {
    if (!localStorage.getItem("token")) {
      alert(t('please_log_in_before_saving_recipe'));
      return false;
    }

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.ingredients.trim() ||
      !form.instructions.trim() ||
      !form.cookTime ||
      !form.category ||
      !form.cuisine.trim() ||
      !form.servings ||
      (!isEditMode && !image && !preview)
    ) {
      alert(t('please_fill_required_fields'));
      return false;
    }

    return true;
  };

  const handleImport = async () => {
    if (!importUrl.trim()) {
      alert(t('paste_recipe_url'));
      return;
    }

    try {
      setImporting(true);
      const response = await fetch(`${API}/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: importUrl }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Failed to import recipe");
      }

      const imported = payload.recipe || {};
      setForm((prev) => ({
        ...prev,
        title: imported.title || prev.title,
        description: imported.description || prev.description,
        prepTime: imported.prepTime ?? prev.prepTime,
        cookTime: imported.cookTime ?? prev.cookTime,
        difficulty: imported.difficulty || prev.difficulty,
        category: imported.category || prev.category,
        cuisine: imported.cuisine || prev.cuisine,
        servings: imported.servings ?? prev.servings,
        tags: Array.isArray(imported.tags) ? imported.tags.join(", ") : prev.tags,
      }));
      if (imported.image) {
        setPreview(imported.image);
      }
      alert(payload.message || t('recipe_imported'));
    } catch (error) {
      console.error("Import recipe failed:", error);
      alert(error.message || t('unable_import_recipe'));
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await fetch(isEditMode ? `${API}/${id}` : API, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || "Failed to save recipe");
      }

      alert(isEditMode ? t('recipe_updated') : t('recipe_added'));
      navigate(isEditMode ? `/recipe/${id}` : "/profile");
    } catch (error) {
      console.error("Save recipe request failed:", error);
      alert(error.message || t('unable_save_recipe'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-container">{t('loading_recipe_editor')}</div>;
  }

  return (
    <div className="page-container">
      <div className="add-recipe-page">
        <div className="add-recipe-main">
          <div className="add-recipe-header">
            <div>
              <h2 className="add-recipe-header__title">
                {isEditMode ? t('edit_recipe') : t('add_new_recipe')}
              </h2>
              <p className="add-recipe-header__subtitle">
                {isEditMode
                  ? t('update_recipe_details')
                  : t('share_favorite_dish')}
              </p>
            </div>
            <span className="add-recipe-header__badge">
              {isEditMode ? t('edit_mode') : t('creator_mode')}
            </span>
          </div>

          <form className="add-recipe-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-section__title">{t('import_recipe_draft')}</div>
              <div className="form-section__hint">
                {t('paste_recipe_url_hint')}
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <input
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://example.com/recipe or https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="form-group">
                  <button type="button" className="btn-outlined" onClick={handleImport} disabled={importing}>
                    {importing ? t('importing') : t('import_from_url')}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section__title">{t('basic_details')}</div>
              <div className="form-section__hint">
                {t('basic_details_hint')}
              </div>

              <div className="form-group">
                <label>{t('recipe_title')}</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder={t('example_recipe_title')}
                />
              </div>

              <div className="form-group">
                <label>{t('description')}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder={t('description_placeholder')}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>{t('cuisine')}</label>
                  <input
                    name="cuisine"
                    value={form.cuisine}
                    onChange={handleChange}
                    placeholder={t('example_cuisine')}
                  />
                </div>

                <div className="form-group">
                  <label>{t('category')}</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">{t('select_category')}</option>
                    <option value="appetizer">{t('appetizer')}</option>
                    <option value="main course">{t('main course')}</option>
                    <option value="dessert">{t('dessert')}</option>
                    <option value="beverage">{t('beverage')}</option>
                    <option value="snack">{t('snack')}</option>
                    <option value="salad">{t('salad')}</option>
                    <option value="soup">{t('soup')}</option>
                    <option value="bread">{t('bread')}</option>
                  </select>
                </div>
              </div>

              <div className="time-serving-row">
                <div className="form-group">
                  <label>Prep time (minutes)</label>
                  <input
                    type="number"
                    name="prepTime"
                    value={form.prepTime}
                    onChange={handleChange}
                    placeholder="e.g. 15"
                  />
                </div>

                <div className="form-group">
                  <label>Cook time (minutes)</label>
                  <input
                    type="number"
                    name="cookTime"
                    value={form.cookTime}
                    onChange={handleChange}
                    placeholder="e.g. 30"
                  />
                </div>

                <div className="form-group">
                  <label>Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={form.servings}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                  />
                </div>

                <div className="form-group">
                  <label>Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section form-section--divider">
              <div className="form-section__title">Cover photo</div>
              <div className="form-section__hint">
                {isEditMode
                  ? "Upload a new image only if you want to replace the current one."
                  : "A good photo makes people more likely to try your recipe."}
              </div>

              <div className="image-upload">
                <label className="image-upload__dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                  <span>
                    <strong>Click to upload</strong> or drag &amp; drop
                    <br />
                    JPG, PNG, WEBP
                  </span>
                </label>

                {preview && (
                  <div className="image-upload__preview">
                    <img src={preview} alt="Recipe preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section form-section--divider">
              <div className="form-section__title">Ingredients</div>
              <div className="form-section__hint">
                Write ingredients separated by commas.
              </div>
              <div className="form-group">
                <textarea
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="e.g. 200g paneer, 2 tbsp butter, 3 tomatoes, 1 onion"
                />
              </div>
            </div>

            <div className="form-section form-section--divider">
              <div className="form-section__title">Instructions</div>
              <div className="form-section__hint">
                Put each step on a new line so the app can number them.
              </div>
              <div className="form-group">
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  placeholder={`1. Heat oil in pan...\n2. Add onions and saute...\n3. Add tomatoes and spices...`}
                />
              </div>
            </div>

            <div className="form-section form-section--divider">
              <div className="form-section__title">Tags</div>
              <div className="form-section__hint">
                Optional. Use commas like `quick, spicy, vegetarian`.
              </div>
              <div className="tags-list" style={{ marginBottom: '12px' }}>
                {quickDietaryTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="btn-outlined"
                    style={{ marginRight: '8px', marginBottom: '8px' }}
                    onClick={() => addQuickTag(tag)}
                  >
                    Add {tag}
                  </button>
                ))}
              </div>
              <div className="form-group">
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g. quick, paneer, dinner"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-outlined" onClick={() => navigate("/profile")}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {submitting
                  ? isEditMode ? "Saving..." : "Publishing..."
                  : isEditMode ? "Save changes" : "Publish recipe"}
              </button>
            </div>
          </form>
        </div>

        <div className="add-recipe-side">
          <div>
            <div className="preview-header">Live preview</div>
            <div className="preview-card">
              <div className="preview-title">{form.title || "Your recipe title"}</div>
              <div className="preview-meta">
                <span>{form.cuisine || "Cuisine"}</span>
                <span>{form.cookTime ? `${form.cookTime} min` : "Cook time"}</span>
                <span>{form.servings ? `${form.servings} servings` : "Servings"}</span>
              </div>
            </div>
          </div>

          <div className="tip-box">
            Cloud image upload is supported when `CLOUDINARY_CLOUD_NAME` and
            `CLOUDINARY_UPLOAD_PRESET` are configured in the backend.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
