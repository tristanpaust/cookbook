import React, { Component } from 'react';
import MuuriGrid from 'react-muuri';
import '../css/MuuriGrid.css'

import { NavLink } from 'react-router-dom';

export default class IngredientList extends Component {
  constructor(props) {
    super(props);

    this.createItems = this.createItems.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.navigateToRecipe = this.navigateToRecipe.bind(this);
  }

  componentDidMount() {
    this.grid = new MuuriGrid({
      node: this.gridElement,
      defaultOptions: {
        dragEnabled: false // See Muuri's documentation for other option overrides.
      },
    });
  }

  componentWillUnmount() {
    this.grid.getMethod('destroy'); // Required: Destroy the grid when the component is unmounted.
  }

  removeElement() {
    // An example of how to use `getMethod()` to remove an element from the grid.
    if (this.gridElement && this.gridElement.children.length) {
      this.grid.getMethod('remove', this.gridElement.children[0], {removeElements: true});
    }
  }

  navigateToRecipe(id) {
    this.props.history.push('/recipe/view/' + id)    
  }

  createItems(item) {
    let imageUrl = process.env.PUBLIC_URL + '/users/' + item.image;
    return (
      <div className="item box1" key={item._id} title={item.title}>
        <NavLink to={'/recipe/view/' + item._id}>
          <div className="item-content">
            <div className="background-image" style={{backgroundImage: `url(${imageUrl})`}}></div>
            <div className="tile-banner">
              <p className="recipe-tile-header col">{item.title}</p>
            </div>
          </div>
        </NavLink>
      </div>
    )
  }

  render () {
    var elements = this.props.entries;
    var listItems = elements.map(this.createItems);
    return (

      <div>
        <div ref={gridElement => this.gridElement = gridElement}>

          {listItems}

          </div>
      </div>
    )
  }
}