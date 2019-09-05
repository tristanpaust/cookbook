import React, { Component } from 'react';
import MuuriGrid from 'react-muuri';
import '../css/MuuriGrid.css'

import { NavLink } from 'react-router-dom';
import {dishOptions} from './SelectOptions.jsx';
import {countryOptions} from './SelectOptions.jsx';
import Select from 'react-select';

export default class RecipeGrid extends Component {
  constructor() {
    super();    
    this.state = {
      recipeTypeValue: '',
      originValue: '',

      searchFieldValue: '',
      filterTypeFieldValue: '',
    };

    this.createItems = this.createItems.bind(this);
    this.removeElement = this.removeElement.bind(this);

    this.onChangeSearchField = this.onChangeSearchField.bind(this);
    this.onChangeTypeField = this.onChangeTypeField.bind(this);
    this.onChangeOriginField = this.onChangeOriginField.bind(this);

    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    this.grid = new MuuriGrid({
      node: this.gridElement,
      defaultOptions: {
        dragEnabled: false,
        layoutOnResize: true,
        layoutDuration: 200,
        layoutEasing: 'ease',        
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

  
  onChangeSearchField(e) {
    if (this.state.searchFieldValue !== e.target.value) {
      this.setState({
        searchFieldValue: e.target.value
      }, () => {
        this.filter();
      });
    }
  }

  onChangeTypeField(newValue, actionMeta) {
    this.setState({
      filterTypeFieldValue: newValue.value
    }, () => {
      this.filter();
    });
  }

  onChangeOriginField(newValue, actionMeta) {
    this.setState({
      filterOriginFieldValue: newValue.label
    }, () => {
      this.filter();
    });    
  }

  filter() {
    let searchFieldValue = this.state.searchFieldValue;
    let filterTypeFieldValue = this.state.filterTypeFieldValue;
    let filterOriginFieldValue = this.state.filterOriginFieldValue;
console.log(filterOriginFieldValue)

    this.grid.getMethod('filter', function (item) {
      var element = item.getElement();
      var isSearchMatch = !searchFieldValue ? true : (element.getAttribute('data-title') || '').toLowerCase().indexOf(searchFieldValue) > -1;
      var isFilterTypeMatch = !filterTypeFieldValue ? true : (element.getAttribute('data-type') || '') === filterTypeFieldValue;
      var isFilterOriginMatch = !filterOriginFieldValue ? true : (element.getAttribute('data-origin') || '') === filterOriginFieldValue;
      return isSearchMatch && isFilterTypeMatch && isFilterOriginMatch;
    }); 
  }


  createItems(item) {
    let imageUrl = process.env.PUBLIC_URL + '/users/' + item.image;
    return (
      <div className="item box1" key={item._id} title={item.title} data-title={item.title} data-type={item.formType} data-origin={item.origin}>
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
        <input type="text" className="form-control search-recipe-text-input" placeholder="Suchen" onChange={this.onChangeSearchField}/>

                    <Select
                      isClearable
                      label="Single select"
                      options={dishOptions}
                      onChange={this.onChangeTypeField}
                      className="search-recipe-input"
                      value={this.state.recipeTypeValue}
                      placeholder="-- Rezeptart --"
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          text: '#6a7989',
                          primary25: '#289fad',
                          primary: '#6a7989',
                        },
                      })}                  
                    />

                      <Select
                      isClearable
                      placeholder="-- Herkunfsland --"
                      label="Single select"
                      onChange={this.onChangeOriginField}
                      options={countryOptions}
                      className="search-recipe-input"
                      value={this.state.originValue}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          text: '#6a7989',
                          primary25: '#289fad',
                          primary: '#6a7989',
                        },
                      })}
                    />


        <div ref={gridElement => this.gridElement = gridElement}>

          {listItems}

          </div>
      </div>
    )
  }
}