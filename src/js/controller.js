import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import { async } from 'regenerator-runtime';


//if (module.hot) {
  //module.hot.accept();
//}
///////////////////////////////////////

const controlRecipes = async function() {
  try {

    const id = window.location.hash.slice(1);

    if(!id) return;

    recipeView.renderSpinner();

    // 0) Results View to Mark selected Search result
    resultsView.update(model.getSearchResultsPage()); // to not re-render search results images and data // 
   
    // 0.5) Updating Bookmarks View
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);


  } catch (error) {
    recipeView.renderError();
  }
};


const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1) Get Search Query
    const query = searchView.getQuery();
    if(!query) return;
    

    // 2) Load Search results
    await model.loadSearchResults(`${query}`);
    // 3) Render Results 
    resultsView.render(model.getSearchResultsPage());
    // 3.5) Render Pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function(goToPage) {
  // 1) Render NEW Results 
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render NEW Pagination
  paginationView.render(model.state.search);
};


const controlServings = function(newServings) {
  // Update th recipe Servings ( in State)
  model.updateServings(newServings);
  // Update the Recipe View
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

};

const controladdBookmark = function() {
  // 1) Add/Remove Bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update Recipe View
  recipeView.update(model.state.recipe);

  //3) Render the Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render Spinner
    addRecipeView.renderSpinner();
    // Upload new Recipe Data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Dispaly Success Message
    addRecipeView.renderSuccess();
    // Render bookmarkView
    bookmarksView.render(model.state.bookmarks);
    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    
    // Close Form
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);

  } catch (error) {
    console.error('🚨', error);
    addRecipeView.renderError(error.message);
  }

};

const init = function() {
  searchView.addHandlerSearch(controlSearchResults);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controladdBookmark);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();