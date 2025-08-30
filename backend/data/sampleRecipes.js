const sampleRecipes = [
    {
        title: "Classic Margherita Pizza",
        description: "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/Eim2GpHNQDg",
        cuisine: "Italian",
        category: "main course",
        difficulty: "easy",
        prepTime: 30,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Pizza dough", quantity: "1", unit: "ball" },
            { name: "San Marzano tomatoes", quantity: "400", unit: "g" },
            { name: "Fresh mozzarella", quantity: "250", unit: "g" },
            { name: "Fresh basil leaves", quantity: "20", unit: "leaves" },
            { name: "Extra virgin olive oil", quantity: "3", unit: "tbsp" },
            { name: "Garlic", quantity: "2", unit: "cloves" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Preheat oven to 250°C (480°F)" },
            { step: 2, description: "Roll out pizza dough on a floured surface" },
            { step: 3, description: "Crush tomatoes and spread over dough" },
            { step: 4, description: "Tear mozzarella and distribute evenly" },
            { step: 5, description: "Bake for 12-15 minutes until crust is golden" },
            { step: 6, description: "Top with fresh basil and drizzle with olive oil" }
        ],
        nutrition: {
            calories: 285,
            protein: 12,
            carbs: 36,
            fat: 10
        },
        tags: ["pizza", "italian", "vegetarian", "quick"]
    },
    {
        title: "Chicken Tikka Masala",
        description: "Creamy and flavorful Indian curry with grilled chicken",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/4N7e0pksf6Q",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 45,
        cookTime: 30,
        servings: 6,
        ingredients: [
            { name: "Chicken breast", quantity: "500", unit: "g" },
            { name: "Yogurt", quantity: "200", unit: "g" },
            { name: "Heavy cream", quantity: "200", unit: "ml" },
            { name: "Tomato puree", quantity: "400", unit: "g" },
            { name: "Onion", quantity: "2", unit: "medium" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "2", unit: "tbsp" },
            { name: "Garam masala", quantity: "2", unit: "tsp" },
            { name: "Turmeric", quantity: "1", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Butter", quantity: "3", unit: "tbsp" }
        ],
        instructions: [
            { step: 1, description: "Marinate chicken in yogurt and spices for 30 minutes" },
            { step: 2, description: "Grill chicken until cooked through" },
            { step: 3, description: "Sauté onions, garlic, and ginger in butter" },
            { step: 4, description: "Add spices and cook for 2 minutes" },
            { step: 5, description: "Add tomato puree and simmer for 10 minutes" },
            { step: 6, description: "Add cream and cooked chicken, simmer for 5 minutes" }
        ],
        nutrition: {
            calories: 420,
            protein: 35,
            carbs: 15,
            fat: 25
        },
        tags: ["indian", "curry", "chicken", "spicy"]
    },
    {
        title: "Chocolate Chip Cookies",
        description: "Classic soft and chewy chocolate chip cookies",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/17uHr9dzN6E",
        cuisine: "American",
        category: "dessert",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 12,
        servings: 24,
        ingredients: [
            { name: "All-purpose flour", quantity: "2 1/4", unit: "cups" },
            { name: "Baking soda", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Butter", quantity: "1", unit: "cup" },
            { name: "Brown sugar", quantity: "3/4", unit: "cup" },
            { name: "White sugar", quantity: "3/4", unit: "cup" },
            { name: "Vanilla extract", quantity: "2", unit: "tsp" },
            { name: "Eggs", quantity: "2", unit: "large" },
            { name: "Chocolate chips", quantity: "2", unit: "cups" }
        ],
        instructions: [
            { step: 1, description: "Preheat oven to 375°F (190°C)" },
            { step: 2, description: "Cream together butter and sugars" },
            { step: 3, description: "Beat in eggs and vanilla" },
            { step: 4, description: "Mix in flour, baking soda, and salt" },
            { step: 5, description: "Stir in chocolate chips" },
            { step: 6, description: "Drop onto baking sheets and bake for 9-11 minutes" }
        ],
        nutrition: {
            calories: 180,
            protein: 2,
            carbs: 25,
            fat: 8
        },
        tags: ["cookies", "dessert", "chocolate", "baking"]
    },
    {
        title: "Fresh Garden Salad",
        description: "Healthy and refreshing salad with mixed greens and vegetables",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/SpS1aVHlC7U",
        cuisine: "International",
        category: "salad",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 0,
        servings: 4,
        ingredients: [
            { name: "Mixed greens", quantity: "200", unit: "g" },
            { name: "Cherry tomatoes", quantity: "150", unit: "g" },
            { name: "Cucumber", quantity: "1", unit: "medium" },
            { name: "Red onion", quantity: "1/2", unit: "small" },
            { name: "Bell pepper", quantity: "1", unit: "medium" },
            { name: "Olive oil", quantity: "3", unit: "tbsp" },
            { name: "Lemon juice", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Wash and chop all vegetables" },
            { step: 2, description: "Combine greens, tomatoes, cucumber, onion, and bell pepper" },
            { step: 3, description: "Whisk together olive oil, lemon juice, salt, and pepper" },
            { step: 4, description: "Toss salad with dressing and serve immediately" }
        ],
        nutrition: {
            calories: 120,
            protein: 3,
            carbs: 10,
            fat: 8
        },
        tags: ["salad", "healthy", "vegetarian", "fresh"]
    }
];

module.exports = sampleRecipes;
