const sampleRecipes = [
    {
        title: "Classic Margherita Pizza",
        description: "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil",
        translations: {
            hi: {
                title: "क्लासिक मार्गेरिटा पिज़्ज़ा",
                description: "ताज़े टमाटर, मोज़रेला और तुलसी के साथ एक पारंपरिक इतालवी पिज़्ज़ा",
                ingredients: [
                    { name: "पिज़्ज़ा आटा", quantity: "1", unit: "गेंद" },
                    { name: "सैन मार्ज़ानो टमाटर", quantity: "400", unit: "ग्राम" },
                    { name: "ताज़ी मोज़रेला", quantity: "250", unit: "ग्राम" },
                    { name: "ताज़ी तुलसी पत्तियाँ", quantity: "20", unit: "पत्तियाँ" },
                    { name: "एक्स्ट्रा वर्जिन ऑलिव ऑयल", quantity: "3", unit: "टेबलस्पून" },
                    { name: "लहसुन", quantity: "2", unit: "कलियाँ" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1/2", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "ओवन को 250°C (480°F) पर प्रीहीट करें" },
                    { step: 2, description: "मैदे वाली सतह पर पिज़्ज़ा आटा बेलें" },
                    { step: 3, description: "टमाटर कुचलें और आटे पर फैलाएं" },
                    { step: 4, description: "मोज़रेला फाड़ें और समान रूप से बाँटें" },
                    { step: 5, description: "क्रस्ट सुनहरा होने तक 12-15 मिनट तक बेक करें" },
                    { step: 6, description: "ताज़ी तुलसी से टॉप करें और ऑलिव ऑयल ड्रिज़ल करें" }
                ]
            }
        },
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
        translations: {
            hi: {
                title: "चिकन टिक्का मसाला",
                description: "क्रीमी और स्वादिष्ट भारतीय करी ग्रिल्ड चिकन के साथ",
                ingredients: [
                    { name: "चिकन ब्रेस्ट", quantity: "500", unit: "g" },
                    { name: "दही", quantity: "200", unit: "g" },
                    { name: "हैवी क्रीम", quantity: "200", unit: "ml" },
                    { name: "टमाटर प्यूरी", quantity: "400", unit: "g" },
                    { name: "प्याज", quantity: "2", unit: "medium" },
                    { name: "लहसुन", quantity: "4", unit: "cloves" },
                    { name: "अदरक", quantity: "2", unit: "tbsp" },
                    { name: "गरम मसाला", quantity: "2", unit: "tsp" },
                    { name: "हल्दी", quantity: "1", unit: "tsp" },
                    { name: "जीरा", quantity: "1", unit: "tsp" },
                    { name: "धनिया", quantity: "1", unit: "tsp" },
                    { name: "मक्खन", quantity: "3", unit: "tbsp" }
                ],
                instructions: [
                    { step: 1, description: "चिकन को दही और मसालों में 30 मिनट के लिए मैरिनेट करें" },
                    { step: 2, description: "चिकन को तब तक ग्रिल करें जब तक वह पक न जाए" },
                    { step: 3, description: "मक्खन में प्याज, लहसुन और अदरक को सॉटे करें" },
                    { step: 4, description: "2 मिनट के लिए मसाले जोड़ें और पकाएं" },
                    { step: 5, description: "टमाटर प्यूरी जोड़ें और 10 मिनट तक सिमर करें" },
                    { step: 6, description: "क्रीम और पकाया हुआ चिकन जोड़ें, 5 मिनट तक सिमर करें" }
                ]
            }
        },
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/qHkpcKmjdeE",
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
        video: "https://www.youtube.com/embed/PFJAuAWxuvI",
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
        tags: ["cookies", "dessert", "chocolate", "baking"],
        translations: {
            hi: {
                title: "चॉकलेट चिप कुकीज़",
                description: "क्लासिक नरम और चबाने वाली चॉकलेट चिप कुकीज़",
                ingredients: [
                    { name: "सर्व-उद्देश्यीय आटा", quantity: "2 1/4", unit: "कप" },
                    { name: "बेकिंग सोडा", quantity: "1", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "मक्खन", quantity: "1", unit: "कप" },
                    { name: "ब्राउन शुगर", quantity: "3/4", unit: "कप" },
                    { name: "व्हाइट शुगर", quantity: "3/4", unit: "कप" },
                    { name: "वेनिला एक्सट्रेक्ट", quantity: "2", unit: "टीस्पून" },
                    { name: "अंडे", quantity: "2", unit: "बड़े" },
                    { name: "चॉकलेट चिप्स", quantity: "2", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "ओवन को 375°F (190°C) पर प्रीहीट करें" },
                    { step: 2, description: "मक्खन और शुगर को एक साथ क्रीम करें" },
                    { step: 3, description: "अंडे और वेनिला में बीट करें" },
                    { step: 4, description: "आटा, बेकिंग सोडा और नमक मिलाएं" },
                    { step: 5, description: "चॉकलेट चिप्स मिलाएं" },
                    { step: 6, description: "बेकिंग शीट पर ड्रॉप करें और 9-11 मिनट तक बेक करें" }
                ]
            }
        }
    },
    {
        title: "Fresh Garden Salad",
        description: "Healthy and refreshing salad with mixed greens and vegetables",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/0ASHEYGCotc",
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
        tags: ["salad", "healthy", "vegetarian", "fresh"],
        translations: {
            hi: {
                title: "ताज़ा बाग़ीचा सलाद",
                description: "मिश्रित ग्रीन्स और सब्जियों के साथ स्वस्थ और ताज़ा सलाद",
                ingredients: [
                    { name: "मिश्रित ग्रीन्स", quantity: "200", unit: "ग्राम" },
                    { name: "चेरी टमाटर", quantity: "150", unit: "ग्राम" },
                    { name: "खीरा", quantity: "1", unit: "मध्यम" },
                    { name: "लाल प्याज", quantity: "1/2", unit: "छोटा" },
                    { name: "बेल पेपर", quantity: "1", unit: "मध्यम" },
                    { name: "जैतून का तेल", quantity: "3", unit: "टेबलस्पून" },
                    { name: "नींबू का रस", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1/2", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "सभी सब्जियों को धोएं और काटें" },
                    { step: 2, description: "ग्रीन्स, टमाटर, खीरा, प्याज और बेल पेपर को मिलाएं" },
                    { step: 3, description: "जैतून का तेल, नींबू का रस, नमक और काली मिर्च को एक साथ व्हिस्क करें" },
                    { step: 4, description: "सलाद को ड्रेसिंग के साथ टॉस करें और तुरंत सर्व करें" }
                ]
            }
        }
    },
    {
        title: "Poha",
        description: "Fluffy flattened rice cooked with vegetables and spices",
        image: "https://1.bp.blogspot.com/-bspriSOBAPo/XYmCqbFDZ4I/AAAAAAAAbLE/-V7HKUgNwGME6yaJ5hmQ_L5Z0cYsVeuoACLcBGAsYHQ/s1600/20190921_115653.jpg",
        video: "https://www.youtube.com/embed/VKvwWeVy8Nw",
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
        tags: ["indian", "breakfast", "vegetarian", "quick"],
        translations: {
            hi: {
                title: "पोहा",
                description: "सब्जियों और मसालों के साथ पकाया गया फुल्फी फ्लैटन राइस",
                ingredients: [
                    { name: "फ्लैटन राइस (पोहा)", quantity: "2", unit: "कप" },
                    { name: "आलू", quantity: "2", unit: "मध्यम" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "हरी मिर्च", quantity: "2", unit: "टुकड़े" },
                    { name: "मूंगफली", quantity: "1/4", unit: "कप" },
                    { name: "सरसों के बीज", quantity: "1", unit: "टीस्पून" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "नींबू का रस", quantity: "1", unit: "टेबलस्पून" },
                    { name: "धनिया पत्तियाँ", quantity: "2", unit: "टेबलस्पून" }
                ],
                instructions: [
                    { step: 1, description: "पोहा को धोएं और 5 मिनट के लिए भिगोएं, फिर निकालें" },
                    { step: 2, description: "तेल गरम करें और सरसों के बीज डालें, उन्हें चटकने दें" },
                    { step: 3, description: "मूंगफली डालें और सुनहरे होने तक फ्राई करें" },
                    { step: 4, description: "कटे हुए प्याज, हरी मिर्च डालें, और प्याज नरम होने तक पकाएं" },
                    { step: 5, description: "डाइस किए हुए आलू, हल्दी और नमक डालें, आलू नरम होने तक पकाएं" },
                    { step: 6, description: "भिगोया हुआ पोहा डालें और धीरे से मिलाएं" },
                    { step: 7, description: "2-3 मिनट तक पकाएं, नींबू का रस और धनिया डालें" }
                ]
            }
        }
    },
    {
        title: "Upma",
        description: "Savory semolina dish with vegetables and spices",
        image: "https://images.aws.nestle.recipes/resized/ba32df908435796279e3d79f0d5fbdc1_Rava_Upma_-_Twist_944_531.jpg",
        video: "https://www.youtube.com/embed/R6vk6EbhXL8",
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
        tags: ["indian", "breakfast", "vegetarian", "healthy"],
        translations: {
            hi: {
                title: "उपमा",
                description: "सब्जियों और मसालों के साथ स्वादिष्ट सेमोलिना डिश",
                ingredients: [
                    { name: "सेमोलिना (सूजी)", quantity: "1", unit: "कप" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "गाजर", quantity: "1", unit: "मध्यम" },
                    { name: "हरी मटर", quantity: "1/2", unit: "कप" },
                    { name: "हरी मिर्च", quantity: "2", unit: "टुकड़े" },
                    { name: "सरसों के बीज", quantity: "1", unit: "टीस्पून" },
                    { name: "उरद दाल", quantity: "1", unit: "टीस्पून" },
                    { name: "करी पत्तियाँ", quantity: "8-10", unit: "पत्तियाँ" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "पानी", quantity: "2", unit: "कप" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "सेमोलिना को हल्का सुनहरा होने तक ड्राई रोस्ट करें, अलग रखें" },
                    { step: 2, description: "तेल गरम करें, सरसों के बीज और उरद दाल डालें" },
                    { step: 3, description: "करी पत्तियाँ, कटे हुए प्याज और हरी मिर्च डालें" },
                    { step: 4, description: "कटे हुए गाजर और मटर डालें, 5 मिनट तक पकाएं" },
                    { step: 5, description: "पानी और नमक डालें, उबाल लाएं" },
                    { step: 6, description: "रोस्ट किए हुए सेमोलिना को धीरे धीरे डालें जबकि हिलाते रहें" },
                    { step: 7, description: "पानी समाप्त होने तक कम आंच पर पकाएं" }
                ]
            }
        }
    },
    {
        title: "Dosa",
        description: "Crispy fermented crepe made from rice and lentil batter",
        image: "https://img.freepik.com/premium-photo/plain-dosa-dish_57665-14912.jpg?w=2000",
        video: "https://www.youtube.com/embed/CCab5oh0ZOc",
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
        tags: ["indian", "breakfast", "vegetarian", "fermented"],
        translations: {
            hi: {
                title: "डोसा",
                description: "चावल और दाल के घोल से बनी क्रिस्पी फर्मेंटेड क्रेप",
                ingredients: [
                    { name: "चावल", quantity: "2", unit: "कप" },
                    { name: "उरद दाल", quantity: "1/2", unit: "कप" },
                    { name: "मेथी के बीज", quantity: "1", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "आलू भरावन", quantity: "2", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "चावल और उरद दाल को अलग अलग 6 घंटे के लिए भिगोएं" },
                    { step: 2, description: "स्मूथ घोल में पीसें, नमक और मेथी डालें" },
                    { step: 3, description: "रात भर फर्मेंट करें (8-12 घंटे)" },
                    { step: 4, description: "ग्रिडल गरम करें, घोल डालें और पतला फैलाएं" },
                    { step: 5, description: "सुनहरा होने तक पकाएं, जरूरत पड़ने पर तेल डालें" },
                    { step: 6, description: "आलू भरावन डालें और मोड़ें" }
                ]
            }
        }
    },
    {
        title: "Idli",
        description: "Steamed rice cakes made from fermented batter",
        translations: {
            hi: {
                title: "इडली",
                description: "किण्वित घोल से बने भाप वाले चावल के केक",
                ingredients: [
                    { name: "चावल", quantity: "2", unit: "कप" },
                    { name: "उरद दाल", quantity: "1/2", unit: "कप" },
                    { name: "मेथी के बीज", quantity: "1", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "चावल और उरद दाल को अलग अलग 6 घंटे के लिए भिगोएं" },
                    { step: 2, description: "स्मूथ घोल में पीसें, नमक और मेथी डालें" },
                    { step: 3, description: "रात भर किण्वित करें" },
                    { step: 4, description: "ग्रीस किए हुए इडली मोल्ड में डालें" },
                    { step: 5, description: "12-15 मिनट तक भाप दें" },
                    { step: 6, description: "चटनी और साम्बर के साथ सर्व करें" }
                ]
            }
        },
        image: "https://shwetainthekitchen.com/wp-content/uploads/2022/01/Idli-720x1080.jpg",
        video: "https://www.youtube.com/embed/IMesVgWqrRw",
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
        translations: {
            hi: {
                title: "वड़ा",
                description: "मसालों के साथ क्रिस्पी दाल के फ्रिटर",
                ingredients: [
                    { name: "उरद दाल", quantity: "1", unit: "कप" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "हरी मिर्च", quantity: "2", unit: "टुकड़े" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "करी पत्तियाँ", quantity: "10", unit: "पत्तियाँ" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "उरद दाल को 2 घंटे के लिए भिगोएं" },
                    { step: 2, description: "स्मूथ पेस्ट में पीसें" },
                    { step: 3, description: "कटे हुए प्याज, मिर्च, अदरक, करी पत्तियाँ और नमक डालें" },
                    { step: 4, description: "अच्छी तरह मिलाएं और फुल्फी बनाने के लिए बीट करें" },
                    { step: 5, description: "गोल आकार में बनाएं और सपाट करें" },
                    { step: 6, description: "सुनहरे भूरे होने तक डीप फ्राई करें" }
                ]
            }
        },
        image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/vada-recipe-1.jpg",
        video: "https://www.youtube.com/embed/Zjm9fQBBHiM",
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
        video: "https://www.youtube.com/embed/6yd5c66_IyU",
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
        tags: ["indian", "dal", "vegetarian", "comfort"],
        translations: {
            hi: {
                title: "दाल तड़का",
                description: "मसालों के साथ पकाई गई पीली दाल जिसमें घी का तड़का लगाया जाता है",
                ingredients: [
                    { name: "पीली दाल (अरहर दाल)", quantity: "1", unit: "कप" },
                    { name: "टमाटर", quantity: "1", unit: "बड़ा" },
                    { name: "प्याज", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "3", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "धनिया पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "घी", quantity: "2", unit: "टेबलस्पून" },
                    { name: "सरसों के बीज", quantity: "1", unit: "टीस्पून" },
                    { name: "सूखी लाल मिर्च", quantity: "2", unit: "टुकड़े" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "दाल को धोकर हल्दी और पानी के साथ प्रेशर कुकर में पकाएं।" },
                    { step: 2, description: "पकी हुई दाल को मैश करें और अलग रख दें।" },
                    { step: 3, description: "एक पैन में घी गरम करें, सरसों के बीज और सूखी लाल मिर्च डालें।" },
                    { step: 4, description: "कटा हुआ प्याज, लहसुन और अदरक डालें और सुनहरा होने तक भूनें।" },
                    { step: 5, description: "टमाटर, जीरा, धनिया और नमक डालें और कुछ देर पकाएं।" },
                    { step: 6, description: "अब इसमें मैश की हुई दाल डालें और 10 मिनट तक धीमी आँच पर पकाएं।" },
                    { step: 7, description: "गरमागरम दाल तड़का चावल या रोटी के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Rajma",
        description: "Kidney beans cooked in spicy tomato gravy",
        image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/06/Authentic-Punjabi-Rajma-Recipe.jpg",
        video: "https://www.youtube.com/embed/DsZr3U4Clf0",
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
        tags: ["indian", "beans", "vegetarian", "spicy"],
        translations: {
            hi: {
                title: "राजमा",
                description: "मसालेदार टमाटर की ग्रेवी में पकाई गई स्वादिष्ट राजमा की करी",
                ingredients: [
                    { name: "राजमा", quantity: "1", unit: "कप" },
                    { name: "टमाटर", quantity: "3", unit: "बड़े" },
                    { name: "प्याज", quantity: "2", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "4", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "गरम मसाला", quantity: "1", unit: "टीस्पून" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "धनिया पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "राजमा को रातभर भिगो दें और फिर प्रेशर कुकर में नरम होने तक पकाएं।" },
                    { step: 2, description: "टमाटर, प्याज, लहसुन और अदरक को मिक्सर में पीसकर पेस्ट बना लें।" },
                    { step: 3, description: "एक कढ़ाई में तेल गरम करें, उसमें जीरा डालें और पेस्ट डालें।" },
                    { step: 4, description: "पेस्ट को तब तक पकाएं जब तक तेल अलग न हो जाए।" },
                    { step: 5, description: "अब मसाले और पकी हुई राजमा डालें और मिलाएं।" },
                    { step: 6, description: "20 मिनट तक धीमी आँच पर पकाएं जब तक ग्रेवी गाढ़ी न हो जाए।" },
                    { step: 7, description: "गरमागरम राजमा को चावल या नान के साथ परोसें।" }
                ]
            }
        }
    },

    {
        title: "Chole",
        description: "Spicy chickpea curry with aromatic spices",
        image: "https://vegecravings.com/wp-content/uploads/2017/01/chole-recipe-step-by-step-instructions-13.jpg",
        video: "https://www.youtube.com/embed/OXBV80yhPrM",
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
        tags: ["indian", "chickpeas", "vegetarian", "street"],
        translations: {
            hi: {
                title: "छोले",
                description: "खुशबूदार मसालों में पके हुए मसालेदार चने की स्वादिष्ट करी",
                ingredients: [
                    { name: "काबुली चना (छोले)", quantity: "1", unit: "कप" },
                    { name: "टी बैग", quantity: "1", unit: "पीस" },
                    { name: "टमाटर", quantity: "2", unit: "बड़े" },
                    { name: "प्याज", quantity: "2", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "4", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "छोले मसाला", quantity: "2", unit: "टेबलस्पून" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "काबुली चने को रातभर टी बैग के साथ भिगोकर रखें ताकि रंग और स्वाद अच्छे आएं।" },
                    { step: 2, description: "भिगोए हुए चनों को प्रेशर कुकर में नरम होने तक पकाएं।" },
                    { step: 3, description: "टमाटर, प्याज, लहसुन और अदरक को मिक्सर में पीसकर पेस्ट बना लें।" },
                    { step: 4, description: "एक पैन में तेल गरम करें, उसमें जीरा डालें और फिर पेस्ट डालें।" },
                    { step: 5, description: "पेस्ट को तब तक पकाएं जब तक तेल अलग न हो जाए, फिर मसाले डालें।" },
                    { step: 6, description: "पके हुए चने डालें और थोड़ी देर धीमी आँच पर पकाएं ताकि स्वाद मिल जाए।" },
                    { step: 7, description: "गरमागरम छोले को पुरी या चावल के साथ परोसें।" }
                ]
            }
        }
    },

    {
        title: "Palak Paneer",
        description: "Cottage cheese cubes in creamy spinach sauce",
        image: "https://latashaskitchen.com/wp-content/uploads/2019/06/SS_533073802_Palak-Paneer_500k.jpg",
        video: "https://www.youtube.com/embed/a5sr50WL1DY",
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
        tags: ["indian", "paneer", "vegetarian", "creamy"],
        translations: {
            hi: {
                title: "पालक पनीर",
                description: "मखमली पालक की ग्रेवी में डूबे स्वादिष्ट पनीर के टुकड़े — उत्तर भारतीय व्यंजनों की पहचान।",
                ingredients: [
                    { name: "पालक", quantity: "500", unit: "ग्राम" },
                    { name: "पनीर", quantity: "200", unit: "ग्राम" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "टमाटर", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "3", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "हरी मिर्च", quantity: "2", unit: "पीस" },
                    { name: "क्रीम", quantity: "2", unit: "टेबलस्पून" },
                    { name: "गरम मसाला", quantity: "1/2", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "पालक को उबालकर ठंडे पानी में डालें और फिर मिक्सर में पीसकर प्यूरी बना लें।" },
                    { step: 2, description: "पनीर को छोटे टुकड़ों में काटें और हल्का सुनहरा होने तक फ्राई करें।" },
                    { step: 3, description: "प्याज, टमाटर, लहसुन, अदरक और हरी मिर्च को पीसकर पेस्ट तैयार करें।" },
                    { step: 4, description: "एक पैन में तेल गरम करें, पेस्ट डालें और तब तक पकाएं जब तक तेल अलग न हो जाए।" },
                    { step: 5, description: "अब पालक की प्यूरी और मसाले डालें, अच्छे से मिलाएं।" },
                    { step: 6, description: "तले हुए पनीर और क्रीम डालकर मिलाएं।" },
                    { step: 7, description: "5 मिनट धीमी आँच पर पकाएं और गरमागरम परोसें।" }
                ]
            }
        }
    },

    {
        title: "Aloo Gobi",
        description: "Potatoes and cauliflower cooked with spices",
        image: "https://www.veganricha.com/wp-content/uploads/2019/01/Baked-Aloo-Gobi-veganricha-2329-2-2.jpg",
        video: "https://www.youtube.com/embed/a6YH0sRbgRE",
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
        tags: ["indian", "vegetables", "vegetarian", "healthy"],
        translations: {
            hi: {
                title: "आलू गोभी",
                description: "मसालों के साथ पकाई गई आलू और गोभी की स्वादिष्ट सब्ज़ी — घर का पारंपरिक स्वाद।",
                ingredients: [
                    { name: "आलू", quantity: "3", unit: "मध्यम" },
                    { name: "गोभी", quantity: "1", unit: "मध्यम" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "टमाटर", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "3", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "धनिया पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "आलू और गोभी को धोकर टुकड़ों में काट लें।" },
                    { step: 2, description: "एक कढ़ाई में तेल गरम करें और उसमें जीरा डालें।" },
                    { step: 3, description: "अब कटा हुआ प्याज, लहसुन और अदरक डालकर सुनहरा होने तक भूनें।" },
                    { step: 4, description: "टमाटर और सभी मसाले डालें और तब तक पकाएं जब तक मसाला पक न जाए।" },
                    { step: 5, description: "अब आलू और गोभी डालें और अच्छे से मिलाएं।" },
                    { step: 6, description: "ढककर धीमी आँच पर तब तक पकाएं जब तक सब्ज़ियाँ नरम न हो जाएँ।" },
                    { step: 7, description: "गरमागरम आलू गोभी को रोटी या चावल के साथ परोसें।" }
                ]
            }
        }
    },

    {
        title: "Baingan Bharta",
        description: "Smoky mashed eggplant with spices",
        image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/baingan-bharta-recipe-1.jpg",
        video: "https://www.youtube.com/embed/oEOzzoAM7Sc",
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
        tags: ["indian", "eggplant", "vegetarian", "smoky"],
        translations: {
            hi: {
                title: "बैंगन का भरता",
                description: "धुएँ का स्वाद वाला मसालेदार मैश्ड बैंगन।",
                ingredients: [
                    { name: "बैंगन", quantity: "1", unit: "बड़ा" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "टमाटर", quantity: "1", unit: "बड़ा" },
                    { name: "लहसुन", quantity: "3", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "हरी मिर्च", quantity: "2", unit: "पिस्से" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "धनिया पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "बैंगन को आग पर भूनें जब तक कि वह जलकर चारकोल जैसा न हो जाए।" },
                    { step: 2, description: "भुने हुए बैंगन का छिलका निकालें और मैश करें।" },
                    { step: 3, description: "तेल गरम करें और उसमें जीरा डालें।" },
                    { step: 4, description: "कटा प्याज, लहसुन, अदरक और हरी मिर्च डालकर सुनहरा होने तक भूनें।" },
                    { step: 5, description: "टमाटर और मसाले डालकर नरम होने तक पकाएँ।" },
                    { step: 6, description: "मैश किया हुआ बैंगन डालें और 10 मिनट तक पकाएँ।" },
                    { step: 7, description: "गरमागरम रोटियों या पराठों के साथ परोसें।" }
                ]
            }
        }
    },

    {
        title: "Bhindi Masala",
        description: "Spicy stir-fried okra with onions and spices",
        image: "https://i.pinimg.com/originals/be/5d/6d/be5d6dac6cf9a17b16eadfad13976343.jpg",
        video: "https://www.youtube.com/embed/qHDLUKHmOc4",
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
        tags: ["indian", "okra", "vegetarian", "stirfry"],
        translations: {
            hi: {
                title: "भिंडी मसाला",
                description: "प्याज और मसालों के साथ मसालेदार भुनी हुई भिंडी।",
                ingredients: [
                    { name: "भिंडी", quantity: "500", unit: "ग्राम" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "टमाटर", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "3", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "धनिया पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "भिंडी को धोकर टुकड़ों में काट लें।" },
                    { step: 2, description: "तेल गरम करें और उसमें जीरा डालें।" },
                    { step: 3, description: "कटा हुआ प्याज, लहसुन और अदरक डालें और भूनें।" },
                    { step: 4, description: "टमाटर और मसाले डालें।" },
                    { step: 5, description: "भिंडी डालकर चलाते हुए भूनें।" },
                    { step: 6, description: "ढककर तब तक पकाएँ जब तक भिंडी नरम न हो जाए।" },
                    { step: 7, description: "गरमागरम रोटी या चावल के साथ परोसें।" }
                ]
            }
        }
    },

    {
        title: "Kadhi Pakora",
        description: "Yogurt-based curry with crispy fritters",
        image: "https://data.thefeedfeed.com/static/2020/04/03/15859449585e87997e9fb2a.jpg",
        video: "https://www.youtube.com/embed/OanmrmL67xU",
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
        tags: ["indian", "yogurt", "vegetarian", "comfort"],
        translations: {
            hi: {
                title: "कढ़ी पकोड़ा",
                description: "दही आधारित करी जिसमें कुरकुरे पकोड़े होते हैं।",
                ingredients: [
                    { name: "दही", quantity: "2", unit: "कप" },
                    { name: "बेसन", quantity: "1/2", unit: "कप" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "हरी मिर्च", quantity: "2", unit: "पिस्से" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "सरसों के बीज", quantity: "1", unit: "टीस्पून" },
                    { name: "मेथी के बीज", quantity: "1/2", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "दही को बेसन और पानी के साथ फेंटें।" },
                    { step: 2, description: "बेसन, प्याज और हरी मिर्च से पकोड़े का घोल तैयार करें।" },
                    { step: 3, description: "छोटे पकोड़े डीप फ्राई करें।" },
                    { step: 4, description: "तेल गरम करें और उसमें सरसों और मेथी के बीज डालें।" },
                    { step: 5, description: "दही का मिश्रण और मसाले डालें।" },
                    { step: 6, description: "मध्यम आंच पर गाढ़ा होने तक पकाएँ।" },
                    { step: 7, description: "तले हुए पकोड़े डालें और परोसें।" }
                ]
            }
        }
    },
    {
        title: "Butter Chicken",
        description: "Rich and creamy tomato-based curry with chicken",
        image: "https://www.cookingclassy.com/wp-content/uploads/2021/01/butter-chicken-3.jpg",
        video: "https://www.youtube.com/embed/a03U45jFxOI",
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
        tags: ["indian", "chicken", "creamy", "rich"],
        translations: {
            hi: {
                title: "बटर चिकन",
                description: "मसालेदार और क्रीमी टमाटर आधारित चिकन करी।",
                ingredients: [
                    { name: "चिकन", quantity: "500", unit: "ग्राम" },
                    { name: "दही", quantity: "1/2", unit: "कप" },
                    { name: "टमाटर", quantity: "4", unit: "बड़े" },
                    { name: "प्याज", quantity: "2", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "4", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "मक्खन", quantity: "4", unit: "टेबलस्पून" },
                    { name: "क्रीम", quantity: "1/2", unit: "कप" },
                    { name: "गरम मसाला", quantity: "1", unit: "टीस्पून" },
                    { name: "लाल मिर्च पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "चिकन को दही और मसालों में मैरिनेट करें।" },
                    { step: 2, description: "टमाटर, प्याज, लहसुन और अदरक को ब्लेंड करें।" },
                    { step: 3, description: "चिकन को नरम होने तक पकाएँ।" },
                    { step: 4, description: "मक्खन गरम करें और टमाटर का पेस्ट पकाएँ।" },
                    { step: 5, description: "मसाले और पका हुआ चिकन डालें।" },
                    { step: 6, description: "क्रीम डालें और धीमी आंच पर उबालें।" },
                    { step: 7, description: "गरमागरम नान या चावल के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Fish Curry",
        description: "Spicy and tangy fish cooked in coconut milk",
        image: "http://wildgreensandsardines.com/wp-content/uploads/2020/03/Kerala-Fish-Curry_8957.jpg",
        video: "https://www.youtube.com/embed/8oo_oUDdiMY",
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
        tags: ["indian", "fish", "coconut", "spicy"],
        translations: {
            hi: {
                title: "फिश करी",
                description: "नारियल के दूध में मसालेदार और खट्टी-मीठी मछली।",
                ingredients: [
                    { name: "मछली की फिले", quantity: "500", unit: "ग्राम" },
                    { name: "नारियल का दूध", quantity: "1", unit: "कप" },
                    { name: "टमाटर", quantity: "2", unit: "बड़े" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "लहसुन", quantity: "4", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "1", unit: "इंच" },
                    { name: "हल्दी", quantity: "1/2", unit: "टीस्पून" },
                    { name: "लाल मिर्च पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "धनिया पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "मछली को साफ करके टुकड़ों में काटें।" },
                    { step: 2, description: "टमाटर, प्याज, लहसुन और अदरक को ब्लेंड करें।" },
                    { step: 3, description: "तेल गरम करें और पेस्ट को तब तक पकाएँ जब तक तेल अलग न हो जाए।" },
                    { step: 4, description: "मसाले और नारियल का दूध डालें।" },
                    { step: 5, description: "मछली के टुकड़े धीरे-धीरे डालें।" },
                    { step: 6, description: "मध्यम आंच पर मछली पकने तक उबालें।" },
                    { step: 7, description: "गरमागरम चावल के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Jeera Rice",
        description: "Fragrant basmati rice cooked with cumin seeds",
        image: "https://myfoodstory.com/wp-content/uploads/2018/07/Perfect-Jeera-Rice-Indian-Cumin-Rice-3-1080x617.jpg",
        video: "https://www.youtube.com/embed/482su5EwL8w",
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
        tags: ["indian", "rice", "side", "fragrant"],
        translations: {
            hi: {
                title: "जीरा राइस",
                description: "जीरे के साथ पकाया हुआ खुशबूदार बासमती चावल।",
                ingredients: [
                    { name: "बासमती चावल", quantity: "1", unit: "कप" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "घी", quantity: "2", unit: "टेबलस्पून" },
                    { name: "तेज पत्ता", quantity: "1", unit: "टुकड़ा" },
                    { name: "लौंग", quantity: "2", unit: "पिस्से" },
                    { name: "दालचीनी", quantity: "1", unit: "इंच" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "पानी", quantity: "2", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "चावल को धोकर 30 मिनट के लिए भिगो दें।" },
                    { step: 2, description: "घी गरम करें और उसमें जीरा और साबुत मसाले डालें।" },
                    { step: 3, description: "पानी निकालकर चावल डालें और 2 मिनट भूनें।" },
                    { step: 4, description: "पानी और नमक डालें।" },
                    { step: 5, description: "उबाल आने पर ढककर धीमी आंच पर पकाएँ।" },
                    { step: 6, description: "पानी सोख जाने तक पकाएँ और चावल फुला हुआ हो जाए।" },
                    { step: 7, description: "गरमागरम करी के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Biryani",
        description: "Aromatic layered rice dish with marinated meat and spices",
        image: "https://media.istockphoto.com/photos/vegetable-biryani-picture-id618323650?k=6&m=618323650&s=612x612&w=0&h=HwxGUyMM75V2WJ9xhkt5KELx6dixoWF59EQHd30AH1U=",
        video: "https://www.youtube.com/embed/nf57BA3i5Rg",
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
        tags: ["indian", "rice", "chicken", "aromatic"],
        translations: {
            hi: {
                title: "बिरयानी",
                description: "मसाले और मेरिनेटेड मांस के साथ खुशबूदार परतदार चावल।",
                ingredients: [
                    { name: "बासमती चावल", quantity: "2", unit: "कप" },
                    { name: "चिकन", quantity: "500", unit: "ग्राम" },
                    { name: "दही", quantity: "1/2", unit: "कप" },
                    { name: "प्याज", quantity: "3", unit: "बड़े" },
                    { name: "टमाटर", quantity: "2", unit: "बड़े" },
                    { name: "लहसुन", quantity: "6", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "2", unit: "इंच" },
                    { name: "बिरयानी मसाला", quantity: "2", unit: "टेबलस्पून" },
                    { name: "हल्दी", quantity: "1", unit: "टीस्पून" },
                    { name: "केसर", quantity: "1/4", unit: "टीस्पून" },
                    { name: "दूध", quantity: "2", unit: "टेबलस्पून" },
                    { name: "घी", quantity: "4", unit: "टेबलस्पून" },
                    { name: "तले हुए प्याज", quantity: "1/2", unit: "कप" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "चिकन को दही और मसालों में मेरिनेट करें।" },
                    { step: 2, description: "साबुत मसालों के साथ बासमती चावल 70% तक पकाएँ।" },
                    { step: 3, description: "मेरिनेट किया हुआ चिकन प्याज और टमाटर के साथ पकाएँ।" },
                    { step: 4, description: "चावल और चिकन को बर्तन में परत करें।" },
                    { step: 5, description: "केसर वाला दूध और घी डालें।" },
                    { step: 6, description: "ढककर धीमी आंच (दम) पर पकाएँ।" },
                    { step: 7, description: "रायता और सलाद के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Roti",
        description: "Whole wheat flatbread cooked on griddle",
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230613/pngtree-stack-of-indian-roti-image_2906836.jpg",
        video: "https://www.youtube.com/embed/5NjaPL0Fe00",
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
        tags: ["indian", "bread", "vegetarian", "daily"],
        translations: {
            hi: {
                title: "रोटी",
                description: "साबुत गेहूं की तवा रोटी।",
                ingredients: [
                    { name: "साबुत गेहूं का आटा", quantity: "2", unit: "कप" },
                    { name: "पानी", quantity: "3/4", unit: "कप" },
                    { name: "नमक", quantity: "1/2", unit: "टीस्पून" },
                    { name: "तेल", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "आटा, नमक और पानी मिलाकर आटा गूंधें।" },
                    { step: 2, description: "आटे को चिकना होने तक गूंधें और 15 मिनट के लिए आराम दें।" },
                    { step: 3, description: "आटे की लोइयां बनाकर बेलन से बेलें।" },
                    { step: 4, description: "तवा गरम करें और रोटी दोनों तरफ सेकें।" },
                    { step: 5, description: "पकाते समय घी या तेल लगाएँ।" },
                    { step: 6, description: "गरमागरम करी के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Paratha",
        description: "Layered flatbread with ghee, often stuffed",
        image: "https://www.thedeliciouscrescent.com/wp-content/uploads/2020/06/Paratha-Square.jpg",
        video: "https://www.youtube.com/embed/G8BSGywfRMs",
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
        tags: ["indian", "bread", "vegetarian", "ghee"]
    },
    {
        title: "Gulab Jamun",
        description: "Sweet dumplings soaked in rose-flavored syrup",
        image: "https://www.cookwithnabeela.com/wp-content/uploads/2024/02/GulabJamun2-.webp",
        video: "https://www.youtube.com/embed/NH1yqSEpJLY",
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
        tags: ["indian", "sweet", "vegetarian", "festive"]
    },
    {
        title: "Kung Pao Chicken",
        description: "Spicy stir-fried chicken with peanuts, vegetables, and chili peppers",
        image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/woo3xycjcTg",
        cuisine: "Chinese",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Chicken breast", quantity: "500", unit: "g" },
            { name: "Peanuts", quantity: "1/2", unit: "cup" },
            { name: "Bell peppers", quantity: "2", unit: "medium" },
            { name: "Zucchini", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "tbsp" },
            { name: "Soy sauce", quantity: "3", unit: "tbsp" },
            { name: "Rice vinegar", quantity: "2", unit: "tbsp" },
            { name: "Sesame oil", quantity: "1", unit: "tbsp" },
            { name: "Cornstarch", quantity: "2", unit: "tbsp" },
            { name: "Dried red chilies", quantity: "8", unit: "pieces" },
            { name: "Sichuan peppercorns", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "3", unit: "tbsp" }
        ],
        instructions: [
            { step: 1, description: "Cut chicken into bite-sized pieces and marinate with soy sauce and cornstarch" },
            { step: 2, description: "Heat oil in wok, fry peanuts until golden, remove and set aside" },
            { step: 3, description: "Stir-fry chicken until cooked, remove and set aside" },
            { step: 4, description: "Add garlic, ginger, chilies, and Sichuan peppercorns to wok" },
            { step: 5, description: "Add bell peppers and zucchini, stir-fry for 2 minutes" },
            { step: 6, description: "Return chicken to wok, add soy sauce, vinegar, and sesame oil" },
            { step: 7, description: "Add peanuts back, toss everything together and serve hot" }
        ],
        nutrition: {
            calories: 380,
            protein: 32,
            carbs: 15,
            fat: 22
        },
        tags: ["chinese", "chicken", "spicy", "peanuts", "stirfry"],
        translations: {
            hi: {
                title: "कुंग पाओ चिकन",
                description: "मसालेदार चिकन जिसे मूंगफली, सब्ज़ियों और लाल मिर्च के साथ तला जाता है।",
                ingredients: [
                    { name: "चिकन ब्रेस्ट", quantity: "500", unit: "ग्रा" },
                    { name: "मूंगफली", quantity: "1/2", unit: "कप" },
                    { name: "शिमला मिर्च", quantity: "2", unit: "मध्यम" },
                    { name: "ज़ूकीनी", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "4", unit: "कली" },
                    { name: "अदरक", quantity: "1", unit: "चमच" },
                    { name: "सोया सॉस", quantity: "3", unit: "चमच" },
                    { name: "चावल का सिरका", quantity: "2", unit: "चमच" },
                    { name: "तिल का तेल", quantity: "1", unit: "चमच" },
                    { name: "कॉर्नस्टार्च", quantity: "2", unit: "चमच" },
                    { name: "सूखी लाल मिर्च", quantity: "8", unit: "टुकड़े" },
                    { name: "सिचुआन काली मिर्च", quantity: "1", unit: "चमच" },
                    { name: "तेल", quantity: "3", unit: "चमच" }
                ],
                instructions: [
                    { step: 1, description: "चिकन को छोटे टुकड़ों में काटें और सोया सॉस व कॉर्नस्टार्च के साथ मैरीनेट करें।" },
                    { step: 2, description: "वोक में तेल गरम करें, मूंगफली सुनहरी होने तक भूनें, निकालकर अलग रखें।" },
                    { step: 3, description: "चिकन को पकने तक भूनें, निकालकर अलग रखें।" },
                    { step: 4, description: "वोक में लहसुन, अदरक, मिर्च और सिचुआन काली मिर्च डालें।" },
                    { step: 5, description: "शिमला मिर्च और ज़ूकीनी डालें, 2 मिनट के लिए भूनें।" },
                    { step: 6, description: "चिकन वापस डालें, सोया सॉस, सिरका और तिल का तेल डालें।" },
                    { step: 7, description: "मूंगफली वापस डालें, सभी चीज़ों को अच्छी तरह मिलाएँ और गरम परोसें।" }
                ]
            }
        }
    },
    {
        title: "Pad Thai",
        description: "Stir-fried rice noodles with shrimp, tofu, and tamarind sauce",
        image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/F86GfZIph8o",
        cuisine: "Thai",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Rice noodles", quantity: "200", unit: "g" },
            { name: "Shrimp", quantity: "200", unit: "g" },
            { name: "Tofu", quantity: "150", unit: "g" },
            { name: "Bean sprouts", quantity: "1", unit: "cup" },
            { name: "Green onions", quantity: "4", unit: "stalks" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Eggs", quantity: "2", unit: "large" },
            { name: "Tamarind paste", quantity: "2", unit: "tbsp" },
            { name: "Fish sauce", quantity: "2", unit: "tbsp" },
            { name: "Palm sugar", quantity: "1", unit: "tbsp" },
            { name: "Lime", quantity: "1", unit: "piece" },
            { name: "Peanuts", quantity: "1/4", unit: "cup" },
            { name: "Oil", quantity: "3", unit: "tbsp" }
        ],
        instructions: [
            { step: 1, description: "Soak rice noodles in warm water for 10 minutes, drain" },
            { step: 2, description: "Mix tamarind paste, fish sauce, palm sugar, and lime juice for sauce" },
            { step: 3, description: "Heat oil, stir-fry garlic and shrimp until shrimp is pink" },
            { step: 4, description: "Add tofu and scrambled eggs, cook for 1 minute" },
            { step: 5, description: "Add noodles and sauce, toss to combine" },
            { step: 6, description: "Add bean sprouts and green onions, cook for 2 minutes" },
            { step: 7, description: "Serve with crushed peanuts and lime wedges" }
        ],
        nutrition: {
            calories: 420,
            protein: 25,
            carbs: 45,
            fat: 16
        },
        tags: ["thai", "noodles", "shrimp", "sweet-sour", "street"],
        translations: {
            hi: {
                title: "पैड थाई",
                description: "झींगा, टोफू और इमली की चटनी के साथ तली हुई चावल की नूडल्स।",
                ingredients: [
                    { name: "चावल की नूडल्स", quantity: "200", unit: "ग्रा" },
                    { name: "झींगा", quantity: "200", unit: "ग्रा" },
                    { name: "टोफू", quantity: "150", unit: "ग्रा" },
                    { name: "मूंगफली के अंकुर", quantity: "1", unit: "कप" },
                    { name: "हरी प्याज", quantity: "4", unit: "तनों" },
                    { name: "लहसुन", quantity: "3", unit: "कली" },
                    { name: "अंडे", quantity: "2", unit: "बड़े" },
                    { name: "इमली पेस्ट", quantity: "2", unit: "चमच" },
                    { name: "फिश सॉस", quantity: "2", unit: "चमच" },
                    { name: "पाम शुगर", quantity: "1", unit: "चमच" },
                    { name: "नींबू", quantity: "1", unit: "टुकड़ा" },
                    { name: "मूंगफली", quantity: "1/4", unit: "कप" },
                    { name: "तेल", quantity: "3", unit: "चमच" }
                ],
                instructions: [
                    { step: 1, description: "चावल की नूडल्स को 10 मिनट के लिए गुनगुने पानी में भिगोएँ, फिर छान लें।" },
                    { step: 2, description: "इमली पेस्ट, फिश सॉस, पाम शुगर और नींबू का रस मिलाकर सॉस तैयार करें।" },
                    { step: 3, description: "तेल गरम करें, लहसुन और झींगा भूनें जब तक झींगा गुलाबी न हो जाए।" },
                    { step: 4, description: "टोफू और फेंटे हुए अंडे डालें, 1 मिनट पकाएँ।" },
                    { step: 5, description: "नूडल्स और सॉस डालें, अच्छी तरह मिलाएँ।" },
                    { step: 6, description: "मूंगफली के अंकुर और हरी प्याज डालें, 2 मिनट पकाएँ।" },
                    { step: 7, description: "कूटे हुए मूंगफली और नींबू के टुकड़ों के साथ गरम परोसें।" }
                ]
            }
        }
    },
    {
        title: "Chicken Tacos",
        description: "Soft tortillas filled with seasoned chicken, salsa, and toppings",
        image: "https://2.bp.blogspot.com/-29m_xlLshDc/XDyqEnK9zUI/AAAAAAAAImQ/J87pQJ2xVcMiMZ_3omspbm2s5-G_UE9ngCEwYBhgL/s1600/Crock%2Bpot%2Bchicken%2Btacos%2Bon%2Bplatter.jpg",
        video: "https://www.youtube.com/embed/PGklx6OD_MM",
        cuisine: "Mexican",
        category: "main course",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        ingredients: [
            { name: "Chicken breast", quantity: "500", unit: "g" },
            { name: "Corn tortillas", quantity: "8", unit: "pieces" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Tomatoes", quantity: "2", unit: "large" },
            { name: "Avocado", quantity: "1", unit: "piece" },
            { name: "Cilantro", quantity: "1/4", unit: "cup" },
            { name: "Lime", quantity: "2", unit: "pieces" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Paprika", quantity: "1", unit: "tsp" },
            { name: "Garlic powder", quantity: "1", unit: "tsp" },
            { name: "Olive oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Season chicken with cumin, paprika, garlic powder, salt, and pepper" },
            { step: 2, description: "Heat oil and cook chicken until done, then shred" },
            { step: 3, description: "Dice tomatoes, onion, and avocado for salsa" },
            { step: 4, description: "Mix vegetables with cilantro and lime juice" },
            { step: 5, description: "Warm tortillas in a dry pan" },
            { step: 6, description: "Fill tortillas with chicken and salsa" },
            { step: 7, description: "Serve with additional lime wedges" }
        ],
        nutrition: {
            calories: 320,
            protein: 28,
            carbs: 25,
            fat: 12
        },
        tags: ["mexican", "chicken", "tortillas", "fresh", "quick"]
    },
    {
        title: "Chicken Tacos",
        description: "Soft tortillas filled with seasoned chicken, salsa, and toppings",
        image: "https://2.bp.blogspot.com/-29m_xlLshDc/XDyqEnK9zUI/AAAAAAAAImQ/J87pQJ2xVcMiMZ_3omspbm2s5-G_UE9ngCEwYBhgL/s1600/Crock%2Bpot%2Bchicken%2Btacos%2Bon%2Bplatter.jpg",
        video: "https://www.youtube.com/embed/PGklx6OD_MM",
        cuisine: "Mexican",
        category: "main course",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        ingredients: [
            { name: "Chicken breast", quantity: "500", unit: "g" },
            { name: "Corn tortillas", quantity: "8", unit: "pieces" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Tomatoes", quantity: "2", unit: "large" },
            { name: "Avocado", quantity: "1", unit: "piece" },
            { name: "Cilantro", quantity: "1/4", unit: "cup" },
            { name: "Lime", quantity: "2", unit: "pieces" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Paprika", quantity: "1", unit: "tsp" },
            { name: "Garlic powder", quantity: "1", unit: "tsp" },
            { name: "Olive oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Season chicken with cumin, paprika, garlic powder, salt, and pepper" },
            { step: 2, description: "Heat oil and cook chicken until done, then shred" },
            { step: 3, description: "Dice tomatoes, onion, and avocado for salsa" },
            { step: 4, description: "Mix vegetables with cilantro and lime juice" },
            { step: 5, description: "Warm tortillas in a dry pan" },
            { step: 6, description: "Fill tortillas with chicken and salsa" },
            { step: 7, description: "Serve with additional lime wedges" }
        ],
        nutrition: {
            calories: 320,
            protein: 28,
            carbs: 25,
            fat: 12
        },
        tags: ["mexican", "chicken", "tortillas", "fresh", "quick"],
        translations: {
            hi: {
                title: "चिकन टैकोस",
                description: "मसालेदार चिकन, साल्सा और टॉपिंग्स से भरे हुए नरम टॉर्टिला।",
                ingredients: [
                    { name: "चिकन ब्रेस्ट", quantity: "500", unit: "ग्रा" },
                    { name: "कॉर्न टॉर्टिला", quantity: "8", unit: "टुकड़े" },
                    { name: "प्याज", quantity: "1", unit: "मध्यम" },
                    { name: "टमाटर", quantity: "2", unit: "बड़े" },
                    { name: "एवोकाडो", quantity: "1", unit: "टुकड़ा" },
                    { name: "धनिया", quantity: "1/4", unit: "कप" },
                    { name: "नींबू", quantity: "2", unit: "टुकड़े" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "पप्रिका", quantity: "1", unit: "टीस्पून" },
                    { name: "लहसुन पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "जैतून का तेल", quantity: "2", unit: "चमच" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1/2", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "चिकन को जीरा, पप्रिका, लहसुन पाउडर, नमक और काली मिर्च के साथ मसाला लगाएँ।" },
                    { step: 2, description: "तेल गरम करें और चिकन पकाएँ, फिर इसे कटा हुआ कर लें।" },
                    { step: 3, description: "साल्सा के लिए टमाटर, प्याज और एवोकाडो काट लें।" },
                    { step: 4, description: "सब्ज़ियों को धनिया और नींबू के रस के साथ मिलाएँ।" },
                    { step: 5, description: "टॉर्टिला को सूखी पैन में गरम करें।" },
                    { step: 6, description: "टॉर्टिला में चिकन और साल्सा भरें।" },
                    { step: 7, description: "अतिरिक्त नींबू के टुकड़ों के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Ratatouille",
        description: "Provençal vegetable stew with eggplant, zucchini, and tomatoes",
        image: "https://i.cdn.newsbytesapp.com/images/28723801710372218.jpeg",
        video: "https://www.youtube.com/embed/XvjlmTJHaLw",
        cuisine: "French",
        category: "main course",
        difficulty: "medium",
        prepTime: 25,
        cookTime: 45,
        servings: 4,
        ingredients: [
            { name: "Eggplant", quantity: "1", unit: "large" },
            { name: "Zucchini", quantity: "2", unit: "medium" },
            { name: "Bell peppers", quantity: "2", unit: "medium" },
            { name: "Tomatoes", quantity: "4", unit: "large" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Thyme", quantity: "1", unit: "tsp" },
            { name: "Basil", quantity: "2", unit: "tbsp" },
            { name: "Olive oil", quantity: "4", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Cut all vegetables into 1-inch cubes" },
            { step: 2, description: "Heat oil, sauté onion and garlic until soft" },
            { step: 3, description: "Add eggplant, cook for 5 minutes" },
            { step: 4, description: "Add zucchini and bell peppers, cook for 5 minutes" },
            { step: 5, description: "Add tomatoes, thyme, salt, and pepper" },
            { step: 6, description: "Simmer covered for 30 minutes, stirring occasionally" },
            { step: 7, description: "Stir in fresh basil before serving" }
        ],
        nutrition: {
            calories: 180,
            protein: 4,
            carbs: 20,
            fat: 10
        },
        tags: ["french", "vegetarian", "stew", "mediterranean", "healthy"],
        translations: {
            hi: {
                title: "रैटाटुइ",
                description: "बैंगन, ज़ूचिनी और टमाटर के साथ प्रॉवेंस शाकाहारी स्टू।",
                ingredients: [
                    { name: "बैंगन", quantity: "1", unit: "बड़ा" },
                    { name: "ज़ूचिनी", quantity: "2", unit: "मध्यम" },
                    { name: "शिमला मिर्च", quantity: "2", unit: "मध्यम" },
                    { name: "टमाटर", quantity: "4", unit: "बड़े" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "लहसुन", quantity: "4", unit: "कली" },
                    { name: "थाइम", quantity: "1", unit: "टीस्पून" },
                    { name: "तुलसी", quantity: "2", unit: "चमच" },
                    { name: "जैतून का तेल", quantity: "4", unit: "चमच" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1/2", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "सभी सब्ज़ियों को 1 इंच के टुकड़ों में काटें।" },
                    { step: 2, description: "तेल गरम करें, प्याज और लहसुन को नरम होने तक भूनें।" },
                    { step: 3, description: "बैंगन डालें और 5 मिनट तक पकाएँ।" },
                    { step: 4, description: "ज़ूचिनी और शिमला मिर्च डालें, 5 मिनट तक पकाएँ।" },
                    { step: 5, description: "टमाटर, थाइम, नमक और काली मिर्च डालें।" },
                    { step: 6, description: "ढककर 30 मिनट तक धीरे-धीरे पकाएँ, समय-समय पर हिलाएँ।" },
                    { step: 7, description: "परोसने से पहले ताजा तुलसी मिलाएँ।" }
                ]
            }
        }
    },
    {
        title: "Falafel",
        description: "Deep-fried chickpea balls served with tahini sauce",
        image: "https://plantbasedfolk.com/wp-content/uploads/2019/10/Authentic-Lebanese-Falafel-Recipe.jpg",
        video: "https://www.youtube.com/embed/NZcWedPKysk",
        cuisine: "Middle Eastern",
        category: "appetizer",
        difficulty: "medium",
        prepTime: 15,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Chickpeas", quantity: "1", unit: "cup" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Parsley", quantity: "1/2", unit: "cup" },
            { name: "Cilantro", quantity: "1/2", unit: "cup" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Flour", quantity: "2", unit: "tbsp" },
            { name: "Baking soda", quantity: "1/2", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "cups" }
        ],
        instructions: [
            { step: 1, description: "Soak chickpeas overnight, drain and rinse" },
            { step: 2, description: "Blend chickpeas, onion, garlic, herbs, and spices" },
            { step: 3, description: "Add flour and baking soda to mixture" },
            { step: 4, description: "Form into small balls or patties" },
            { step: 5, description: "Heat oil and deep fry until golden brown" },
            { step: 6, description: "Drain on paper towels" },
            { step: 7, description: "Serve with tahini sauce and pita bread" }
        ],
        nutrition: {
            calories: 220,
            protein: 8,
            carbs: 25,
            fat: 10
        },
        tags: ["middle-eastern", "chickpeas", "vegetarian", "fried", "street"],
        translations: {
            hi: {
                title: "फलाफल",
                description: "ताहिनी सॉस के साथ परोसे गए गहरे तले हुए चने की गोलियाँ",
                ingredients: [
                    { name: "चना", quantity: "1", unit: "कप" },
                    { name: "प्याज", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "3", unit: "कली" },
                    { name: "अजवाइन (पार्सले)", quantity: "1/2", unit: "कप" },
                    { name: "धनिया", quantity: "1/2", unit: "कप" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "धनिया पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "आटा", quantity: "2", unit: "चमच" },
                    { name: "बेकिंग सोडा", quantity: "1/2", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "तेल", quantity: "2", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "चना को रात भर भिगोएँ, पानी छानकर धो लें।" },
                    { step: 2, description: "चना, प्याज, लहसुन, हर्ब्स और मसाले मिलाकर ब्लेंड करें।" },
                    { step: 3, description: "मिश्रण में आटा और बेकिंग सोडा डालें।" },
                    { step: 4, description: "छोटे गोल या पैटीज़ बनाएं।" },
                    { step: 5, description: "तेल गरम करें और गोलियों को सुनहरा भूरा होने तक तलें।" },
                    { step: 6, description: "कागज़ के तौलिये पर रखें ताकि अतिरिक्त तेल निकल जाए।" },
                    { step: 7, description: "ताहिनी सॉस और पीटा ब्रेड के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Pasta Carbonara",
        description: "Creamy pasta with pancetta, eggs, and Parmesan cheese",
        image: "https://tse1.mm.bing.net/th/id/OIP.dchqjONJhrMllqIkMeIZbwHaLH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        video: "https://www.youtube.com/embed/D_2DBLAt57c",
        cuisine: "Italian",
        category: "main course",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Spaghetti", quantity: "400", unit: "g" },
            { name: "Pancetta", quantity: "150", unit: "g" },
            { name: "Eggs", quantity: "3", unit: "large" },
            { name: "Parmesan cheese", quantity: "100", unit: "g" },
            { name: "Black pepper", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Cook spaghetti in salted boiling water until al dente" },
            { step: 2, description: "Cook pancetta in a pan until crispy" },
            { step: 3, description: "Whisk eggs with grated Parmesan and black pepper" },
            { step: 4, description: "Reserve pasta water, drain spaghetti" },
            { step: 5, description: "Add hot spaghetti to pancetta pan" },
            { step: 6, description: "Remove from heat, quickly mix in egg mixture" },
            { step: 7, description: "Add reserved pasta water if needed for creaminess" },
            { step: 8, description: "Serve immediately with extra Parmesan" }
        ],
        nutrition: {
            calories: 480,
            protein: 22,
            carbs: 55,
            fat: 18
        },
        tags: ["italian", "pasta", "creamy", "bacon", "quick"],
        translations: {
            hi: {
                title: "पास्ता कार्बोनारा",
                description: "पैनसेटा, अंडे और परमेसन चीज़ के साथ क्रीमी पास्ता",
                ingredients: [
                    { name: "स्पेगेटी", quantity: "400", unit: "ग" },
                    { name: "पैनसेटा", quantity: "150", unit: "ग" },
                    { name: "अंडे", quantity: "3", unit: "बड़े" },
                    { name: "परमेसन चीज़", quantity: "100", unit: "ग" },
                    { name: "काली मिर्च", quantity: "1", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "स्पेगेटी को नमक वाले उबलते पानी में अल डेंटे तक पकाएँ।" },
                    { step: 2, description: "पैनसेटा को पैन में कुरकुरा होने तक पकाएँ।" },
                    { step: 3, description: "अंडे को कद्दूकस किया हुआ परमेसन और काली मिर्च के साथ फेंटें।" },
                    { step: 4, description: "पास्ता का पानी सुरक्षित रखें और स्पेगेटी छान लें।" },
                    { step: 5, description: "गरम स्पेगेटी को पैनसेटा पैन में डालें।" },
                    { step: 6, description: "आंच से हटा कर जल्दी से अंडे का मिश्रण मिलाएँ।" },
                    { step: 7, description: "यदि क्रीमी बनाने की जरूरत हो तो सुरक्षित पास्ता पानी डालें।" },
                    { step: 8, description: "अतिरिक्त परमेसन के साथ तुरंत परोसें।" }
                ]
            }
        }
    },
    {
        title: "Tom Yum Soup",
        description: "Hot and sour Thai soup with shrimp and mushrooms",
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/ZcGqfJSo5hU",
        cuisine: "Thai",
        category: "soup",
        difficulty: "medium",
        prepTime: 15,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Shrimp", quantity: "200", unit: "g" },
            { name: "Mushrooms", quantity: "100", unit: "g" },
            { name: "Lemongrass", quantity: "2", unit: "stalks" },
            { name: "Galangal", quantity: "1", unit: "inch" },
            { name: "Kaffir lime leaves", quantity: "4", unit: "pieces" },
            { name: "Thai chilies", quantity: "3", unit: "pieces" },
            { name: "Fish sauce", quantity: "2", unit: "tbsp" },
            { name: "Lime juice", quantity: "3", unit: "tbsp" },
            { name: "Coconut milk", quantity: "1", unit: "cup" },
            { name: "Cilantro", quantity: "2", unit: "tbsp" },
            { name: "Chicken stock", quantity: "4", unit: "cups" }
        ],
        instructions: [
            { step: 1, description: "Bruise lemongrass and galangal, tear lime leaves" },
            { step: 2, description: "Bring stock to boil with aromatics" },
            { step: 3, description: "Add mushrooms and cook for 3 minutes" },
            { step: 4, description: "Add shrimp and cook until pink" },
            { step: 5, description: "Add fish sauce, lime juice, and chilies" },
            { step: 6, description: "Stir in coconut milk" },
            { step: 7, description: "Remove from heat, garnish with cilantro" },
            { step: 8, description: "Serve hot" }
        ],
        nutrition: {
            calories: 180,
            protein: 15,
            carbs: 8,
            fat: 10
        },
        tags: ["thai", "soup", "shrimp", "hot-sour", "aromatic"],
        translations: {
            hi: {
                title: "टॉम यम सूप",
                description: "झींगे और मशरूम के साथ तीखा और खट्टा थाई सूप",
                ingredients: [
                    { name: "झींगे", quantity: "200", unit: "ग" },
                    { name: "मशरूम", quantity: "100", unit: "ग" },
                    { name: "लेमनग्रास", quantity: "2", unit: "स्टॉक्स" },
                    { name: "गलंगाल", quantity: "1", unit: "इंच" },
                    { name: "काफिर नींबू के पत्ते", quantity: "4", unit: "टुकड़े" },
                    { name: "थाई मिर्च", quantity: "3", unit: "टुकड़े" },
                    { name: "फ़िश सॉस", quantity: "2", unit: "टीस्पून" },
                    { name: "नींबू का रस", quantity: "3", unit: "टीस्पून" },
                    { name: "नारियल का दूध", quantity: "1", unit: "कप" },
                    { name: "धनिया", quantity: "2", unit: "टीस्पून" },
                    { name: "चिकन स्टॉक", quantity: "4", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "लेमनग्रास और गलंगाल को हल्का कुचलें, नींबू के पत्ते फाड़ें।" },
                    { step: 2, description: "स्टॉक को सुगंधित सामग्री के साथ उबालें।" },
                    { step: 3, description: "मशरूम डालें और 3 मिनट तक पकाएँ।" },
                    { step: 4, description: "झींगे डालें और गुलाबी होने तक पकाएँ।" },
                    { step: 5, description: "फ़िश सॉस, नींबू का रस और मिर्च डालें।" },
                    { step: 6, description: "नारियल का दूध मिलाएँ।" },
                    { step: 7, description: "आंच से हटा कर धनिया से सजाएँ।" },
                    { step: 8, description: "गरम परोसें।" }
                ]
            }
        }
    },
    {
        title: "Enchiladas",
        description: "Corn tortillas filled with chicken and cheese, topped with red sauce",
        image: "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/CjoVxMSdfKg",
        cuisine: "Mexican",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 25,
        servings: 4,
        ingredients: [
            { name: "Corn tortillas", quantity: "8", unit: "pieces" },
            { name: "Chicken breast", quantity: "300", unit: "g" },
            { name: "Cheddar cheese", quantity: "200", unit: "g" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Tomatoes", quantity: "3", unit: "large" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Chili powder", quantity: "1", unit: "tbsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Olive oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Cook and shred chicken breast" },
            { step: 2, description: "Make sauce by blending tomatoes, onion, garlic, and spices" },
            { step: 3, description: "Cook sauce in oil for 10 minutes" },
            { step: 4, description: "Mix shredded chicken with half the cheese" },
            { step: 5, description: "Fill tortillas with chicken mixture and roll" },
            { step: 6, description: "Place in baking dish, cover with sauce and remaining cheese" },
            { step: 7, description: "Bake at 375°F for 15 minutes until cheese melts" },
            { step: 8, description: "Serve hot with sour cream and guacamole" }
        ],
        nutrition: {
            calories: 380,
            protein: 28,
            carbs: 30,
            fat: 16
        },
        tags: ["mexican", "chicken", "cheese", "baked", "comfort"],
        translations: {
            hi: {
                title: "एनचिलाडास",
                description: "चिकन और चीज़ से भरी कॉर्न टॉर्टिला, लाल सॉस के साथ ऊपर से",
                ingredients: [
                    { name: "कॉर्न टॉर्टिला", quantity: "8", unit: "टुकड़े" },
                    { name: "चिकन ब्रेस्ट", quantity: "300", unit: "ग" },
                    { name: "चेडर चीज़", quantity: "200", unit: "ग" },
                    { name: "प्याज", quantity: "1", unit: "मध्यम" },
                    { name: "टमाटर", quantity: "3", unit: "बड़े" },
                    { name: "लहसुन", quantity: "3", unit: "कली" },
                    { name: "लाल मिर्च पाउडर", quantity: "1", unit: "टीस्पून" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "ऑलिव ऑयल", quantity: "2", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1/2", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "चिकन ब्रेस्ट को पकाएँ और कद्दूकस करें।" },
                    { step: 2, description: "टमाटर, प्याज, लहसुन और मसाले मिलाकर सॉस तैयार करें।" },
                    { step: 3, description: "तेल में सॉस को 10 मिनट तक पकाएँ।" },
                    { step: 4, description: "कद्दूकस किया चिकन आधी चीज़ के साथ मिलाएँ।" },
                    { step: 5, description: "टॉर्टिला में चिकन मिश्रण भरें और रोल करें।" },
                    { step: 6, description: "बेकिंग डिश में रखें, सॉस और बची हुई चीज़ डालें।" },
                    { step: 7, description: "375°F पर 15 मिनट तक बेक करें जब तक चीज़ पिघल न जाए।" },
                    { step: 8, description: "गरम परोसें, साथ में सॉर क्रीम और गुआकामोले के साथ।" }
                ]
            }
        }
    },
    {
        title: "Crème Brûlée",
        description: "Rich custard topped with caramelized sugar",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/D_2DBLAt57c",
        cuisine: "French",
        category: "dessert",
        difficulty: "hard",
        prepTime: 20,
        cookTime: 60,
        servings: 6,
        ingredients: [
            { name: "Heavy cream", quantity: "2", unit: "cups" },
            { name: "Vanilla bean", quantity: "1", unit: "piece" },
            { name: "Egg yolks", quantity: "6", unit: "large" },
            { name: "Sugar", quantity: "1/2", unit: "cup" },
            { name: "Brown sugar", quantity: "1/4", unit: "cup" }
        ],
        instructions: [
            { step: 1, description: "Preheat oven to 325°F (160°C)" },
            { step: 2, description: "Heat cream with vanilla bean until hot but not boiling" },
            { step: 3, description: "Whisk egg yolks with sugar until pale" },
            { step: 4, description: "Slowly pour hot cream into egg mixture, whisking constantly" },
            { step: 5, description: "Strain mixture into ramekins" },
            { step: 6, description: "Place ramekins in water bath" },
            { step: 7, description: "Bake for 40-45 minutes until set but still jiggly" },
            { step: 8, description: "Chill for at least 2 hours" },
            { step: 9, description: "Sprinkle brown sugar on top and caramelize with torch" },
            { step: 10, description: "Serve immediately" }
        ],
        nutrition: {
            calories: 320,
            protein: 5,
            carbs: 25,
            fat: 22
        },
        tags: ["french", "custard", "caramel", "elegant", "creamy"],
        translations: {
            hi: {
                title: "क्रेम ब्रूले",
                description: "कैरेमलाइज्ड शुगर से ढकी रिच कस्टर्ड",
                ingredients: [
                    { name: "हेवी क्रीम", quantity: "2", unit: "कप" },
                    { name: "वनीला बीन", quantity: "1", unit: "टुकड़ा" },
                    { name: "अंडे की जर्दी", quantity: "6", unit: "बड़े" },
                    { name: "चीनी", quantity: "1/2", unit: "कप" },
                    { name: "ब्राउन शुगर", quantity: "1/4", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "ओवन को 325°F (160°C) पर प्रीहीट करें।" },
                    { step: 2, description: "क्रीम को वनीला बीन के साथ गर्म करें, उबालें नहीं।" },
                    { step: 3, description: "अंडे की जर्दी को चीनी के साथ हल्का और फूला हुआ तक फेंटें।" },
                    { step: 4, description: "गरम क्रीम धीरे-धीरे अंडे के मिश्रण में डालें और लगातार फेंटें।" },
                    { step: 5, description: "मिश्रण को रेमकिन्स में छानें।" },
                    { step: 6, description: "रेमकिन्स को वॉटर बाथ में रखें।" },
                    { step: 7, description: "40-45 मिनट तक बेक करें जब तक सेट न हो जाए, पर हल्का जिगली रहे।" },
                    { step: 8, description: "कम से कम 2 घंटे के लिए ठंडा करें।" },
                    { step: 9, description: "ऊपर ब्राउन शुगर छिड़कें और टॉर्च से कैरामेलाइज करें।" },
                    { step: 10, description: "तुरंत परोसें।" }
                ]
            }
        }
    },
    {
        title: "Ramen",
        description: "Japanese noodle soup with pork, eggs, and vegetables",
        image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/aafmrrx7Bh4",
        cuisine: "Japanese",
        category: "main course",
        difficulty: "hard",
        prepTime: 30,
        cookTime: 120,
        servings: 4,
        ingredients: [
            { name: "Pork belly", quantity: "500", unit: "g" },
            { name: "Ramen noodles", quantity: "400", unit: "g" },
            { name: "Eggs", quantity: "4", unit: "large" },
            { name: "Green onions", quantity: "4", unit: "stalks" },
            { name: "Bamboo shoots", quantity: "100", unit: "g" },
            { name: "Nori sheets", quantity: "2", unit: "pieces" },
            { name: "Soy sauce", quantity: "1/2", unit: "cup" },
            { name: "Mirin", quantity: "1/4", unit: "cup" },
            { name: "Sake", quantity: "1/4", unit: "cup" },
            { name: "Chicken stock", quantity: "8", unit: "cups" },
            { name: "Ginger", quantity: "2", unit: "inch" },
            { name: "Garlic", quantity: "4", unit: "cloves" }
        ],
        instructions: [
            { step: 1, description: "Make tare by simmering soy sauce, mirin, sake, ginger, garlic" },
            { step: 2, description: "Cook pork belly in stock for 2 hours until tender" },
            { step: 3, description: "Boil eggs for 6 minutes, cool in ice water, peel" },
            { step: 4, description: "Cook ramen noodles according to package" },
            { step: 5, description: "Slice pork belly thinly" },
            { step: 6, description: "Divide tare into bowls, add hot stock" },
            { step: 7, description: "Add noodles, pork, eggs, bamboo shoots, green onions" },
            { step: 8, description: "Top with nori and serve immediately" }
        ],
        nutrition: {
            calories: 550,
            protein: 32,
            carbs: 45,
            fat: 25
        },
        tags: ["japanese", "noodles", "pork", "soup", "rich"],
        translations: {
            hi: {
                title: "रामेन",
                description: "पोर्क, अंडे और सब्जियों के साथ जापानी नूडल सूप",
                ingredients: [
                    { name: "पोर्क बेली", quantity: "500", unit: "ग्रा" },
                    { name: "रामेन नूडल्स", quantity: "400", unit: "ग्रा" },
                    { name: "अंडे", quantity: "4", unit: "बड़े" },
                    { name: "हरी प्याज", quantity: "4", unit: "सिरा" },
                    { name: "बांस की कलियाँ", quantity: "100", unit: "ग्रा" },
                    { name: "नोरी शीट्स", quantity: "2", unit: "टुकड़े" },
                    { name: "सोया सॉस", quantity: "1/2", unit: "कप" },
                    { name: "मिरिन", quantity: "1/4", unit: "कप" },
                    { name: "साके", quantity: "1/4", unit: "कप" },
                    { name: "चिकन स्टॉक", quantity: "8", unit: "कप" },
                    { name: "अदरक", quantity: "2", unit: "इंच" },
                    { name: "लहसुन", quantity: "4", unit: "कली" }
                ],
                instructions: [
                    { step: 1, description: "सोया सॉस, मिरिन, साके, अदरक और लहसुन को उबाल कर टारे बनाएं।" },
                    { step: 2, description: "स्टॉक में पोर्क बेली को 2 घंटे तक नरम होने तक पकाएं।" },
                    { step: 3, description: "अंडों को 6 मिनट उबालें, ठंडे पानी में ठंडा करें और छील लें।" },
                    { step: 4, description: "पैकेज अनुसार रामेन नूडल्स पकाएं।" },
                    { step: 5, description: "पोर्क बेली को पतले टुकड़ों में काटें।" },
                    { step: 6, description: "बोल में टारे डालें, गरम स्टॉक डालें।" },
                    { step: 7, description: "नूडल्स, पोर्क, अंडे, बांस की कलियाँ और हरी प्याज डालें।" },
                    { step: 8, description: "नोरी से ऊपर सजाएँ और तुरंत परोसें।" }
                ]
            }
        }
    },
    {
        title: "Sweet and Sour Pork",
        description: "Crispy pork in tangy pineapple sauce with vegetables",
        image: "https://therecipecritic.com/wp-content/uploads/2021/04/sweetandsourpork.jpg",
        video: "https://www.youtube.com/embed/_4fFSKXIsBs",
        cuisine: "Chinese",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 20,
        servings: 4,
        ingredients: [
            { name: "Pork tenderloin", quantity: "500", unit: "g" },
            { name: "Pineapple chunks", quantity: "1", unit: "cup" },
            { name: "Bell peppers", quantity: "2", unit: "medium" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "tbsp" },
            { name: "Ketchup", quantity: "1/2", unit: "cup" },
            { name: "Rice vinegar", quantity: "1/4", unit: "cup" },
            { name: "Soy sauce", quantity: "2", unit: "tbsp" },
            { name: "Cornstarch", quantity: "3", unit: "tbsp" },
            { name: "Egg", quantity: "1", unit: "large" },
            { name: "Oil", quantity: "2", unit: "cups" }
        ],
        instructions: [
            { step: 1, description: "Cut pork into bite-sized pieces, marinate with egg and cornstarch" },
            { step: 2, description: "Deep fry pork until golden, drain and set aside" },
            { step: 3, description: "Mix ketchup, vinegar, soy sauce for sauce" },
            { step: 4, description: "Stir-fry garlic, ginger, onion, and bell peppers" },
            { step: 5, description: "Add pineapple chunks and sauce mixture" },
            { step: 6, description: "Thicken with cornstarch slurry" },
            { step: 7, description: "Add fried pork back and toss to coat" },
            { step: 8, description: "Serve hot with steamed rice" }
        ],
        nutrition: {
            calories: 420,
            protein: 28,
            carbs: 35,
            fat: 18
        },
        tags: ["chinese", "pork", "sweet-sour", "pineapple", "crispy"],
        translations: {
            hi: {
                title: "स्वीट एंड सौर पोर्क",
                description: "सब्जियों के साथ खट्टे-पिनेएप्पल सॉस में कुरकुरा पोर्क",
                ingredients: [
                    { name: "पोर्क टेंडरलॉइन", quantity: "500", unit: "ग्रा" },
                    { name: "पाइनएप्पल के टुकड़े", quantity: "1", unit: "कप" },
                    { name: "शिमला मिर्च", quantity: "2", unit: "मध्यम" },
                    { name: "प्याज", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "3", unit: "कली" },
                    { name: "अदरक", quantity: "1", unit: "चम्मच" },
                    { name: "केचप", quantity: "1/2", unit: "कप" },
                    { name: "राइस विनेगर", quantity: "1/4", unit: "कप" },
                    { name: "सोया सॉस", quantity: "2", unit: "चम्मच" },
                    { name: "कॉर्नस्टार्च", quantity: "3", unit: "चम्मच" },
                    { name: "अंडा", quantity: "1", unit: "बड़ा" },
                    { name: "तेल", quantity: "2", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "पोर्क को छोटे टुकड़ों में काटें, अंडा और कॉर्नस्टार्च के साथ मैरीनेट करें।" },
                    { step: 2, description: "पोर्क को डीप फ्राई करें जब तक सुनहरा न हो, फिर अलग रखें।" },
                    { step: 3, description: "सॉस के लिए केचप, विनेगर और सोया सॉस मिलाएं।" },
                    { step: 4, description: "लहसुन, अदरक, प्याज और शिमला मिर्च को स्टिर-फ्राई करें।" },
                    { step: 5, description: "पाइनएप्पल और सॉस मिलाएँ।" },
                    { step: 6, description: "कॉर्नस्टार्च स्लरी से गाढ़ा करें।" },
                    { step: 7, description: "डीप फ्राई पोर्क डालें और अच्छे से कोट करें।" },
                    { step: 8, description: "गरम भाप वाले चावल के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Hummus",
        description: "Creamy chickpea dip with tahini and garlic",
        image: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/R7WpjZwAWQA",
        cuisine: "Middle Eastern",
        category: "appetizer",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 0,
        servings: 6,
        ingredients: [
            { name: "Chickpeas", quantity: "1", unit: "can" },
            { name: "Tahini", quantity: "1/4", unit: "cup" },
            { name: "Lemon juice", quantity: "2", unit: "tbsp" },
            { name: "Garlic", quantity: "2", unit: "cloves" },
            { name: "Olive oil", quantity: "2", unit: "tbsp" },
            { name: "Cumin", quantity: "1/2", unit: "tsp" },
            { name: "Salt", quantity: "1/2", unit: "tsp" },
            { name: "Paprika", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Drain and rinse chickpeas" },
            { step: 2, description: "Blend chickpeas, tahini, lemon juice, garlic, cumin, and salt" },
            { step: 3, description: "Add olive oil gradually while blending" },
            { step: 4, description: "Blend until smooth and creamy" },
            { step: 5, description: "Adjust consistency with water if needed" },
            { step: 6, description: "Transfer to bowl, drizzle with olive oil" },
            { step: 7, description: "Sprinkle with paprika and serve with pita bread" }
        ],
        nutrition: {
            calories: 180,
            protein: 6,
            carbs: 18,
            fat: 10
        },
        tags: ["middle-eastern", "chickpeas", "dip", "vegetarian", "healthy"],
        translations: {
            hi: {
                title: "हुमस",
                description: "ताहिनी और लहसुन के साथ क्रीमी चने की डिप",
                ingredients: [
                    { name: "चना", quantity: "1", unit: "कैन्स" },
                    { name: "ताहिनी", quantity: "1/4", unit: "कप" },
                    { name: "नींबू का रस", quantity: "2", unit: "चम्मच" },
                    { name: "लहसुन", quantity: "2", unit: "कली" },
                    { name: "जैतून का तेल", quantity: "2", unit: "चम्मच" },
                    { name: "जीरा", quantity: "1/2", unit: "चम्मच" },
                    { name: "नमक", quantity: "1/2", unit: "चम्मच" },
                    { name: "पप्रिका", quantity: "1/2", unit: "चम्मच" }
                ],
                instructions: [
                    { step: 1, description: "चना छानकर धो लें।" },
                    { step: 2, description: "चना, ताहिनी, नींबू का रस, लहसुन, जीरा और नमक मिलाएँ।" },
                    { step: 3, description: "ब्लेंड करते समय धीरे-धीरे जैतून का तेल डालें।" },
                    { step: 4, description: "स्मूद और क्रीमी होने तक ब्लेंड करें।" },
                    { step: 5, description: "जरूरत पड़ने पर पानी डालकर स्थिरता एडजस्ट करें।" },
                    { step: 6, description: "बाउल में डालें, ऊपर से जैतून का तेल डालें।" },
                    { step: 7, description: "पप्रिका छिड़कें और पीटा ब्रेड के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Sushi Rolls",
        description: "Fresh fish and vegetables wrapped in seasoned rice and nori",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/ZzLPUoetSHw",
        cuisine: "Japanese",
        category: "main course",
        difficulty: "hard",
        prepTime: 45,
        cookTime: 0,
        servings: 4,
        ingredients: [
            { name: "Sushi rice", quantity: "2", unit: "cups" },
            { name: "Nori sheets", quantity: "4", unit: "pieces" },
            { name: "Fresh salmon", quantity: "200", unit: "g" },
            { name: "Cucumber", quantity: "1", unit: "piece" },
            { name: "Avocado", quantity: "1", unit: "piece" },
            { name: "Wasabi", quantity: "1", unit: "tbsp" },
            { name: "Soy sauce", quantity: "1/4", unit: "cup" },
            { name: "Rice vinegar", quantity: "3", unit: "tbsp" },
            { name: "Sugar", quantity: "1", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Cook sushi rice and season with vinegar, sugar, and salt" },
            { step: 2, description: "Cut fish and vegetables into thin strips" },
            { step: 3, description: "Place nori on sushi mat, spread rice evenly" },
            { step: 4, description: "Arrange fillings in center of rice" },
            { step: 5, description: "Roll tightly using mat, slice into pieces" },
            { step: 6, description: "Serve with soy sauce and wasabi" }
        ],
        nutrition: {
            calories: 320,
            protein: 18,
            carbs: 45,
            fat: 8
        },
        tags: ["japanese", "sushi", "fish", "rice", "fresh"],
        translations: {
            hi: {
                title: "सुशी रोल्स",
                description: "ताज़ी मछली और सब्जियां, मसालेदार चावल और नोरी में लिपटी हुई",
                ingredients: [
                    { name: "सुशी चावल", quantity: "2", unit: "कप" },
                    { name: "नोरी शीट्स", quantity: "4", unit: "टुकड़े" },
                    { name: "ताज़ी सैल्मन", quantity: "200", unit: "ग्रा" },
                    { name: "खीरा", quantity: "1", unit: "पीस" },
                    { name: "एवोकाडो", quantity: "1", unit: "पीस" },
                    { name: "वासाबी", quantity: "1", unit: "चम्मच" },
                    { name: "सोया सॉस", quantity: "1/4", unit: "कप" },
                    { name: "चावल का सिरका", quantity: "3", unit: "चम्मच" },
                    { name: "शुगर", quantity: "1", unit: "चम्मच" },
                    { name: "नमक", quantity: "1", unit: "चम्मच" }
                ],
                instructions: [
                    { step: 1, description: "सुशी चावल पकाएं और सिरका, शुगर और नमक मिलाकर सीज़न करें।" },
                    { step: 2, description: "मछली और सब्जियों को पतली स्ट्रिप्स में काटें।" },
                    { step: 3, description: "नोरी को सुशी मैट पर रखें और चावल फैलाएं।" },
                    { step: 4, description: "चावल के बीच में फिलिंग रखें।" },
                    { step: 5, description: "मैट की मदद से कसकर रोल करें और टुकड़ों में काटें।" },
                    { step: 6, description: "सोया सॉस और वासाबी के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Paella",
        description: "Spanish rice dish with seafood, chicken, and saffron",
        image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/z90wDOfNPbI",
        cuisine: "Spanish",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 40,
        servings: 6,
        ingredients: [
            { name: "Arborio rice", quantity: "2", unit: "cups" },
            { name: "Chicken thighs", quantity: "300", unit: "g" },
            { name: "Shrimp", quantity: "200", unit: "g" },
            { name: "Mussels", quantity: "200", unit: "g" },
            { name: "Bell peppers", quantity: "2", unit: "medium" },
            { name: "Peas", quantity: "1", unit: "cup" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Saffron", quantity: "1/4", unit: "tsp" },
            { name: "Chicken stock", quantity: "4", unit: "cups" },
            { name: "Olive oil", quantity: "3", unit: "tbsp" },
            { name: "Paprika", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Heat oil in paella pan, brown chicken and remove" },
            { step: 2, description: "Sauté onion, garlic, and bell peppers" },
            { step: 3, description: "Add rice and paprika, stir for 2 minutes" },
            { step: 4, description: "Add saffron to stock, pour over rice" },
            { step: 5, description: "Add chicken back, arrange seafood on top" },
            { step: 6, description: "Cook uncovered until rice is tender and seafood done" },
            { step: 7, description: "Rest for 5 minutes before serving" }
        ],
        nutrition: {
            calories: 420,
            protein: 32,
            carbs: 45,
            fat: 14
        },
        tags: ["spanish", "rice", "seafood", "chicken", "saffron"],
        translations: {
            hi: {
                title: "पाएया",
                description: "सीफ़ूड, चिकन और केसर से बना स्पेनिश चावल का व्यंजन",
                ingredients: [
                    { name: "आर्बोरियो चावल", quantity: "2", unit: "कप" },
                    { name: "चिकन थाई पीस", quantity: "300", unit: "ग्रा" },
                    { name: "झींगे", quantity: "200", unit: "ग्रा" },
                    { name: "मसल्स", quantity: "200", unit: "ग्रा" },
                    { name: "शिमला मिर्च", quantity: "2", unit: "मीडियम" },
                    { name: "मटर", quantity: "1", unit: "कप" },
                    { name: "प्याज़", quantity: "1", unit: "बड़ा" },
                    { name: "लहसुन", quantity: "4", unit: "कली" },
                    { name: "केसर", quantity: "1/4", unit: "चम्मच" },
                    { name: "चिकन स्टॉक", quantity: "4", unit: "कप" },
                    { name: "जैतून का तेल", quantity: "3", unit: "चम्मच" },
                    { name: "पप्रिका", quantity: "1", unit: "चम्मच" }
                ],
                instructions: [
                    { step: 1, description: "पाएया पैन में तेल गर्म करें, चिकन को हल्का भूनकर निकाल लें।" },
                    { step: 2, description: "प्याज़, लहसुन और शिमला मिर्च को भूनें।" },
                    { step: 3, description: "चावल और पप्रिका डालकर 2 मिनट चलाएँ।" },
                    { step: 4, description: "केसर को स्टॉक में मिलाएँ और चावल पर डालें।" },
                    { step: 5, description: "चिकन को वापस डालें और ऊपर से सीफ़ूड रखें।" },
                    { step: 6, description: "ढक्कन खोले बिना पकाएँ जब तक चावल मुलायम और सीफ़ूड पक न जाए।" },
                    { step: 7, description: "5 मिनट तक ढककर रखें और फिर परोसें।" }
                ]
            }
        }
    },
    {
        title: "Tandoori Chicken",
        description: "Marinated chicken cooked in traditional clay oven",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/SkWhpMqVyUY",
        cuisine: "Indian",
        category: "main course",
        difficulty: "medium",
        prepTime: 120,
        cookTime: 25,
        servings: 4,
        ingredients: [
            { name: "Chicken pieces", quantity: "800", unit: "g" },
            { name: "Yogurt", quantity: "1", unit: "cup" },
            { name: "Ginger-garlic paste", quantity: "2", unit: "tbsp" },
            { name: "Lemon juice", quantity: "2", unit: "tbsp" },
            { name: "Red chili powder", quantity: "1", unit: "tbsp" },
            { name: "Turmeric", quantity: "1", unit: "tsp" },
            { name: "Garam masala", quantity: "1", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Kashmiri chili powder", quantity: "1", unit: "tbsp" },
            { name: "Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Make deep cuts in chicken pieces" },
            { step: 2, description: "Mix all marinade ingredients in a bowl" },
            { step: 3, description: "Coat chicken with marinade, marinate for 2 hours" },
            { step: 4, description: "Preheat oven to 400°F (200°C)" },
            { step: 5, description: "Place chicken on baking tray" },
            { step: 6, description: "Bake for 20-25 minutes until charred and cooked" },
            { step: 7, description: "Serve with lemon wedges and onion rings" }
        ],
        nutrition: {
            calories: 280,
            protein: 35,
            carbs: 8,
            fat: 12
        },
        tags: ["indian", "chicken", "tandoor", "spicy", "marinated"],
        translations: {
            hi: {
                title: "तंदूरी चिकन",
                description: "मसालेदार चिकन जिसे पारंपरिक मिट्टी के तंदूर में पकाया जाता है",
                ingredients: [
                    { name: "चिकन पीस", quantity: "800", unit: "ग्रा" },
                    { name: "दही", quantity: "1", unit: "कप" },
                    { name: "अदरक-लहसुन पेस्ट", quantity: "2", unit: "चम्मच" },
                    { name: "नींबू का रस", quantity: "2", unit: "चम्मच" },
                    { name: "लाल मिर्च पाउडर", quantity: "1", unit: "चम्मच" },
                    { name: "हल्दी", quantity: "1", unit: "चम्मच" },
                    { name: "गरम मसाला", quantity: "1", unit: "चम्मच" },
                    { name: "जीरा", quantity: "1", unit: "चम्मच" },
                    { name: "धनिया पाउडर", quantity: "1", unit: "चम्मच" },
                    { name: "कश्मीरी लाल मिर्च", quantity: "1", unit: "चम्मच" },
                    { name: "तेल", quantity: "2", unit: "चम्मच" },
                    { name: "नमक", quantity: "1", unit: "चम्मच" }
                ],
                instructions: [
                    { step: 1, description: "चिकन पीस में गहरे चीरे लगाएँ।" },
                    { step: 2, description: "सभी मेरिनेशन सामग्री को एक बाउल में मिलाएँ।" },
                    { step: 3, description: "चिकन को मसाले में अच्छी तरह लपेटें और 2 घंटे मेरिनेट करें।" },
                    { step: 4, description: "ओवन को 400°F (200°C) पर प्रीहीट करें।" },
                    { step: 5, description: "चिकन को बेकिंग ट्रे पर रखें।" },
                    { step: 6, description: "20-25 मिनट तक बेक करें जब तक हल्का चार और पक न जाए।" },
                    { step: 7, description: "नींबू और प्याज़ रिंग्स के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Greek Salad",
        description: "Fresh Mediterranean salad with feta cheese and olives",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/36QOkwvNzts",
        cuisine: "Greek",
        category: "salad",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 0,
        servings: 4,
        ingredients: [
            { name: "Tomatoes", quantity: "4", unit: "large" },
            { name: "Cucumber", quantity: "1", unit: "large" },
            { name: "Red onion", quantity: "1", unit: "medium" },
            { name: "Feta cheese", quantity: "200", unit: "g" },
            { name: "Kalamata olives", quantity: "1/2", unit: "cup" },
            { name: "Olive oil", quantity: "1/4", unit: "cup" },
            { name: "Lemon juice", quantity: "2", unit: "tbsp" },
            { name: "Oregano", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Cut tomatoes into wedges" },
            { step: 2, description: "Slice cucumber and red onion thinly" },
            { step: 3, description: "Crumble feta cheese" },
            { step: 4, description: "Combine all ingredients in a large bowl" },
            { step: 5, description: "Whisk together olive oil, lemon juice, oregano, salt, pepper" },
            { step: 6, description: "Pour dressing over salad and toss gently" },
            { step: 7, description: "Let sit for 10 minutes before serving" }
        ],
        nutrition: {
            calories: 220,
            protein: 8,
            carbs: 12,
            fat: 16
        },
        tags: ["greek", "salad", "feta", "mediterranean", "fresh"],
        translations: {
            hi: {
                title: "ग्रीक सलाद",
                description: "फेटा चीज़ और जैतून से बनी ताज़गी भरी मेडिटरेनियन सलाद — गर्मियों के लिए एक हल्का और स्वादिष्ट विकल्प।",
                ingredients: [
                    { name: "टमाटर", quantity: "4", unit: "बड़े" },
                    { name: "खीरा", quantity: "1", unit: "बड़ा" },
                    { name: "लाल प्याज", quantity: "1", unit: "मध्यम" },
                    { name: "फेटा चीज़", quantity: "200", unit: "ग्राम" },
                    { name: "कैलामाटा ऑलिव्स (जैतून)", quantity: "1/2", unit: "कप" },
                    { name: "ऑलिव ऑयल", quantity: "1/4", unit: "कप" },
                    { name: "नींबू का रस", quantity: "2", unit: "टेबलस्पून" },
                    { name: "ओरिगैनो", quantity: "1", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1/2", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "टमाटरों को वेज आकार में काट लें।" },
                    { step: 2, description: "खीरे और लाल प्याज को पतले स्लाइस में काटें।" },
                    { step: 3, description: "फेटा चीज़ को हल्के हाथों से क्रम्बल करें।" },
                    { step: 4, description: "एक बड़े बाउल में सभी सब्ज़ियाँ और फेटा चीज़ मिलाएं।" },
                    { step: 5, description: "एक छोटे बाउल में ऑलिव ऑयल, नींबू का रस, ओरिगैनो, नमक और काली मिर्च डालकर फेंटें।" },
                    { step: 6, description: "ड्रेसिंग को सलाद पर डालें और हल्के हाथों से मिलाएं।" },
                    { step: 7, description: "परोसने से पहले 10 मिनट के लिए रख दें ताकि स्वाद अच्छी तरह मिल जाए।" }
                ]
            }
        }
    },
    {
        title: "Pho",
        description: "Vietnamese noodle soup with beef and aromatic broth",
        image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/WlosNFMCnE4",
        cuisine: "Vietnamese",
        category: "soup",
        difficulty: "hard",
        prepTime: 30,
        cookTime: 180,
        servings: 6,
        ingredients: [
            { name: "Beef bones", quantity: "2", unit: "kg" },
            { name: "Rice noodles", quantity: "400", unit: "g" },
            { name: "Beef sirloin", quantity: "300", unit: "g" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Ginger", quantity: "2", unit: "inch" },
            { name: "Star anise", quantity: "3", unit: "pieces" },
            { name: "Cinnamon stick", quantity: "1", unit: "piece" },
            { name: "Cloves", quantity: "3", unit: "pieces" },
            { name: "Fish sauce", quantity: "3", unit: "tbsp" },
            { name: "Bean sprouts", quantity: "2", unit: "cups" },
            { name: "Thai basil", quantity: "1/2", unit: "cup" },
            { name: "Lime", quantity: "2", unit: "pieces" }
        ],
        instructions: [
            { step: 1, description: "Roast bones, onion, ginger for 30 minutes" },
            { step: 2, description: "Simmer bones with spices for 3 hours" },
            { step: 3, description: "Strain broth, season with fish sauce" },
            { step: 4, description: "Cook rice noodles according to package" },
            { step: 5, description: "Slice beef thinly" },
            { step: 6, description: "Divide noodles into bowls" },
            { step: 7, description: "Top with raw beef slices" },
            { step: 8, description: "Pour hot broth over beef to cook it" },
            { step: 9, description: "Garnish with bean sprouts, basil, and lime" }
        ],
        nutrition: {
            calories: 380,
            protein: 28,
            carbs: 45,
            fat: 8
        },
        tags: ["vietnamese", "noodles", "beef", "soup", "aromatic"],
        translations: {
            hi: {
                title: "फो (वियतनामी नूडल सूप)",
                description: "बीफ़ और सुगंधित शोरबे से बना वियतनामी नूडल सूप — हल्का, स्वादिष्ट और सुगंधों से भरपूर व्यंजन।",
                ingredients: [
                    { name: "बीफ़ की हड्डियाँ", quantity: "2", unit: "किलो" },
                    { name: "चावल के नूडल्स", quantity: "400", unit: "ग्राम" },
                    { name: "बीफ़ सिरलॉइन", quantity: "300", unit: "ग्राम" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "अदरक", quantity: "2", unit: "इंच" },
                    { name: "स्टार ऐनीस (चक्र फूल)", quantity: "3", unit: "पीस" },
                    { name: "दालचीनी स्टिक", quantity: "1", unit: "पीस" },
                    { name: "लौंग", quantity: "3", unit: "पीस" },
                    { name: "फिश सॉस", quantity: "3", unit: "टेबलस्पून" },
                    { name: "बीन स्प्राउट्स", quantity: "2", unit: "कप" },
                    { name: "थाई बेसिल (तुलसी)", quantity: "1/2", unit: "कप" },
                    { name: "नींबू", quantity: "2", unit: "पीस" }
                ],
                instructions: [
                    { step: 1, description: "बीफ़ की हड्डियों, प्याज और अदरक को 30 मिनट तक ओवन में भूनें।" },
                    { step: 2, description: "अब इन्हें मसालों के साथ धीमी आँच पर लगभग 3 घंटे तक उबालें ताकि स्वाद अच्छी तरह निकल आए।" },
                    { step: 3, description: "शोरबे को छान लें और उसमें फिश सॉस डालकर स्वादानुसार मिलाएं।" },
                    { step: 4, description: "पैकेट के निर्देशों के अनुसार चावल के नूडल्स उबालें।" },
                    { step: 5, description: "बीफ़ को बहुत पतले स्लाइस में काट लें।" },
                    { step: 6, description: "एक कटोरे में पके हुए नूडल्स डालें।" },
                    { step: 7, description: "ऊपर से कच्चे बीफ़ के स्लाइस रखें।" },
                    { step: 8, description: "गरम शोरबा ऊपर से डालें ताकि बीफ़ हल्का पक जाए।" },
                    { step: 9, description: "ऊपर से बीन स्प्राउट्स, तुलसी और नींबू से सजाकर परोसें।" }
                ]
            }
        }
    },
    {
        title: "Lasagna",
        description: "Layered pasta with meat sauce and cheese",
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/QZloaLmvSP0",
        cuisine: "Italian",
        category: "main course",
        difficulty: "medium",
        prepTime: 45,
        cookTime: 45,
        servings: 8,
        ingredients: [
            { name: "Lasagna noodles", quantity: "12", unit: "pieces" },
            { name: "Ground beef", quantity: "500", unit: "g" },
            { name: "Italian sausage", quantity: "250", unit: "g" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Tomato sauce", quantity: "800", unit: "g" },
            { name: "Ricotta cheese", quantity: "500", unit: "g" },
            { name: "Mozzarella cheese", quantity: "300", unit: "g" },
            { name: "Parmesan cheese", quantity: "100", unit: "g" },
            { name: "Egg", quantity: "1", unit: "large" },
            { name: "Basil", quantity: "2", unit: "tbsp" },
            { name: "Olive oil", quantity: "2", unit: "tbsp" }
        ],
        instructions: [
            { step: 1, description: "Cook lasagna noodles according to package" },
            { step: 2, description: "Brown ground meat with onion and garlic" },
            { step: 3, description: "Add tomato sauce and simmer for 20 minutes" },
            { step: 4, description: "Mix ricotta with egg and basil" },
            { step: 5, description: "Layer sauce, noodles, ricotta, mozzarella in baking dish" },
            { step: 6, description: "Repeat layers, top with Parmesan" },
            { step: 7, description: "Bake at 375°F for 25 minutes until bubbly" },
            { step: 8, description: "Let rest for 15 minutes before serving" }
        ],
        nutrition: {
            calories: 520,
            protein: 32,
            carbs: 35,
            fat: 28
        },
        tags: ["italian", "pasta", "cheese", "baked", "comfort"],
        translations: {
            hi: {
                title: "लज़ान्या",
                description: "मांस के स्वादिष्ट सॉस और पिघले हुए चीज़ की परतों से बनी एक प्रसिद्ध इटालियन पास्ता डिश।",
                ingredients: [
                    { name: "लज़ान्या नूडल्स", quantity: "12", unit: "पीस" },
                    { name: "कीमा बीफ़", quantity: "500", unit: "ग्राम" },
                    { name: "इटालियन सॉसेज", quantity: "250", unit: "ग्राम" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "लहसुन", quantity: "4", unit: "कलियाँ" },
                    { name: "टमाटर सॉस", quantity: "800", unit: "ग्राम" },
                    { name: "रिकोटा चीज़", quantity: "500", unit: "ग्राम" },
                    { name: "मोज़रेला चीज़", quantity: "300", unit: "ग्राम" },
                    { name: "पार्मेज़ान चीज़", quantity: "100", unit: "ग्राम" },
                    { name: "अंडा", quantity: "1", unit: "बड़ा" },
                    { name: "तुलसी (बेसिल)", quantity: "2", unit: "टेबलस्पून" },
                    { name: "ऑलिव ऑयल", quantity: "2", unit: "टेबलस्पून" }
                ],
                instructions: [
                    { step: 1, description: "पैकेट के निर्देशों के अनुसार लज़ान्या नूडल्स को उबाल लें।" },
                    { step: 2, description: "एक पैन में कीमा बीफ़, प्याज और लहसुन डालकर भूनें जब तक मांस भूरा न हो जाए।" },
                    { step: 3, description: "टमाटर सॉस डालें और लगभग 20 मिनट तक धीमी आँच पर पकाएं।" },
                    { step: 4, description: "रिकोटा चीज़ में अंडा और तुलसी मिलाकर एक मिश्रण तैयार करें।" },
                    { step: 5, description: "एक बेकिंग डिश में पहले सॉस, फिर नूडल्स, फिर रिकोटा मिश्रण और फिर मोज़रेला चीज़ की परत लगाएँ।" },
                    { step: 6, description: "इसी तरह परतें दोहराएँ और सबसे ऊपर पार्मेज़ान चीज़ डालें।" },
                    { step: 7, description: "375°F (190°C) पर 25 मिनट तक बेक करें जब तक ऊपर से सुनहरी और बबली न हो जाए।" },
                    { step: 8, description: "परोसने से पहले 15 मिनट तक ठंडा होने दें ताकि परतें सेट हो जाएँ।" }
                ]
            }
        }
    },
    {
        title: "Kimchi Fried Rice",
        description: "Spicy Korean rice dish with fermented vegetables",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/Lf44Fk7H24s",
        cuisine: "Korean",
        category: "main course",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Cooked rice", quantity: "4", unit: "cups" },
            { name: "Kimchi", quantity: "1", unit: "cup" },
            { name: "Kimchi juice", quantity: "2", unit: "tbsp" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Carrot", quantity: "1", unit: "medium" },
            { name: "Green onions", quantity: "3", unit: "stalks" },
            { name: "Sesame oil", quantity: "2", unit: "tbsp" },
            { name: "Soy sauce", quantity: "1", unit: "tbsp" },
            { name: "Gochujang", quantity: "1", unit: "tbsp" },
            { name: "Eggs", quantity: "4", unit: "large" },
            { name: "Butter", quantity: "2", unit: "tbsp" }
        ],
        instructions: [
            { step: 1, description: "Chop kimchi, onion, carrot, and green onions" },
            { step: 2, description: "Heat butter and sesame oil in large pan" },
            { step: 3, description: "Sauté onion, garlic, and carrot for 3 minutes" },
            { step: 4, description: "Add kimchi and cook for 2 minutes" },
            { step: 5, description: "Add rice and break up any clumps" },
            { step: 6, description: "Mix in kimchi juice, soy sauce, and gochujang" },
            { step: 7, description: "Push rice to sides, scramble eggs in center" },
            { step: 8, description: "Mix everything together and serve hot" }
        ],
        nutrition: {
            calories: 380,
            protein: 12,
            carbs: 50,
            fat: 14
        },
        tags: ["korean", "rice", "kimchi", "spicy", "quick"],
        translations: {
            hi: {
                title: "किम्ची फ्राइड राइस",
                description: "फर्मेंटेड सब्ज़ियों और मसालेदार स्वाद से बना एक लोकप्रिय कोरियाई चावल व्यंजन — तीखा, सुगंधित और बेहद स्वादिष्ट।",
                ingredients: [
                    { name: "पके हुए चावल", quantity: "4", unit: "कप" },
                    { name: "किम्ची", quantity: "1", unit: "कप" },
                    { name: "किम्ची जूस", quantity: "2", unit: "टेबलस्पून" },
                    { name: "प्याज", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "3", unit: "कलियाँ" },
                    { name: "गाजर", quantity: "1", unit: "मध्यम" },
                    { name: "हरा प्याज", quantity: "3", unit: "डंठल" },
                    { name: "तिल का तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "सोया सॉस", quantity: "1", unit: "टेबलस्पून" },
                    { name: "गोचुजांग (कोरियाई तीखा पेस्ट)", quantity: "1", unit: "टेबलस्पून" },
                    { name: "अंडे", quantity: "4", unit: "बड़े" },
                    { name: "मक्खन", quantity: "2", unit: "टेबलस्पून" }
                ],
                instructions: [
                    { step: 1, description: "किम्ची, प्याज, गाजर और हरे प्याज को बारीक काट लें।" },
                    { step: 2, description: "एक बड़ी कढ़ाई में मक्खन और तिल का तेल गरम करें।" },
                    { step: 3, description: "प्याज, लहसुन और गाजर डालकर 3 मिनट तक भूनें।" },
                    { step: 4, description: "अब किम्ची डालें और 2 मिनट तक पकाएं।" },
                    { step: 5, description: "पके हुए चावल डालें और किसी भी गांठ को तोड़कर मिलाएं।" },
                    { step: 6, description: "किम्ची जूस, सोया सॉस और गोचुजांग डालें और अच्छे से मिलाएं।" },
                    { step: 7, description: "चावल को किनारे करें और बीच में अंडे डालकर हल्का स्क्रैम्बल करें।" },
                    { step: 8, description: "सब कुछ मिलाकर गरमागरम परोसें।" }
                ]
            }
        }
    },
    {
        title: "Shakshuka",
        description: "North African eggs poached in spiced tomato sauce",
        image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/ifWWRZSWS18",
        cuisine: "Middle Eastern",
        category: "main course",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        ingredients: [
            { name: "Eggs", quantity: "6", unit: "large" },
            { name: "Tomatoes", quantity: "6", unit: "large" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Bell pepper", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Paprika", quantity: "1", unit: "tsp" },
            { name: "Cayenne pepper", quantity: "1/2", unit: "tsp" },
            { name: "Olive oil", quantity: "3", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1/2", unit: "tsp" },
            { name: "Fresh cilantro", quantity: "2", unit: "tbsp" }
        ],
        instructions: [
            { step: 1, description: "Chop tomatoes, onion, and bell pepper" },
            { step: 2, description: "Heat olive oil in large skillet" },
            { step: 3, description: "Sauté onion and bell pepper for 5 minutes" },
            { step: 4, description: "Add garlic and spices, cook for 1 minute" },
            { step: 5, description: "Add tomatoes and simmer for 10 minutes" },
            { step: 6, description: "Make 6 wells in sauce, crack eggs into them" },
            { step: 7, description: "Cover and cook until eggs are set" },
            { step: 8, description: "Garnish with cilantro and serve with bread" }
        ],
        nutrition: {
            calories: 220,
            protein: 12,
            carbs: 15,
            fat: 14
        },
        tags: ["middle-eastern", "eggs", "tomatoes", "spicy", "breakfast"],
        translations: {
            hi: {
                title: "शकशुका",
                description: "मसालेदार टमाटर की ग्रेवी में पोच किए हुए अंडों से बना एक लोकप्रिय उत्तर अफ्रीकी व्यंजन।",
                ingredients: [
                    { name: "अंडे", quantity: "6", unit: "बड़े" },
                    { name: "टमाटर", quantity: "6", unit: "बड़े" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "शिमला मिर्च", quantity: "1", unit: "मध्यम" },
                    { name: "लहसुन", quantity: "4", unit: "कलियाँ" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "पपरिका", quantity: "1", unit: "टीस्पून" },
                    { name: "कायेन पेपर (लाल मिर्च पाउडर)", quantity: "1/2", unit: "टीस्पून" },
                    { name: "ऑलिव ऑयल", quantity: "3", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1/2", unit: "टीस्पून" },
                    { name: "ताज़ा धनिया पत्ती", quantity: "2", unit: "टेबलस्पून" }
                ],
                instructions: [
                    { step: 1, description: "टमाटर, प्याज और शिमला मिर्च को बारीक काट लें।" },
                    { step: 2, description: "एक बड़ी कड़ाही में ऑलिव ऑयल गरम करें।" },
                    { step: 3, description: "प्याज और शिमला मिर्च डालकर 5 मिनट तक भूनें।" },
                    { step: 4, description: "अब लहसुन और सारे मसाले डालकर 1 मिनट तक पकाएं।" },
                    { step: 5, description: "टमाटर डालें और 10 मिनट तक धीमी आँच पर पकाएं जब तक सॉस गाढ़ा न हो जाए।" },
                    { step: 6, description: "सॉस में 6 जगह जगह हल्के गड्ढे बनाएं और उनमें अंडे तोड़ें।" },
                    { step: 7, description: "ढककर तब तक पकाएं जब तक अंडे सेट न हो जाएं।" },
                    { step: 8, description: "ऊपर से धनिया पत्ती से सजाएं और ब्रेड के साथ गरमागरम परोसें।" }
                ]
            }
        }
    },
    {
        title: "Quiche Lorraine",
        description: "Savory custard pie with bacon and cheese",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/vHA2gRm62DY",
        cuisine: "French",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 45,
        servings: 6,
        ingredients: [
            { name: "Pie crust", quantity: "1", unit: "piece" },
            { name: "Bacon", quantity: "200", unit: "g" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Eggs", quantity: "4", unit: "large" },
            { name: "Heavy cream", quantity: "1", unit: "cup" },
            { name: "Gruyere cheese", quantity: "150", unit: "g" },
            { name: "Salt", quantity: "1/2", unit: "tsp" },
            { name: "Black pepper", quantity: "1/4", unit: "tsp" },
            { name: "Nutmeg", quantity: "1/8", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Preheat oven to 375°F (190°C)" },
            { step: 2, description: "Cook bacon until crispy, chop into pieces" },
            { step: 3, description: "Sauté onion until soft" },
            { step: 4, description: "Whisk eggs, cream, salt, pepper, and nutmeg" },
            { step: 5, description: "Spread bacon and onion in pie crust" },
            { step: 6, description: "Sprinkle half the cheese over filling" },
            { step: 7, description: "Pour egg mixture over filling" },
            { step: 8, description: "Top with remaining cheese" },
            { step: 9, description: "Bake for 35-40 minutes until set" },
            { step: 10, description: "Let cool for 10 minutes before serving" }
        ],
        nutrition: {
            calories: 420,
            protein: 18,
            carbs: 20,
            fat: 30
        },
        tags: ["french", "quiche", "bacon", "cheese", "savory"],
        translations: {
            hi: {
                title: "कीश लोरेन",
                description: "बेकन और चीज़ से बनी एक स्वादिष्ट फ्रेंच नमकीन पाई — हल्के अंडे और क्रीम के मिश्रण से तैयार की गई।",
                ingredients: [
                    { name: "पाई क्रस्ट", quantity: "1", unit: "पीस" },
                    { name: "बेकन", quantity: "200", unit: "ग्राम" },
                    { name: "प्याज", quantity: "1", unit: "मध्यम" },
                    { name: "अंडे", quantity: "4", unit: "बड़े" },
                    { name: "हेवी क्रीम", quantity: "1", unit: "कप" },
                    { name: "ग्रुईएर चीज़", quantity: "150", unit: "ग्राम" },
                    { name: "नमक", quantity: "1/2", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1/4", unit: "टीस्पून" },
                    { name: "जायफल पाउडर", quantity: "1/8", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "ओवन को 375°F (190°C) पर पहले से गरम करें।" },
                    { step: 2, description: "बेकन को कुरकुरा होने तक पकाएं और फिर टुकड़ों में काट लें।" },
                    { step: 3, description: "एक पैन में प्याज को नरम होने तक भूनें।" },
                    { step: 4, description: "एक बाउल में अंडे, क्रीम, नमक, काली मिर्च और जायफल मिलाकर फेंटें।" },
                    { step: 5, description: "पाई क्रस्ट में सबसे पहले बेकन और प्याज की परत बिछाएं।" },
                    { step: 6, description: "फिलिंग के ऊपर आधा चीज़ छिड़कें।" },
                    { step: 7, description: "अब अंडे और क्रीम का मिश्रण फिलिंग के ऊपर डालें।" },
                    { step: 8, description: "ऊपर से बचा हुआ चीज़ डालें।" },
                    { step: 9, description: "35–40 मिनट तक बेक करें जब तक मिश्रण सेट और ऊपर से सुनहरा न हो जाए।" },
                    { step: 10, description: "परोसने से पहले 10 मिनट ठंडा होने दें।" }
                ]
            }
        }
    },
    {
        title: "Sauerbraten",
        description: "German marinated pot roast with gingersnap gravy",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/g75uUIUeNYo",
        cuisine: "German",
        category: "main course",
        difficulty: "hard",
        prepTime: 30,
        cookTime: 180,
        servings: 6,
        ingredients: [
            { name: "Beef roast", quantity: "2", unit: "kg" },
            { name: "Red wine vinegar", quantity: "2", unit: "cups" },
            { name: "Red wine", quantity: "2", unit: "cups" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Carrots", quantity: "3", unit: "medium" },
            { name: "Celery", quantity: "2", unit: "stalks" },
            { name: "Bay leaves", quantity: "3", unit: "pieces" },
            { name: "Cloves", quantity: "6", unit: "pieces" },
            { name: "Black peppercorns", quantity: "10", unit: "pieces" },
            { name: "Gingersnaps", quantity: "8", unit: "pieces" },
            { name: "Sugar", quantity: "2", unit: "tbsp" },
            { name: "Butter", quantity: "3", unit: "tbsp" },
            { name: "Flour", quantity: "2", unit: "tbsp" }
        ],
        instructions: [
            { step: 1, description: "Marinate beef in vinegar, wine, and spices for 3-4 days" },
            { step: 2, description: "Remove beef, strain marinade" },
            { step: 3, description: "Brown beef in butter, remove from pot" },
            { step: 4, description: "Sauté vegetables in same pot" },
            { step: 5, description: "Return beef, add strained marinade" },
            { step: 6, description: "Simmer covered for 2.5 hours until tender" },
            { step: 7, description: "Remove beef, thicken sauce with gingersnap slurry" },
            { step: 8, description: "Slice beef and serve with gravy" }
        ],
        nutrition: {
            calories: 450,
            protein: 45,
            carbs: 15,
            fat: 22
        },
        tags: ["german", "beef", "marinated", "pot-roast", "traditional"],
        translations: {
            hi: {
                title: "सावरब्राटन",
                description: "जर्मनी की पारंपरिक डिश जिसमें बीफ को वाइन और सिरके में कई दिनों तक मेरिनेट किया जाता है, और अदरक वाले ग्रेवी के साथ परोसा जाता है।",
                ingredients: [
                    { name: "बीफ रोस्ट", quantity: "2", unit: "किलो" },
                    { name: "रेड वाइन सिरका", quantity: "2", unit: "कप" },
                    { name: "रेड वाइन", quantity: "2", unit: "कप" },
                    { name: "प्याज", quantity: "2", unit: "बड़े" },
                    { name: "गाजर", quantity: "3", unit: "मध्यम" },
                    { name: "सेलेरी", quantity: "2", unit: "डंठल" },
                    { name: "तेज पत्ते", quantity: "3", unit: "पीस" },
                    { name: "लौंग", quantity: "6", unit: "पीस" },
                    { name: "काली मिर्च के दाने", quantity: "10", unit: "पीस" },
                    { name: "जिंजर स्नैप कुकीज़", quantity: "8", unit: "पीस" },
                    { name: "चीनी", quantity: "2", unit: "टेबलस्पून" },
                    { name: "मक्खन", quantity: "3", unit: "टेबलस्पून" },
                    { name: "मैदा", quantity: "2", unit: "टेबलस्पून" }
                ],
                instructions: [
                    { step: 1, description: "बीफ को सिरका, वाइन और मसालों में 3–4 दिन तक मेरिनेट करें।" },
                    { step: 2, description: "बीफ को मेरिनेड से निकालें और तरल को छान लें।" },
                    { step: 3, description: "बीफ को मक्खन में सुनहरा भूरा होने तक भूनें और निकाल लें।" },
                    { step: 4, description: "उसी पैन में सब्ज़ियों को भूनें।" },
                    { step: 5, description: "अब बीफ और छना हुआ मेरिनेड डालें।" },
                    { step: 6, description: "ढककर धीमी आँच पर लगभग 2.5 घंटे तक पकाएँ जब तक मांस नरम न हो जाए।" },
                    { step: 7, description: "बीफ को निकालें और ग्रेवी में जिंजर स्नैप का पेस्ट डालकर गाढ़ा करें।" },
                    { step: 8, description: "बीफ को स्लाइस करें और गरम ग्रेवी के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Feijoada",
        description: "Brazilian black bean stew with pork and sausages",
        image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/auzJ4qLftBw",
        cuisine: "Brazilian",
        category: "main course",
        difficulty: "medium",
        prepTime: 30,
        cookTime: 120,
        servings: 8,
        ingredients: [
            { name: "Black beans", quantity: "1", unit: "kg" },
            { name: "Pork ribs", quantity: "500", unit: "g" },
            { name: "Bacon", quantity: "200", unit: "g" },
            { name: "Pork sausage", quantity: "300", unit: "g" },
            { name: "Pork shoulder", quantity: "500", unit: "g" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Garlic", quantity: "6", unit: "cloves" },
            { name: "Bay leaves", quantity: "3", unit: "pieces" },
            { name: "Orange", quantity: "1", unit: "piece" },
            { name: "Cilantro", quantity: "1/2", unit: "cup" },
            { name: "Rice", quantity: "2", unit: "cups" },
            { name: "Collard greens", quantity: "1", unit: "bunch" }
        ],
        instructions: [
            { step: 1, description: "Soak beans overnight, drain" },
            { step: 2, description: "Cook beans with bay leaves and orange for 1 hour" },
            { step: 3, description: "Brown all pork meats separately" },
            { step: 4, description: "Sauté onions and garlic until golden" },
            { step: 5, description: "Add browned meats to beans" },
            { step: 6, description: "Simmer for 1 hour until tender" },
            { step: 7, description: "Serve with rice, collard greens, and farofa" }
        ],
        nutrition: {
            calories: 520,
            protein: 35,
            carbs: 45,
            fat: 22
        },
        tags: ["brazilian", "beans", "pork", "stew", "traditional"],
        translations: {
            hi: {
                title: "फेज़ोआदा",
                description: "ब्राज़ील की मशहूर डिश — काले बीन्स, सूअर के मांस और सॉसेज से बनी गाढ़ी स्वादिष्ट स्ट्यू, जो चावल और साग के साथ परोसी जाती है।",
                ingredients: [
                    { name: "काले बीन्स", quantity: "1", unit: "किलो" },
                    { name: "पोर्क रिब्स", quantity: "500", unit: "ग्राम" },
                    { name: "बेकन", quantity: "200", unit: "ग्राम" },
                    { name: "पोर्क सॉसेज", quantity: "300", unit: "ग्राम" },
                    { name: "पोर्क शोल्डर", quantity: "500", unit: "ग्राम" },
                    { name: "प्याज", quantity: "2", unit: "बड़े" },
                    { name: "लहसुन", quantity: "6", unit: "कली" },
                    { name: "तेज पत्ते", quantity: "3", unit: "पीस" },
                    { name: "संतरा", quantity: "1", unit: "पीस" },
                    { name: "धनिया पत्ता", quantity: "1/2", unit: "कप" },
                    { name: "चावल", quantity: "2", unit: "कप" },
                    { name: "कॉलेर्ड ग्रीन्स", quantity: "1", unit: "गुच्छा" }
                ],
                instructions: [
                    { step: 1, description: "बीन्स को रात भर भिगोकर रखें और फिर पानी निकाल दें।" },
                    { step: 2, description: "बीन्स को तेज पत्ता और संतरे के साथ 1 घंटे तक उबालें।" },
                    { step: 3, description: "सभी पोर्क मीट को अलग-अलग सुनहरा भूरा करें।" },
                    { step: 4, description: "प्याज और लहसुन को सुनहरा होने तक भूनें।" },
                    { step: 5, description: "भुना हुआ मीट बीन्स में डालें।" },
                    { step: 6, description: "धीमी आँच पर 1 घंटे तक पकाएँ जब तक सब कुछ अच्छी तरह मिल न जाए।" },
                    { step: 7, description: "गरमागरम परोसें — चावल, साग और फराफा (भुना हुआ कसावा आटा) के साथ।" }
                ]
            }
        }
    },
    {
        title: "Chicken Tagine",
        description: "Moroccan spiced chicken stew with apricots and almonds",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/TpsUQ7SbTXs",
        cuisine: "Moroccan",
        category: "main course",
        difficulty: "medium",
        prepTime: 20,
        cookTime: 60,
        servings: 6,
        ingredients: [
            { name: "Chicken thighs", quantity: "1", unit: "kg" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "2", unit: "tbsp" },
            { name: "Cinnamon", quantity: "1", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Turmeric", quantity: "1", unit: "tsp" },
            { name: "Saffron", quantity: "1/4", unit: "tsp" },
            { name: "Chicken stock", quantity: "2", unit: "cups" },
            { name: "Dried apricots", quantity: "1/2", unit: "cup" },
            { name: "Almonds", quantity: "1/4", unit: "cup" },
            { name: "Honey", quantity: "2", unit: "tbsp" },
            { name: "Lemon", quantity: "1", unit: "piece" },
            { name: "Cilantro", quantity: "1/4", unit: "cup" }
        ],
        instructions: [
            { step: 1, description: "Brown chicken pieces in tagine or pot" },
            { step: 2, description: "Sauté onions, garlic, and ginger" },
            { step: 3, description: "Add spices and cook for 1 minute" },
            { step: 4, description: "Return chicken, add stock and saffron" },
            { step: 5, description: "Simmer covered for 30 minutes" },
            { step: 6, description: "Add apricots, almonds, honey, and lemon" },
            { step: 7, description: "Cook uncovered for 15 minutes" },
            { step: 8, description: "Garnish with cilantro and serve with couscous" }
        ],
        nutrition: {
            calories: 380,
            protein: 32,
            carbs: 20,
            fat: 18
        },
        tags: ["moroccan", "chicken", "tagine", "spiced", "sweet-sour"],
        translations: {
            hi: {
                title: "चिकन टैगाइन",
                description: "एप्रिकॉट और बादाम के साथ मोरक्कन मसालेदार चिकन स्टू",
                ingredients: [
                    { name: "चिकन थाईज", quantity: "1", unit: "किलोग्राम" },
                    { name: "प्याज", quantity: "2", unit: "बड़े" },
                    { name: "लहसुन", quantity: "4", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "2", unit: "टेबलस्पून" },
                    { name: "दालचीनी", quantity: "1", unit: "टीस्पून" },
                    { name: "जीरा", quantity: "1", unit: "टीस्पून" },
                    { name: "हल्दी", quantity: "1", unit: "टीस्पून" },
                    { name: "केसर", quantity: "1/4", unit: "टीस्पून" },
                    { name: "चिकन स्टॉक", quantity: "2", unit: "कप" },
                    { name: "सूखे एप्रिकॉट", quantity: "1/2", unit: "कप" },
                    { name: "बादाम", quantity: "1/4", unit: "कप" },
                    { name: "शहद", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नींबू", quantity: "1", unit: "टुकड़ा" },
                    { name: "धनिया", quantity: "1/4", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "टैगाइन या पॉट में चिकन टुकड़े भूनें" },
                    { step: 2, description: "प्याज, लहसुन और अदरक सॉटे करें" },
                    { step: 3, description: "मसाले डालें और 1 मिनट तक पकाएं" },
                    { step: 4, description: "चिकन वापस डालें, स्टॉक और केसर डालें" },
                    { step: 5, description: "ढककर 30 मिनट तक सिमर करें" },
                    { step: 6, description: "एप्रिकॉट, बादाम, शहद और नींबू डालें" },
                    { step: 7, description: "15 मिनट तक बिना ढके पकाएं" },
                    { step: 8, description: "धनिया से गार्निश करें और कूसकूस के साथ सर्व करें" }
                ]
            }
        }
    },
    {
        title: "Doro Wat",
        description: "Ethiopian spicy chicken stew with hard-boiled eggs",
        translations: {
            hi: {
                title: "डोरो वाट",
                description: "हार्ड-बॉइल्ड अंडों के साथ इथियोपियाई मसालेदार चिकन स्टू",
                ingredients: [
                    { name: "चिकन टुकड़े", quantity: "1", unit: "किलोग्राम" },
                    { name: "प्याज", quantity: "3", unit: "बड़े" },
                    { name: "लहसुन", quantity: "6", unit: "कलियाँ" },
                    { name: "अदरक", quantity: "2", unit: "टेबलस्पून" },
                    { name: "बर्बेरे मसाला", quantity: "3", unit: "टेबलस्पून" },
                    { name: "नाइटर किबेह", quantity: "4", unit: "टेबलस्पून" },
                    { name: "टमाटर पेस्ट", quantity: "2", unit: "टेबलस्पून" },
                    { name: "चिकन स्टॉक", quantity: "2", unit: "कप" },
                    { name: "हार्ड-बॉइल्ड अंडे", quantity: "6", unit: "टुकड़े" },
                    { name: "नींबू का रस", quantity: "2", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "प्याज को बारीक काटें और 30 मिनट तक धीरे धीरे पकाएं" },
                    { step: 2, description: "लहसुन, अदरक और बर्बेरे मसाला डालें" },
                    { step: 3, description: "सुगंधित होने तक 10 मिनट तक पकाएं" },
                    { step: 4, description: "टमाटर पेस्ट डालें और 5 मिनट तक पकाएं" },
                    { step: 5, description: "चिकन टुकड़े डालें और भूनें" },
                    { step: 6, description: "स्टॉक डालें और 45 मिनट तक सिमर करें" },
                    { step: 7, description: "छिलके हुए अंडे और नींबू का रस डालें" },
                    { step: 8, description: "10 मिनट और सिमर करें" },
                    { step: 9, description: "इंजेरा ब्रेड के साथ सर्व करें" }
                ]
            }
        },
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/KmDSCTrH0Hg",
        cuisine: "Ethiopian",
        category: "main course",
        difficulty: "medium",
        prepTime: 30,
        cookTime: 90,
        servings: 6,
        ingredients: [
            { name: "Chicken pieces", quantity: "1", unit: "kg" },
            { name: "Onions", quantity: "3", unit: "large" },
            { name: "Garlic", quantity: "6", unit: "cloves" },
            { name: "Ginger", quantity: "2", unit: "tbsp" },
            { name: "Berbere spice", quantity: "3", unit: "tbsp" },
            { name: "Niter kibbeh", quantity: "4", unit: "tbsp" },
            { name: "Tomato paste", quantity: "2", unit: "tbsp" },
            { name: "Chicken stock", quantity: "2", unit: "cups" },
            { name: "Hard-boiled eggs", quantity: "6", unit: "pieces" },
            { name: "Lemon juice", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Finely chop onions and cook slowly for 30 minutes" },
            { step: 2, description: "Add garlic, ginger, and berbere spice" },
            { step: 3, description: "Cook for 10 minutes until aromatic" },
            { step: 4, description: "Add tomato paste and cook for 5 minutes" },
            { step: 5, description: "Add chicken pieces and brown" },
            { step: 6, description: "Add stock and simmer for 45 minutes" },
            { step: 7, description: "Add peeled eggs and lemon juice" },
            { step: 8, description: "Simmer for 10 more minutes" },
            { step: 9, description: "Serve with injera bread" }
        ],
        nutrition: {
            calories: 420,
            protein: 38,
            carbs: 12,
            fat: 24
        },
        tags: ["ethiopian", "chicken", "spicy", "stew", "eggs"]
    },
    {
        title: "Jerk Chicken",
        description: "Jamaican spicy marinated grilled chicken with allspice",
        image: "https://disheswithdad.com/wp-content/uploads/2021/05/jerk-chicken-12.jpg",
        video: "https://www.youtube.com/embed/WiGs9i1RVsM",
        cuisine: "Jamaican",
        category: "main course",
        difficulty: "medium",
        prepTime: 30,
        cookTime: 30,
        servings: 6,
        ingredients: [
            { name: "Chicken pieces", quantity: "1.5", unit: "kg" },
            { name: "Allspice", quantity: "1", unit: "tbsp" },
            { name: "Scotch bonnet peppers", quantity: "2", unit: "pieces" },
            { name: "Soy sauce", quantity: "1/4", unit: "cup" },
            { name: "Brown sugar", quantity: "2", unit: "tbsp" },
            { name: "Thyme", quantity: "2", unit: "tbsp" },
            { name: "Garlic", quantity: "6", unit: "cloves" },
            { name: "Ginger", quantity: "2", unit: "tbsp" },
            { name: "Green onions", quantity: "6", unit: "stalks" },
            { name: "Olive oil", quantity: "1/4", unit: "cup" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Black pepper", quantity: "1", unit: "tsp" },
            { name: "Nutmeg", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Blend all marinade ingredients until smooth" },
            { step: 2, description: "Score chicken pieces and marinate for 4-24 hours" },
            { step: 3, description: "Preheat grill to medium-high" },
            { step: 4, description: "Remove chicken from marinade" },
            { step: 5, description: "Grill chicken for 6-8 minutes per side" },
            { step: 6, description: "Brush with remaining marinade while grilling" },
            { step: 7, description: "Rest for 5 minutes before serving" },
            { step: 8, description: "Serve with festival bread and coleslaw" }
        ],
        nutrition: {
            calories: 320,
            protein: 35,
            carbs: 8,
            fat: 16
        },
        tags: ["jamaican", "chicken", "grilled", "spicy", "marinated"],
        translations: {
            hi: {
                title: "जर्क चिकन",
                description: "जमैका की मसालेदार मैरिनेटेड ग्रिल्ड चिकन ऑलस्पाइस के साथ",
                ingredients: [
                    { name: "चिकन के टुकड़े", quantity: "1.5", unit: "किलो" },
                    { name: "ऑलस्पाइस", quantity: "1", unit: "टेबलस्पून" },
                    { name: "स्कॉच बोनट मिर्च", quantity: "2", unit: "पीस" },
                    { name: "सोया सॉस", quantity: "1/4", unit: "कप" },
                    { name: "ब्राउन शुगर", quantity: "2", unit: "टेबलस्पून" },
                    { name: "थाइम", quantity: "2", unit: "टेबलस्पून" },
                    { name: "लहसुन", quantity: "6", unit: "कली" },
                    { name: "अदरक", quantity: "2", unit: "टेबलस्पून" },
                    { name: "हरी प्याज", quantity: "6", unit: "डंठल" },
                    { name: "जैतून का तेल", quantity: "1/4", unit: "कप" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1", unit: "टीस्पून" },
                    { name: "जायफल", quantity: "1/2", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "सभी मैरिनेड सामग्री को पेस्ट बनने तक ब्लेंड करें।" },
                    { step: 2, description: "चिकन के टुकड़ों पर कट लगाएँ और 4-24 घंटे के लिए मेरिनेट करें।" },
                    { step: 3, description: "ग्रिल को मध्यम-उच्च तापमान पर पहले से गर्म करें।" },
                    { step: 4, description: "चिकन को मैरिनेड से निकालें।" },
                    { step: 5, description: "चिकन को प्रत्येक तरफ 6-8 मिनट तक ग्रिल करें।" },
                    { step: 6, description: "ग्रिलिंग के दौरान बची हुई मैरिनेड लगाएं।" },
                    { step: 7, description: "परोसने से पहले 5 मिनट के लिए आराम दें।" },
                    { step: 8, description: "फेस्टिवल ब्रेड और कोलस्लॉ के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Ceviche",
        description: "Peruvian fresh fish marinated in lime juice with onions and cilantro",
        image: "https://www.feastingathome.com/wp-content/uploads/2015/04/Ceviche-11.jpg",
        video: "https://www.youtube.com/embed/Ad3SiHgfTqo",
        cuisine: "Peruvian",
        category: "appetizer",
        difficulty: "easy",
        prepTime: 30,
        cookTime: 0,
        servings: 6,
        ingredients: [
            { name: "Fresh white fish", quantity: "500", unit: "g" },
            { name: "Lime juice", quantity: "1", unit: "cup" },
            { name: "Red onion", quantity: "1", unit: "large" },
            { name: "Cilantro", quantity: "1/2", unit: "cup" },
            { name: "Aji amarillo", quantity: "1", unit: "tbsp" },
            { name: "Garlic", quantity: "2", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Sweet potato", quantity: "1", unit: "large" },
            { name: "Corn", quantity: "1", unit: "ear" },
            { name: "Lettuce leaves", quantity: "6", unit: "pieces" }
        ],
        instructions: [
            { step: 1, description: "Cut fish into 1-inch cubes" },
            { step: 2, description: "Marinate fish in lime juice for 20-30 minutes" },
            { step: 3, description: "Thinly slice red onion and soak in cold water" },
            { step: 4, description: "Boil sweet potato and corn until tender" },
            { step: 5, description: "Drain onion and mix with fish" },
            { step: 6, description: "Add cilantro, aji amarillo, garlic, ginger, salt" },
            { step: 7, description: "Mix gently and let sit for 10 minutes" },
            { step: 8, description: "Serve on lettuce with sweet potato and corn" }
        ],
        nutrition: {
            calories: 180,
            protein: 22,
            carbs: 15,
            fat: 4
        },
        tags: ["peruvian", "fish", "citrus", "fresh", "no-cook"],
        translations: {
            hi: {
                title: "सेविचे",
                description: "पेरू की ताज़ा मछली जिसे नींबू के रस में प्याज़ और धनिया के साथ मेरिनेट किया गया है",
                ingredients: [
                    { name: "ताज़ी सफ़ेद मछली", quantity: "500", unit: "ग्राम" },
                    { name: "नींबू का रस", quantity: "1", unit: "कप" },
                    { name: "लाल प्याज़", quantity: "1", unit: "बड़ा" },
                    { name: "धनिया", quantity: "1/2", unit: "कप" },
                    { name: "अजी अमेरिलो", quantity: "1", unit: "टेबलस्पून" },
                    { name: "लहसुन", quantity: "2", unit: "कली" },
                    { name: "अदरक", quantity: "1", unit: "टीस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" },
                    { name: "शकरकंद", quantity: "1", unit: "बड़ा" },
                    { name: "भुट्टा", quantity: "1", unit: "भुट्टे का डंठल" },
                    { name: "सलाद के पत्ते", quantity: "6", unit: "पीस" }
                ],
                instructions: [
                    { step: 1, description: "मछली को 1 इंच के टुकड़ों में काटें।" },
                    { step: 2, description: "मछली को नींबू के रस में 20-30 मिनट के लिए मेरिनेट करें।" },
                    { step: 3, description: "लाल प्याज़ को पतला काटें और ठंडे पानी में भिगोएँ।" },
                    { step: 4, description: "शकरकंद और भुट्टा को नरम होने तक उबालें।" },
                    { step: 5, description: "प्याज़ का पानी निकालें और मछली के साथ मिलाएँ।" },
                    { step: 6, description: "धनिया, अजी अमेरिलो, लहसुन, अदरक और नमक डालें।" },
                    { step: 7, description: "धीरे से मिलाएँ और 10 मिनट के लिए छोड़ दें।" },
                    { step: 8, description: "सलाद के पत्तों पर शकरकंद और भुट्टे के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Doner Kebab",
        description: "Turkish spiced meat roasted on vertical spit, served in bread",
        image: "https://tse2.mm.bing.net/th/id/OIP.dJOVHCYzKNTjlQ64WFFQcQHaGl?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        video: "https://www.youtube.com/embed/gL1SBt5Tyco",
        cuisine: "Turkish",
        category: "main course",
        difficulty: "hard",
        prepTime: 60,
        cookTime: 60,
        servings: 6,
        ingredients: [
            { name: "Ground lamb", quantity: "500", unit: "g" },
            { name: "Ground beef", quantity: "500", unit: "g" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Cumin", quantity: "2", unit: "tsp" },
            { name: "Paprika", quantity: "2", unit: "tsp" },
            { name: "Oregano", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "2", unit: "tsp" },
            { name: "Black pepper", quantity: "1", unit: "tsp" },
            { name: "Olive oil", quantity: "2", unit: "tbsp" },
            { name: "Pita bread", quantity: "6", unit: "pieces" },
            { name: "Tomatoes", quantity: "2", unit: "large" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Lettuce", quantity: "1", unit: "head" },
            { name: "Yogurt", quantity: "1", unit: "cup" }
        ],
        instructions: [
            { step: 1, description: "Mix ground meats with grated onion and garlic" },
            { step: 2, description: "Add all spices and olive oil" },
            { step: 3, description: "Knead mixture for 10 minutes until sticky" },
            { step: 4, description: "Shape into loaf and refrigerate for 30 minutes" },
            { step: 5, description: "Roast in oven at 200°C for 45-60 minutes" },
            { step: 6, description: "Slice thinly as it cooks" },
            { step: 7, description: "Serve in pita with tomatoes, onions, lettuce, and yogurt" }
        ],
        nutrition: {
            calories: 450,
            protein: 32,
            carbs: 25,
            fat: 24
        },
        tags: ["turkish", "kebab", "lamb", "beef", "street-food"],
        translations: {
            hi: {
                title: "डोनेर कबाब",
                description: "तुर्की का मसालेदार मांस जिसे वर्टिकल स्पिट पर रोस्ट किया जाता है और ब्रेड में परोसा जाता है।",
                ingredients: [
                    { name: "ग्राउंड लैम्ब", quantity: "500", unit: "ग्राम" },
                    { name: "ग्राउंड बीफ", quantity: "500", unit: "ग्राम" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "लहसुन", quantity: "4", unit: "कली" },
                    { name: "जीरा", quantity: "2", unit: "टीस्पून" },
                    { name: "पाप्रिका", quantity: "2", unit: "टीस्पून" },
                    { name: "अजवायन", quantity: "1", unit: "टीस्पून" },
                    { name: "नमक", quantity: "2", unit: "टीस्पून" },
                    { name: "काली मिर्च", quantity: "1", unit: "टीस्पून" },
                    { name: "जैतून का तेल", quantity: "2", unit: "टेबलस्पून" },
                    { name: "पीटा ब्रेड", quantity: "6", unit: "पीस" },
                    { name: "टमाटर", quantity: "2", unit: "बड़ा" },
                    { name: "प्याज", quantity: "2", unit: "मध्यम" },
                    { name: "सलाद", quantity: "1", unit: "सिर" },
                    { name: "दही", quantity: "1", unit: "कप" }
                ],
                instructions: [
                    { step: 1, description: "ग्राउंड मीट्स को कद्दूकस किया प्याज और लहसुन के साथ मिलाएँ।" },
                    { step: 2, description: "सभी मसाले और जैतून का तेल डालें।" },
                    { step: 3, description: "मिक्सचर को 10 मिनट तक गूँथें जब तक यह चिपचिपा न हो जाए।" },
                    { step: 4, description: "लोफ का आकार दें और 30 मिनट के लिए फ्रिज में रखें।" },
                    { step: 5, description: "200°C ओवन में 45-60 मिनट तक रोस्ट करें।" },
                    { step: 6, description: "पकते समय पतला-पतला काटें।" },
                    { step: 7, description: "पीटा ब्रेड में टमाटर, प्याज, सलाद और दही के साथ परोसें।" }
                ]
            }
        }
    },
    {
        title: "Nasi Goreng",
        description: "Indonesian fried rice with sweet soy sauce and vegetables",
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
        video: "https://www.youtube.com/embed/r3P-x12qvsw",
        cuisine: "Indonesian",
        category: "main course",
        difficulty: "easy",
        prepTime: 15,
        cookTime: 15,
        servings: 4,
        ingredients: [
            { name: "Cooked rice", quantity: "4", unit: "cups" },
            { name: "Chicken breast", quantity: "200", unit: "g" },
            { name: "Shrimp", quantity: "150", unit: "g" },
            { name: "Eggs", quantity: "3", unit: "large" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Carrot", quantity: "1", unit: "medium" },
            { name: "Green onions", quantity: "4", unit: "stalks" },
            { name: "Sweet soy sauce", quantity: "3", unit: "tbsp" },
            { name: "Soy sauce", quantity: "2", unit: "tbsp" },
            { name: "Chili sauce", quantity: "1", unit: "tbsp" },
            { name: "Oil", quantity: "3", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Cut chicken and shrimp into small pieces" },
            { step: 2, description: "Heat oil and scramble eggs, set aside" },
            { step: 3, description: "Sauté onion, garlic, and carrot" },
            { step: 4, description: "Add chicken and shrimp, cook until done" },
            { step: 5, description: "Add rice and break up clumps" },
            { step: 6, description: "Mix in all sauces and seasonings" },
            { step: 7, description: "Add scrambled eggs and green onions" },
            { step: 8, description: "Serve hot with fried egg on top" }
        ],
        nutrition: {
            calories: 420,
            protein: 25,
            carbs: 50,
            fat: 14
        },
        tags: ["indonesian", "rice", "fried", "sweet-salty", "quick"],
        translations: {
            hi: {
                title: "नासी गोरेंग",
                description: "इंडोनेशियाई तली हुई चावल की डिश जिसमें मीठी सोया सॉस और सब्ज़ियाँ शामिल हैं।",
                ingredients: [
                    { name: "पके हुए चावल", quantity: "4", unit: "कप" },
                    { name: "चिकन ब्रेस्ट", quantity: "200", unit: "ग्राम" },
                    { name: "झींगा", quantity: "150", unit: "ग्राम" },
                    { name: "अंडे", quantity: "3", unit: "बड़े" },
                    { name: "प्याज", quantity: "1", unit: "बड़ा" },
                    { name: "लहसुन", quantity: "4", unit: "कली" },
                    { name: "गाजर", quantity: "1", unit: "मध्यम" },
                    { name: "हरी प्याज़", quantity: "4", unit: "डंठल" },
                    { name: "मीठी सोया सॉस", quantity: "3", unit: "टेबलस्पून" },
                    { name: "सोया सॉस", quantity: "2", unit: "टेबलस्पून" },
                    { name: "चिली सॉस", quantity: "1", unit: "टेबलस्पून" },
                    { name: "तेल", quantity: "3", unit: "टेबलस्पून" },
                    { name: "नमक", quantity: "1", unit: "टीस्पून" }
                ],
                instructions: [
                    { step: 1, description: "चिकन और झींगे को छोटे टुकड़ों में काटें।" },
                    { step: 2, description: "तेल गर्म करें और अंडे को भूनकर अलग रख दें।" },
                    { step: 3, description: "प्याज, लहसुन और गाजर को भूनें।" },
                    { step: 4, description: "चिकन और झींगे डालें, पकने तक पकाएँ।" },
                    { step: 5, description: "चावल डालें और गुठलियों को तोड़ें।" },
                    { step: 6, description: "सभी सॉस और मसाले मिलाएँ।" },
                    { step: 7, description: "भुने हुए अंडे और हरी प्याज़ डालें।" },
                    { step: 8, description: "ऊपर से तला हुआ अंडा डालकर गरम परोसें।" }
                ]
            }
        }
    }

];

module.exports = sampleRecipes;
