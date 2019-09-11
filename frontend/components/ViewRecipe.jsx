import React, { Component } from 'react';
import '../css/ViewRecipe.css';
import '../global.jsx'

export default class ViewRecipe extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      isFetchingData: true,      
      message: 'Loading...',
      recipe: {},
      calculateServings: 1,
      isFavorite: false
    }

    this.getCourseTypeName = this.getCourseTypeName.bind(this);
    this.buildIngredients = this.buildIngredients.bind(this);
    this.buildTags = this.buildTags.bind(this);

    this.increasePeople = this.increasePeople.bind(this);
    this.decreasePeople = this.decreasePeople.bind(this);
    this.handleServingsChange = this.handleServingsChange.bind(this);

    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  async componentDidMount() {
      const res = await (global.FetchWithHeaders('GET', 'api/getrecipebyid?q=' + this.props.match.params.id))
      this.setState({
        isFetchingData: false,
        recipe: res[0],
        isLoading: false
      })

      const user = await (global.FetchWithHeaders('GET', 'api/getcurrentuser'))
      console.log(user)

      if (user.favorites.includes(this.state.recipe._id)) {
        this.setState({
          isFavorite: true
        })
      }
  }

  getCourseTypeName(courseType) {
    if (courseType === 'starter' ) {
      return "Vorspeise";
    }
    if (courseType === 'main' ) {
      return "Hauptspeise";
    }
    if (courseType === 'dessert' ) {
      return "Nachspeise";
    }
    if (courseType === 'side' ) {
      return "Beilage";
    }
    if (courseType === 'sauce' ) {
      return "Sauce/Dressing";
    }    
  }

  buildSteps(step) {
    return (
      <li key={step[0]}>
        {step[1]}
      </li>
    )
  }

  buildIngredients(ingredient) {
    return (
      <li key={ingredient._id}>
        {(ingredient.amount * this.state.calculateServings)} {ingredient.unit.title} {ingredient.item.title}
      </li>
    )
  }

  buildTags(tag) {
    return (
      <li key={tag._id}>
        {tag.title}
      </li>
    )
  }

  increasePeople() {
    this.setState({calculateServings: parseInt(this.state.calculateServings) + 1});
  }
  
  decreasePeople() {
    if (parseInt(this.state.calculateServings) > 1) {
      this.setState({calculateServings: parseInt(this.state.calculateServings) - 1});
    }
  }

  handleServingsChange(e) {
    this.setState({calculateServings: e.target.value})
  }  
  
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async addFavorite() {
    await this.setStateAsync({ isFavorite: true });
    await (global.FetchTextWithHeaders('POST', 'api/addfavorite', {recipeID: this.state.recipe._id} ))    
  }

  async removeFavorite() {
    await this.setStateAsync({ isFavorite: false });
    await (global.FetchTextWithHeaders('POST', 'api/removefavorite', {recipeID: this.state.recipe._id} ))
  }

  render() {
    if (this.state.isLoading) {
      return <p>{this.state.message}</p>;
    }
    else { 
      if (this.state.isFetchingData) {
        const spinner = document.getElementById('spinner');
        if (spinner && !spinner.hasAttribute('hidden')) {
          spinner.classList.remove('hidden');
        }
      }
      if (!this.state.isFetchingData) {
        const spinner = document.getElementById('spinner');
        if (spinner && !spinner.hasAttribute('hidden')) {
          spinner.classList.add('hidden');
        }
      }

      let stepArray = this.state.recipe.steps.split(",");
      var tempArray = [];

      for (let i = 0; i < stepArray.length; i++) {
        tempArray.push([i, stepArray[i]])
      }

      var recipeSteps = tempArray.map(this.buildSteps);
      var recipeIngredients = this.state.recipe.ingredients.map(this.buildIngredients);
      var recipeTags = this.state.recipe.tags.map(this.buildTags);

      return (
        <div className="container">
          <div className="container-fluid">

            <div className="d-flex justify-content-center hidden" id="spinner">
              <div className="spinner-border" role="status">
                <span className="sr-only">Laden...</span>
              </div>
            </div>

            <h1 className="headline">{this.state.recipe.title}
                <span className={"oi oi-star favorite-recipe " + (this.state.isFavorite ? 'hidden' : '')} onClick={this.addFavorite}></span>
                <span className={"oi oi-star favorite-recipe active " + (this.state.isFavorite ? '' : 'hidden')} onClick={this.removeFavorite}></span>

            </h1>

            <div className="row">
              <img className="col-7" src={process.env.PUBLIC_URL + '/users/' + this.state.recipe.image} />
              <div className="col">
                <p>{this.state.recipe.description}</p>
                <p>{this.state.recipe.origin}</p>
                <p>{this.getCourseTypeName(this.state.recipe.formType)}</p>
                <div className="wrapper">
                  <div className="value-button btn-danger" id="decrease" onClick={this.decreasePeople}>-</div>
                  <input type="text" pattern="[0-9]*" className="form-control" id="people" value={this.state.calculateServings} onChange={this.handleServingsChange}/>
                  <div className="value-button btn-success" id="increase" onClick={this.increasePeople}>+</div>
                </div>
                <ul className="tag-list">
                  {recipeTags}
                </ul>
              </div>
            </div>

            <hr />
            
            <h1 className="recipe-headline">Zutaten</h1>
            <ul className="ingredient-list">
              {recipeIngredients}
            </ul>

            <hr />

            <h1 className="recipe-headline">Schritte</h1>
            <ol className="step-list">
              {recipeSteps}
            </ol>

          </div>
        </div>

      );
    }
  }
}