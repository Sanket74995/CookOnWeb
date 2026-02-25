import React, { useState, useEffect } from "react";
import "../styles/AddRecipe.scss";

const API = "http://localhost:5000/api/recipes";

const AddRecipe = () => {
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    cookingTime: "",
    difficulty: "",
    category: "",
    cuisine: "",
    servings: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // handle preview URL cleanup
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  Object.keys(form).forEach((key) => data.append(key, form[key]));
  data.set("ingredients", form.ingredients); // simple string
  data.append("image", image);

  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: data,
  });

  const resBody = await res.json().catch(() => ({}));

  if (res.ok) {
    alert("Recipe added!");
    setForm({
      title: "",
      ingredients: "",
      instructions: "",
      cookingTime: "",
      difficulty: "",
      category: "",
      cuisine: "",
      servings: "",
    });
    setImage(null);
  } else {
    console.log("Create recipe error:", resBody);
    alert(resBody.message || "Failed");
  }
};


  return (
    <div className="page-container">
      <div className="add-recipe-page">
        {/* LEFT: MAIN FORM */}
        <div className="add-recipe-main">
          <div className="add-recipe-header">
            <div>
              <h2 className="add-recipe-header__title">Add New Recipe</h2>
              <p className="add-recipe-header__subtitle">
                Share your favourite dish with the CookOnWeb community.
              </p>
            </div>
            <span className="add-recipe-header__badge">Creator Mode</span>
          </div>

          <form className="add-recipe-form" onSubmit={handleSubmit}>
            {/* Title & Basic Info */}
            <div className="form-section">
              <div className="form-section__title">Basic details</div>
              <div className="form-section__hint">
                Give your recipe a clear name and choose the right category.
              </div>

              <div className="form-group">
                <label>Recipe title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Paneer Butter Masala"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Cuisine</label>
                  <input
                    name="cuisine"
                    value={form.cuisine}
                    onChange={handleChange}
                    placeholder="e.g. Indian"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="main course">Main course</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                    <option value="snack">Snack</option>
                    <option value="salad">Salad</option>
                    <option value="soup">Soup</option>
                    <option value="bread">Bread</option>
                  </select>
                </div>
              </div>

              <div className="time-serving-row">
                <div className="form-group">
                  <label>Cooking time (minutes)</label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={form.cookingTime}
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
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                  >
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-section form-section--divider">
              <div className="form-section__title">Cover photo</div>
              <div className="form-section__hint">
                A good photo makes people more likely to try your recipe.
              </div>

              <div className="image-upload">
                <label className="image-upload__dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <span>
                    <strong>Click to upload</strong> or drag &amp; drop<br />
                    JPG, PNG, WEBP • up to ~5MB
                  </span>
                </label>

                {preview && (
                  <div className="image-upload__preview">
                    <img src={preview} alt="Recipe preview" />
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="form-section form-section--divider">
              <div className="form-section__title">Ingredients</div>
              <div className="form-section__hint">
                Write ingredients separated by commas. (We’ll make this more
                advanced later.)
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

            {/* Instructions */}
            <div className="form-section form-section--divider">
              <div className="form-section__title">Instructions</div>
              <div className="form-section__hint">
                Explain each step clearly so anyone can follow.
              </div>

              <div className="form-group">
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  placeholder={`1. Heat oil in pan...\n2. Add onions and sauté...\n3. Add tomatoes and spices...`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="button" className="btn-outlined">
                Save as draft
              </button>
              <button type="submit" className="btn-primary">
                Publish recipe
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: SIDE PANEL / PREVIEW */}
        <div className="add-recipe-side">
          <div>
            <div className="preview-header">Live preview</div>
            <div className="preview-card">
              <div className="preview-title">
                {form.title || "Your recipe title"}
              </div>
              <div className="preview-meta">
                <span>{form.cuisine || "Cuisine"}</span>
                <span>
                  {form.cookingTime
                    ? `${form.cookingTime} min`
                    : "Cooking time"}
                </span>
                <span>
                  {form.servings ? `${form.servings} servings` : "Servings"}
                </span>
              </div>
            </div>
          </div>

          <div className="tip-box">
            Tip: After publishing, you can always edit your recipe from the
            profile section. Try to keep steps simple and ingredients precise so
            beginners can cook with confidence.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
