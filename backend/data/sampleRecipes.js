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
    },
    {
        title: "Poha",
        description: "Fluffy flattened rice cooked with vegetables and spices",
        image: "https://1.bp.blogspot.com/-bspriSOBAPo/XYmCqbFDZ4I/AAAAAAAAbLE/-V7HKUgNwGME6yaJ5hmQ_L5Z0cYsVeuoACLcBGAsYHQ/s1600/20190921_115653.jpg",
        video: "https://www.youtube.com/embed/8yO8z9Q7z8E",
        cuisine: "Indian",
        category: "main course",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Flattened rice (poha)", quantity: "2", unit: "cups" },
            { name: "Potatoes", quantity: "2", unit: "medium" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Green chilies", quantity: "2", unit: "pieces" },
            { name: "Peanuts", quantity: "1/4", unit: "cup" },
            { name: "Mustard seeds", quantity: "1", unit: "tsp" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Lemon juice", quantity: "1", unit: "tbsp" },
            { name: "Coriander leaves", quantity: "2", unit: "tbsp" }
        ],
        instructions: [
            { step: 1, description: "Wash poha and soak for 5 minutes, then drain" },
            { step: 2, description: "Heat oil and add mustard seeds, let them splutter" },
            { step: 3, description: "Add peanuts and fry until golden" },
            { step: 4, description: "Add chopped onions, green chilies, and cook until onions are soft" },
            { step: 5, description: "Add diced potatoes, turmeric, and salt, cook until potatoes are tender" },
            { step: 6, description: "Add soaked poha and mix gently" },
            { step: 7, description: "Cook for 2-3 minutes, add lemon juice and coriander" }
        ],
        nutrition: {
            calories: 220,
            protein: 5,
            carbs: 35,
            fat: 8
        },
        tags: ["indian", "breakfast", "vegetarian", "quick"]
    },
    {
        title: "Upma",
        description: "Savory semolina dish with vegetables and spices",
        image: "https://images.aws.nestle.recipes/resized/ba32df908435796279e3d79f0d5fbdc1_Rava_Upma_-_Twist_944_531.jpg",
        video: "https://www.youtube.com/embed/4N7e0pksf6Q",
        cuisine: "Indian",
        category: "main course",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        ingredients: [
            { name: "Semolina (sooji)", quantity: "1", unit: "cup" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Carrot", quantity: "1", unit: "medium" },
            { name: "Green peas", quantity: "1/2", unit: "cup" },
            { name: "Green chilies", quantity: "2", unit: "pieces" },
            { name: "Mustard seeds", quantity: "1", unit: "tsp" },
            { name: "Urad dal", quantity: "1", unit: "tsp" },
            { name: "Curry leaves", quantity: "8-10", unit: "leaves" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Water", quantity: "2", unit: "cups" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Dry roast semolina until light golden, set aside" },
            { step: 2, description: "Heat oil, add mustard seeds and urad dal" },
            { step: 3, description: "Add curry leaves, chopped onions, and green chilies" },
            { step: 4, description: "Add chopped carrots and peas, cook for 5 minutes" },
            { step: 5, description: "Add water and salt, bring to boil" },
            { step: 6, description: "Slowly add roasted semolina while stirring" },
            { step: 7, description: "Cook on low heat until water is absorbed" }
        ],
        nutrition: {
            calories: 250,
            protein: 6,
            carbs: 40,
            fat: 7
        },
        tags: ["indian", "breakfast", "vegetarian", "healthy"]
    },
    {
        title: "Dosa",
        description: "Crispy fermented crepe made from rice and lentil batter",
        image: "https://img.freepik.com/premium-photo/plain-dosa-dish_57665-14912.jpg?w=2000",
        video: "https://www.youtube.com/embed/17uHr9dzN6E",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 480,
        cookTime: 5,
        servings: 4,
        ingredients: [
            { name: "Rice", quantity: "2", unit: "cups" },
            { name: "Urad dal", quantity: "1/2", unit: "cup" },
            { name: "Fenugreek seeds", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Potato filling", quantity: "2", unit: "cups" }
        ],
        instructions: [
            { step: 1, description: "Soak rice and urad dal separately for 6 hours" },
            { step: 2, description: "Grind to smooth batter, add salt and fenugreek" },
            { step: 3, description: "Ferment overnight (8-12 hours)" },
            { step: 4, description: "Heat griddle, pour batter and spread thinly" },
            { step: 5, description: "Cook until golden, add oil if needed" },
            { step: 6, description: "Add potato filling and fold" }
        ],
        nutrition: {
            calories: 180,
            protein: 5,
            carbs: 30,
            fat: 4
        },
        tags: ["indian", "breakfast", "vegetarian", "fermented"]
    },
    {
        title: "Idli",
        description: "Steamed rice cakes made from fermented batter",
        image: "https://shwetainthekitchen.com/wp-content/uploads/2022/01/Idli-720x1080.jpg",
        video: "https://www.youtube.com/embed/SpS1aVHlC7U",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 480,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Rice", quantity: "2", unit: "cups" },
            { name: "Urad dal", quantity: "1/2", unit: "cup" },
            { name: "Fenugreek seeds", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Soak rice and urad dal for 6 hours" },
            { step: 2, description: "Grind to smooth batter, add salt and fenugreek" },
            { step: 3, description: "Ferment overnight" },
            { step: 4, description: "Pour into greased idli molds" },
            { step: 5, description: "Steam for 12-15 minutes" },
            { step: 6, description: "Serve with chutney and sambar" }
        ],
        nutrition: {
            calories: 150,
            protein: 4,
            carbs: 28,
            fat: 2
        },
        tags: ["indian", "breakfast", "vegetarian", "steamed"]
    },
    {
        title: "Vada",
        description: "Crispy lentil fritters with spices",
        image: "https://shwetainthekitchen.com/wp-content/uploads/2022/01/Idli-720x1080.jpg",
        video: "https://www.youtube.com/embed/Eim2GpHNQDg",
        cuisine: "Indian",
        category: "snack",
        difficulty: "medium",
        prepTime: 120,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Urad dal", quantity: "1", unit: "cup" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Green chilies", quantity: "2", unit: "pieces" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Curry leaves", quantity: "10", unit: "leaves" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "cups" }
        ],
        instructions: [
            { step: 1, description: "Soak urad dal for 2 hours" },
            { step: 2, description: "Grind to smooth paste" },
            { step: 3, description: "Add chopped onions, chilies, ginger, curry leaves, salt" },
            { step: 4, description: "Mix well and beat to make fluffy" },
            { step: 5, description: "Shape into balls and flatten" },
            { step: 6, description: "Deep fry until golden brown" }
        ],
        nutrition: {
            calories: 200,
            protein: 8,
            carbs: 20,
            fat: 10
        },
        tags: ["indian", "snack", "vegetarian", "crispy"]
    },
    {
        title: "Dal Tadka",
        description: "Yellow lentils cooked with spices and tempered with ghee",
        image: "https://i2.wp.com/vegecravings.com/wp-content/uploads/2020/01/Moong-Dal-Recipe-Step-By-Step-Instructions-scaled.jpg?w=2560&quality=65&strip=all&ssl=1",
        video: "https://www.youtube.com/embed/8yO8z9Q7z8E",
        cuisine: "Indian",
        category: "main course",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 30,
        servings: 4,
        ingredients: [
            { name: "Yellow lentils (toor dal)", quantity: "1", unit: "cup" },
            { name: "Tomato", quantity: "1", unit: "large" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Ghee", quantity: "2", unit: "tbsp" },
            { name: "Mustard seeds", quantity: "1", unit: "tsp" },
            { name: "Dry red chilies", quantity: "2", unit: "pieces" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Wash and pressure cook lentils with turmeric and water" },
            { step: 2, description: "Mash the cooked lentils and set aside" },
            { step: 3, description: "Heat ghee, add mustard seeds and dry red chilies" },
            { step: 4, description: "Add chopped onions, garlic, ginger, and cook until golden" },
            { step: 5, description: "Add tomatoes, cumin, coriander, and salt" },
            { step: 6, description: "Add mashed lentils and simmer for 10 minutes" },
            { step: 7, description: "Serve hot with rice or roti" }
        ],
        nutrition: {
            calories: 280,
            protein: 15,
            carbs: 35,
            fat: 10
        },
        tags: ["indian", "dal", "vegetarian", "comfort"]
    },
    {
        title: "Rajma",
        description: "Kidney beans cooked in spicy tomato gravy",
        image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/06/Authentic-Punjabi-Rajma-Recipe.jpg",
        video: "https://www.youtube.com/embed/4N7e0pksf6Q",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 480,
        cookTime: 45,
        servings: 4,
        ingredients: [
            { name: "Kidney beans (rajma)", quantity: "1", unit: "cup" },
            { name: "Tomatoes", quantity: "3", unit: "large" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Garam masala", quantity: "1", unit: "tsp" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Soak kidney beans overnight and pressure cook" },
            { step: 2, description: "Blend tomatoes, onions, garlic, ginger to paste" },
            { step: 3, description: "Heat oil, add cumin seeds and paste" },
            { step: 4, description: "Cook paste until oil separates" },
            { step: 5, description: "Add spices and cooked beans" },
            { step: 6, description: "Simmer for 20 minutes until thick" },
            { step: 7, description: "Serve with rice or naan" }
        ],
        nutrition: {
            calories: 320,
            protein: 18,
            carbs: 45,
            fat: 8
        },
        tags: ["indian", "beans", "vegetarian", "spicy"]
    },
    {
        title: "Chole",
        description: "Spicy chickpea curry with aromatic spices",
        image: "https://vegecravings.com/wp-content/uploads/2017/01/chole-recipe-step-by-step-instructions-13.jpg",
        video: "https://www.youtube.com/embed/17uHr9dzN6E",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 480,
        cookTime: 40,
        servings: 4,
        ingredients: [
            { name: "Chickpeas (chole)", quantity: "1", unit: "cup" },
            { name: "Tea bag", quantity: "1", unit: "piece" },
            { name: "Tomatoes", quantity: "2", unit: "large" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Chole masala", quantity: "2", unit: "tbsp" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Soak chickpeas overnight with tea bag" },
            { step: 2, description: "Pressure cook chickpeas until soft" },
            { step: 3, description: "Blend tomatoes, onions, garlic, ginger" },
            { step: 4, description: "Heat oil, add cumin and paste" },
            { step: 5, description: "Cook until oil separates, add spices" },
            { step: 6, description: "Add cooked chickpeas and simmer" },
            { step: 7, description: "Serve with puri or rice" }
        ],
        nutrition: {
            calories: 300,
            protein: 16,
            carbs: 40,
            fat: 9
        },
        tags: ["indian", "chickpeas", "vegetarian", "street"]
    },
    {
        title: "Palak Paneer",
        description: "Cottage cheese cubes in creamy spinach sauce",
        image: "https://latashaskitchen.com/wp-content/uploads/2019/06/SS_533073802_Palak-Paneer_500k.jpg",
        video: "https://www.youtube.com/embed/SpS1aVHlC7U",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        ingredients: [
            { name: "Spinach (palak)", quantity: "500", unit: "g" },
            { name: "Paneer", quantity: "200", unit: "g" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Tomato", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Green chilies", quantity: "2", unit: "pieces" },
            { name: "Cream", quantity: "2", unit: "tbsp" },
            { name: "Garam masala", quantity: "1/2", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Blanch spinach and blend to puree" },
            { step: 2, description: "Cut paneer into cubes and fry lightly" },
            { step: 3, description: "Blend onion, tomato, garlic, ginger, chilies" },
            { step: 4, description: "Heat oil, cook paste until oil separates" },
            { step: 5, description: "Add spinach puree and spices" },
            { step: 6, description: "Add fried paneer and cream" },
            { step: 7, description: "Simmer for 5 minutes and serve" }
        ],
        nutrition: {
            calories: 350,
            protein: 18,
            carbs: 12,
            fat: 25
        },
        tags: ["indian", "paneer", "vegetarian", "creamy"]
    },
    {
        title: "Aloo Gobi",
        description: "Potatoes and cauliflower cooked with spices",
        image: "https://www.veganricha.com/wp-content/uploads/2019/01/Baked-Aloo-Gobi-veganricha-2329-2-2.jpg",
        video: "https://www.youtube.com/embed/Eim2GpHNQDg",
        cuisine: "Indian",
        category: "main course",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        ingredients: [
            { name: "Potatoes", quantity: "3", unit: "medium" },
            { name: "Cauliflower", quantity: "1", unit: "medium" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Tomato", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Cut potatoes and cauliflower into florets" },
            { step: 2, description: "Heat oil, add cumin seeds" },
            { step: 3, description: "Add chopped onions, garlic, ginger" },
            { step: 4, description: "Add tomatoes and spices" },
            { step: 5, description: "Add potatoes and cauliflower" },
            { step: 6, description: "Cook covered until vegetables are tender" },
            { step: 7, description: "Serve with roti or rice" }
        ],
        nutrition: {
            calories: 200,
            protein: 6,
            carbs: 30,
            fat: 8
        },
        tags: ["indian", "vegetables", "vegetarian", "healthy"]
    },
    {
        title: "Baingan Bharta",
        description: "Smoky mashed eggplant with spices",
        image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/baingan-bharta-recipe-1.jpg",
        video: "https://www.youtube.com/embed/8yO8z9Q7z8E",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        ingredients: [
            { name: "Eggplant (baingan)", quantity: "1", unit: "large" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Tomato", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Green chilies", quantity: "2", unit: "pieces" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Roast eggplant over flame until charred" },
            { step: 2, description: "Peel and mash the roasted eggplant" },
            { step: 3, description: "Heat oil, add cumin seeds" },
            { step: 4, description: "Add chopped onions, garlic, ginger, chilies" },
            { step: 5, description: "Add tomatoes and spices" },
            { step: 6, description: "Add mashed eggplant and cook for 10 minutes" },
            { step: 7, description: "Serve with roti or paratha" }
        ],
        nutrition: {
            calories: 150,
            protein: 4,
            carbs: 15,
            fat: 9
        },
        tags: ["indian", "eggplant", "vegetarian", "smoky"]
    },
    {
        title: "Bhindi Masala",
        description: "Spicy stir-fried okra with onions and spices",
        image: "https://i.pinimg.com/originals/be/5d/6d/be5d6dac6cf9a17b16eadfad13976343.jpg",
        video: "https://www.youtube.com/embed/4N7e0pksf6Q",
        cuisine: "Indian",
        category: "main course",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        ingredients: [
            { name: "Okra (bhindi)", quantity: "500", unit: "g" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Tomato", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Wash and slice okra into pieces" },
            { step: 2, description: "Heat oil, add cumin seeds" },
            { step: 3, description: "Add chopped onions, garlic, ginger" },
            { step: 4, description: "Add tomatoes and spices" },
            { step: 5, description: "Add okra and stir-fry" },
            { step: 6, description: "Cook covered until okra is tender" },
            { step: 7, description: "Serve with roti or rice" }
        ],
        nutrition: {
            calories: 120,
            protein: 4,
            carbs: 12,
            fat: 7
        },
        tags: ["indian", "okra", "vegetarian", "stirfry"]
    },
    {
        title: "Kadhi Pakora",
        description: "Yogurt-based curry with crispy fritters",
        image: "https://data.thefeedfeed.com/static/2020/04/03/15859449585e87997e9fb2a.jpg",
        video: "https://www.youtube.com/embed/17uHr9dzN6E",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 30,
        servings: 4,
        ingredients: [
            { name: "Yogurt", quantity: "2", unit: "cups" },
            { name: "Besan (gram flour)", quantity: "1/2", unit: "cup" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Green chilies", quantity: "2", unit: "pieces" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Mustard seeds", quantity: "1", unit: "tsp" },
            { name: "Fenugreek seeds", quantity: "1/2", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Whisk yogurt with besan and water" },
            { step: 2, description: "Make pakora batter with besan, onions, chilies" },
            { step: 3, description: "Deep fry small pakoras" },
            { step: 4, description: "Heat oil, add mustard and fenugreek seeds" },
            { step: 5, description: "Add yogurt mixture and spices" },
            { step: 6, description: "Simmer until thickened" },
            { step: 7, description: "Add fried pakoras and serve" }
        ],
        nutrition: {
            calories: 280,
            protein: 12,
            carbs: 25,
            fat: 15
        },
        tags: ["indian", "yogurt", "vegetarian", "comfort"]
    },
    {
        title: "Butter Chicken",
        description: "Rich and creamy tomato-based curry with chicken",
        image: "https://www.cookingclassy.com/wp-content/uploads/2021/01/butter-chicken-3.jpg",
        video: "https://www.youtube.com/embed/SpS1aVHlC7U",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 30,
        cookTime: 40,
        servings: 4,
        ingredients: [
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Yogurt", quantity: "1/2", unit: "cup" },
            { name: "Tomatoes", quantity: "4", unit: "large" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Butter", quantity: "4", unit: "tbsp" },
            { name: "Cream", quantity: "1/2", unit: "cup" },
            { name: "Garam masala", quantity: "1", unit: "tsp" },
            { name: "Red chili powder", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Marinate chicken in yogurt and spices" },
            { step: 2, description: "Blend tomatoes, onions, garlic, ginger" },
            { step: 3, description: "Cook chicken until tender" },
            { step: 4, description: "Heat butter, cook tomato paste" },
            { step: 5, description: "Add spices and cooked chicken" },
            { step: 6, description: "Add cream and simmer" },
            { step: 7, description: "Serve with naan or rice" }
        ],
        nutrition: {
            calories: 450,
            protein: 35,
            carbs: 15,
            fat: 30
        },
        tags: ["indian", "chicken", "creamy", "rich"]
    },
    {
        title: "Fish Curry",
        description: "Spicy and tangy fish cooked in coconut milk",
        image: "http://wildgreensandsardines.com/wp-content/uploads/2020/03/Kerala-Fish-Curry_8957.jpg",
        video: "https://www.youtube.com/embed/Eim2GpHNQDg",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 25,
        servings: 4,
        ingredients: [
            { name: "Fish fillets", quantity: "500", unit: "g" },
            { name: "Coconut milk", quantity: "1", unit: "cup" },
            { name: "Tomatoes", quantity: "2", unit: "large" },
            { name: "Onions", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Turmeric", quantity: "1/2", unit: "tsp" },
            { name: "Red chili powder", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Clean and cut fish into pieces" },
            { step: 2, description: "Blend tomatoes, onions, garlic, ginger" },
            { step: 3, description: "Heat oil, cook paste until oil separates" },
            { step: 4, description: "Add spices and coconut milk" },
            { step: 5, description: "Add fish pieces gently" },
            { step: 6, description: "Simmer until fish is cooked" },
            { step: 7, description: "Serve with rice" }
        ],
        nutrition: {
            calories: 320,
            protein: 28,
            carbs: 12,
            fat: 18
        },
        tags: ["indian", "fish", "coconut", "spicy"]
    },
    {
        title: "Jeera Rice",
        description: "Fragrant basmati rice cooked with cumin seeds",
        image: "https://myfoodstory.com/wp-content/uploads/2018/07/Perfect-Jeera-Rice-Indian-Cumin-Rice-3-1080x617.jpg",
        video: "https://www.youtube.com/embed/8yO8z9Q7z8E",
        cuisine: "Indian",
        category: "main course",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        ingredients: [
            { name: "Basmati rice", quantity: "1", unit: "cup" },
            { name: "Cumin seeds", quantity: "1", unit: "tsp" },
            { name: "Ghee", quantity: "2", unit: "tbsp" },
            { name: "Bay leaf", quantity: "1", unit: "piece" },
            { name: "Cloves", quantity: "2", unit: "pieces" },
            { name: "Cinnamon", quantity: "1", unit: "inch" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Water", quantity: "2", unit: "cups" }
        ],
        instructions: [
            { step: 1, description: "Wash and soak rice for 30 minutes" },
            { step: 2, description: "Heat ghee, add cumin seeds and whole spices" },
            { step: 3, description: "Add drained rice and sauté for 2 minutes" },
            { step: 4, description: "Add water and salt" },
            { step: 5, description: "Bring to boil, then simmer covered" },
            { step: 6, description: "Cook until water is absorbed and rice is fluffy" },
            { step: 7, description: "Serve hot with curry" }
        ],
        nutrition: {
            calories: 220,
            protein: 4,
            carbs: 40,
            fat: 6
        },
        tags: ["indian", "rice", "side", "fragrant"]
    },
    {
        title: "Biryani",
        description: "Aromatic layered rice dish with marinated meat and spices",
        image: "https://media.istockphoto.com/photos/vegetable-biryani-picture-id618323650?k=6&m=618323650&s=612x612&w=0&h=HwxGUyMM75V2WJ9xhkt5KELx6dixoWF59EQHd30AH1U=",
        video: "https://www.youtube.com/embed/4N7e0pksf6Q",
        cuisine: "Indian",
        category: "main course",
        difficulty: "hard",
        prepTime: 60,
        cookTime: 60,
        servings: 6,
        ingredients: [
            { name: "Basmati rice", quantity: "2", unit: "cups" },
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Yogurt", quantity: "1/2", unit: "cup" },
            { name: "Onions", quantity: "3", unit: "large" },
            { name: "Tomatoes", quantity: "2", unit: "large" },
            { name: "Garlic", quantity: "6", unit: "cloves" },
            { name: "Ginger", quantity: "2", unit: "inch" },
            { name: "Biryani masala", quantity: "2", unit: "tbsp" },
            { name: "Turmeric", quantity: "1", unit: "tsp" },
            { name: "Saffron", quantity: "1/4", unit: "tsp" },
            { name: "Milk", quantity: "2", unit: "tbsp" },
            { name: "Ghee", quantity: "4", unit: "tbsp" },
            { name: "Fried onions", quantity: "1/2", unit: "cup" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Marinate chicken with yogurt and spices" },
            { step: 2, description: "Cook basmati rice with whole spices until 70% done" },
            { step: 3, description: "Cook marinated chicken with onions and tomatoes" },
            { step: 4, description: "Layer rice and chicken in a pot" },
            { step: 5, description: "Add saffron milk and ghee" },
            { step: 6, description: "Seal and cook on low heat (dum)" },
            { step: 7, description: "Serve with raita and salad" }
        ],
        nutrition: {
            calories: 450,
            protein: 25,
            carbs: 50,
            fat: 18
        },
        tags: ["indian", "rice", "chicken", "aromatic"]
    },
    {
        title: "Roti",
        description: "Whole wheat flatbread cooked on griddle",
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230613/pngtree-stack-of-indian-roti-image_2906836.jpg",
        video: "https://www.youtube.com/embed/17uHr9dzN6E",
        cuisine: "Indian",
        category: "bread",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 5,
        servings: 4,
        ingredients: [
            { name: "Whole wheat flour", quantity: "2", unit: "cups" },
            { name: "Water", quantity: "3/4", unit: "cup" },
            { name: "Salt", quantity: "1/2", unit: "tsp" },
            { name: "Oil", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Mix flour, salt, and water to make dough" },
            { step: 2, description: "Knead until smooth, rest for 15 minutes" },
            { step: 3, description: "Divide into balls and roll into circles" },
            { step: 4, description: "Heat griddle, cook roti on both sides" },
            { step: 5, description: "Apply ghee or oil while cooking" },
            { step: 6, description: "Serve hot with curry" }
        ],
        nutrition: {
            calories: 150,
            protein: 5,
            carbs: 28,
            fat: 2
        },
        tags: ["indian", "bread", "vegetarian", "daily"]
    },
    {
        title: "Paratha",
        description: "Layered flatbread with ghee, often stuffed",
        image: "https://www.thedeliciouscrescent.com/wp-content/uploads/2020/06/Paratha-Square.jpg",
        video: "https://www.youtube.com/embed/SpS1aVHlC7U",
        cuisine: "Indian",
        category: "bread",
        difficulty: "medium",
        prepTime: 30,
        cookTime: 10,
        servings: 4,
        ingredients: [
            { name: "Whole wheat flour", quantity: "2", unit: "cups" },
            { name: "Water", quantity: "3/4", unit: "cup" },
            { name: "Salt", quantity: "1/2", unit: "tsp" },
            { name: "Ghee", quantity: "4", unit: "tbsp" },
            { name: "Oil", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Make dough with flour, water, salt" },
            { step: 2, description: "Rest dough for 15 minutes" },
            { step: 3, description: "Roll out thin, apply ghee, fold into layers" },
            { step: 4, description: "Roll again into thicker circle" },
            { step: 5, description: "Cook on hot griddle with ghee" },
            { step: 6, description: "Press with spatula until golden" },
            { step: 7, description: "Serve with pickle or curry" }
        ],
        nutrition: {
            calories: 250,
            protein: 6,
            carbs: 35,
            fat: 10
        },
        tags: ["indian", "bread", "layered", "ghee"]
    },
    {
        title: "Gulab Jamun",
        description: "Sweet dumplings soaked in rose-flavored syrup",
        image: "https://www.cookwithnabeela.com/wp-content/uploads/2024/02/GulabJamun2-.webp",
        video: "https://www.youtube.com/embed/8yO8z9Q7z8E",
        cuisine: "Indian",
        category: "dessert",
        difficulty: "medium",
        prepTime: 30,
        cookTime: 30,
        servings: 6,
        ingredients: [
            { name: "Milk powder", quantity: "1", unit: "cup" },
            { name: "All-purpose flour", quantity: "1/4", unit: "cup" },
            { name: "Baking soda", quantity: "1/4", unit: "tsp" },
            { name: "Milk", quantity: "1/4", unit: "cup" },
            { name: "Ghee", quantity: "2", unit: "tbsp" },
            { name: "Sugar", quantity: "2", unit: "cups" },
            { name: "Water", quantity: "2", unit: "cups" },
            { name: "Rose essence", quantity: "1", unit: "tsp" },
            { name: "Cardamom", quantity: "4", unit: "pods" },
            { name: "Oil", quantity: "2", unit: "cups" }
        ],
        instructions: [
            { step: 1, description: "Mix milk powder, flour, and baking soda" },
            { step: 2, description: "Add milk and ghee to make soft dough" },
            { step: 3, description: "Knead well and let rest for 10 minutes" },
            { step: 4, description: "Make small balls without cracks" },
            { step: 5, description: "Heat oil and fry balls until golden" },
            { step: 6, description: "Make sugar syrup with water, sugar, cardamom" },
            { step: 7, description: "Add rose essence to syrup" },
            { step: 8, description: "Soak fried balls in warm syrup for 2 hours" },
            { step: 9, description: "Serve warm or chilled" }
        ],
        nutrition: {
            calories: 280,
            protein: 4,
            carbs: 45,
            fat: 10
        },
        tags: ["indian", "sweet", "dumplings", "festive"]
    }
];

module.exports = sampleRecipes;
