const coverEl = document.querySelector('.cover-container')
const submit = document.querySelector('#submit')
const search = document.querySelector('#search')
const randomBtn = document.querySelector('#random')
const closeBtn = document.querySelector('.close-single-meal')
const noResult = document.querySelector('.no-result')
const invalidSearchEl = document.querySelector('.invalid-search')
const singleMealsEl = document.querySelectorAll('.single-meal')
const meals = document.querySelector('#meals')

const singleMealContainer = document.querySelector('.single-meal-container')
const recipe = document.querySelector('.recipe')
const mealName = document.querySelector('.meal-name')
const mealImg = document.querySelector('.meal-img')
const mealDetails = document.querySelector('.meal-details')
const mealCategory = document.querySelector('.meal-details .category')
const mealArea = document.querySelector('.meal-details .area')
const mealInfo = document.querySelector('.meal-info')
const mealAbout = document.querySelector('.meal-about')
const mealInstructions = document.querySelector('.meal-instructions')
const mealIngredients = document.querySelector('.meal-ingredients')

const linkToYt = document.querySelector('.link')

// Onload animation
const removeSlide = () => {
    setTimeout(() => {
        coverEl.classList.remove('show')
    }, 1000);
}
window.onload = removeSlide()

const clearAll = () => {
    meals.innerHTML = ''
    mealName.textContent = ''
    mealImg.removeAttribute('src')
    mealCategory.textContent = ''
    mealArea.textContent = ''
    mealIngredients.innerHTML = ''
}

const searchMeal = (e) => {
    e.preventDefault()

    // Clear meals container
    clearAll()

    // Get search term
    const term = search.value 

    // Fetch data and make it visible
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            if (data.meals === null) {
                noResult.textContent = `There is no meal such as "${term}"`
                noResult.classList.add('visible')
            } else {
                if (noResult.classList.contains('visible')) {
                    noResult.classList.remove('visible')
                }
                // Make DOM element for each meal
                for (let i = 0; i < data.meals.length; i++) {
                    const singleMealName = data.meals[i].strMeal
                    const singleMealImg = data.meals[i].strMealThumb
                    const mealEl = document.createElement('div')
                    mealEl.classList.add('single-meal')

                    mealEl.innerHTML = `
                    <img src="${singleMealImg}" alt="${singleMealName}">
                    <h2>${singleMealName}</h2>
                    `
                    meals.appendChild(mealEl)
                    // Add Event on every single meal
                    mealEl.addEventListener('click', () => {
                        const meal = data.meals.find(meal => meal.strMeal === singleMealName)
                        openRecipe(meal)
                    })
                }
            }
            })
    } else {
        showAlert()
    }
}

const openRecipe = meal => {
    // Open single meal overlay 
    document.body.classList.add('noscroll')
    singleMealContainer.classList.add('open')
    
    // Show all recipe data
    mealName.textContent = meal.strMeal
    mealImg.src = meal.strMealThumb
    mealCategory.textContent = `Category: ${meal.strCategory}`
    mealArea.textContent = `Area: ${meal.strArea}`
    mealDetails.appendChild(mealArea, mealCategory)
    mealInstructions.textContent = meal.strInstructions
    // Find ingredients
    mealIngredients.innerHTML = ''
    for (let i = 0; i < 20; i++) {
        if (meal["strIngredient" + i]) {
            const ingredient = document.createElement('p')
            ingredient.innerHTML = `
            <span class="measure">${meal["strMeasure" + i]}</span> ${meal["strIngredient" + i]}
            `
            mealIngredients.appendChild(ingredient)
        }
    }
    
    linkToYt.innerHTML = `Watch meal preparation <a href="${meal.strYoutube} target="_blank">here</a>`
}

const close = () => {
    document.body.classList.remove('noscroll')
    singleMealContainer.classList.remove('open')
}

const showRandomMeal = () => {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0]
        openRecipe(meal)
    })
}

// Invalid search alert
const showAlert = () => {
    invalidSearchEl.classList.add('show')
    setTimeout(() => {
        invalidSearchEl.classList.remove('show')
    }, 2000);
}

// Close recipe on click outside 
singleMealContainer.addEventListener('click', e => {
    if (e.target === singleMealContainer) {
        close()
    }
})

submit.addEventListener('submit', searchMeal)
closeBtn.addEventListener('click', close)
randomBtn.addEventListener('click', showRandomMeal)