// https://www.themealdb.com/api.php
const foundRecipes = document.querySelector('.found-recipes')
let categoryList = []
let ingredientsList = []

//GET CATEGORIES
fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`)
.then((response)=>data=response.json())
.then((data)=>{
    create_category(data)
})

//SEARCH
document.querySelector('.header-search').addEventListener("input", (e)=>{
    e.preventDefault();
    foundRecipes.innerHTML = ""
    find_by_name()
})

//FIND BY NAME
const find_by_name = ()=>{
    let searchQuery = document.querySelector('.search-input').value
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then((response)=>data=response.json())
    .then((data)=>{
        meals(data.meals)
    })
}

const meals = (meals)=>{
    if (meals != null){
        for (let meal of meals){
            create_article(meal)
        }
    }
}

const create_article = (meal)=>{
    const article = document.createElement('article')
    article.className = "ps-0 pe-3 pb-4"
    article.innerHTML = `
        <div class="card col rounded-4">
            <img src="${meal.strMealThumb}" class="rounded-top-4" alt="Tofu">
            <div class="card-body row">
                <h5 class="card-title col-9 pe-0">${meal.strMeal}</h5>
                <ul class="card-rating col p-0">
                    <li><i class="fa-solid fa-star" style="color: #ffa348;"></i></li>
                    <li>4.6</li>
                </ul>
                <ul class="card-info d-flex">
                    <li class="cooking-time">25min</li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="3" height="3" viewBox="0 0 3 3" fill="none">
                            <circle cx="1.5" cy="1.5" r="1.5" fill="#797979"/>
                        </svg>
                    </li>
                    <li class="category-tag">${meal.strCategory}</li>
                </ul>
            </div>
            <div class="card-img-overlay d-flex justify-content-end p-0 pt-4 pe-2">
                <i class="fa-regular fa-heart fa-2xl" style="color: #ffa348;"></i>
            </div>
        </div>`
    foundRecipes.appendChild(article)
    article.onclick = (e)=>{
        let a = article.getBoundingClientRect().top -e.clientY
        let y = window.scrollY + article.getBoundingClientRect().top -e.clientY -a
        let x = window.scrollY + article.getBoundingClientRect().left
        const pos = [x, y]

        document.querySelector('main').style.display = 'none'
        document.querySelector('header').style.display = 'none'
        create_section_recipe(meal, pos)
    }
}


const create_section_recipe = (meal, pos)=>{
    let ingredientsCount = get_ingredients(meal)
    let measureList = get_measure(meal, ingredientsCount)
    let youtubeLink = meal.strYoutube
    youtubeLink = youtubeLink.replace("watch?v=","embed/")
    document.querySelector('.full-recipe').innerHTML = `
    <div class="recipe-button d-flex justify-content-between">
        <a class="recipe-button_go-back btn rounded-circle"><i class="fa-solid fa-chevron-left fa-xl" style="color: #ffffff;"></i></a>
        <a href="#" class="recipe-button_like btn rounded-circle"><i class="fa-solid fa-heart fa-xl"></i></a>
    </div>
    <div class="video">
        <div class="card">
            <img src="${meal.strMealThumb}" class="card-img" alt="picture of recipe">
            <div class="card-img-overlay d-flex">
                <h4 class="recipe-name">${meal.strMeal}</h4>
                <div class="watch-cooking-video">
                <a href="#" class="btn" data-bs-toggle="modal" data-bs-target="#videoModal"><i class="fa-solid fa-play"></i>  Watch the video</a>
            </div>
        </div>
        </div>
        <div class="modal fade" id="videoModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content" style="background: none; border: none;">
                    <div class="modal-body d-flex flex-wrap justify-content-center">
                        <iframe width="560" height="315" src=${youtubeLink} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="recipe-info">
        <div class="recipe-info__buttons row column-gap-3 m-0">
            <a href="#" class="btn btn-primary active col ingredients-button">Ingredients</a>
            <!-- <button class="btn btn-primary active col ingredients-button">Ingredients</button> -->
            <a href="#" class="btn btn-primary col details-button">Details</a>
            <!-- <button class="btn btn-primary col details-button">Details</button> -->
        </div>
        <div class="recipe-info__ingredients">
            <h3 class="ingredients-count">${ingredientsCount} items</h3>
            <ul class="ingredients-list">
            </ul>
        </div>
    </div>
    <div class="recipe-bottom-overlay">
    </div>
    `

    const ul = document.querySelector('.ingredients-list')
    let m = 0
    for(let i of ingredientsList){
        const li = document.createElement('li')
        li.innerHTML = `${measureList[m++]} ${i}`
        ul.appendChild(li)
    }

    window.scrollTo(0, 0)

    const goBack = document.querySelector(".recipe-button_go-back")
    goBack.onclick = ()=>{
        document.querySelector('main').style.display = 'block'
        document.querySelector('header').style.display = 'block'
        document.querySelector('.full-recipe').innerHTML = ""
        window.scrollTo(pos[0], pos[1])
    }
    

}

const get_ingredients = (meal)=>{
    ingredientsList = []
    let ingredientsCount = -1
    for(let i=9; i <= 28; i++){
        ingredientsCount++
        ingredient = meal[Object.keys(meal)[i]]
        if (ingredient === "" || ingredient === ' ' || ingredient === null){
            return ingredientsCount
        }
        else{
            ingredientsList.push(ingredient)
        }
    }
    return ingredientsCount
}

const get_measure = (meal, ingredientsCount)=>{
    let measureList = []
    for(let i=29; i<=(29+ingredientsCount); i++){
        let measure = meal[Object.keys(meal)[i]]
         measureList.push(measure)
    }
    return measureList
}

const create_category = (data)=>{
    for (let meal of data.meals){
        categoryList.push(meal.strCategory)
        const li = document.createElement('li')
        li.innerHTML = `<a class="btn btn-primary" href="#">${meal.strCategory}</a>`
        document.querySelector('.category ul').appendChild(li)
        li.onclick = ()=>{
            foundRecipes.innerHTML = ""
            find_by_ctegory(meal.strCategory)
        }
    }
}

//FIND BY CATEGORY
const find_by_ctegory = (category)=>{
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((response)=>data=response.json())
    .then((data)=>{
        for(let meal of data.meals){
            find_by_ID(meal.idMeal)
        }
    })
}

//FIND BY ID
const find_by_ID = (mealID)=>{
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((response)=>data=response.json())
    .then((data)=>{
        create_article(data.meals[0])
    })
}