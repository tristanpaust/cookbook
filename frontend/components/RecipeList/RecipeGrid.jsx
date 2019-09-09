import React, { Component } from 'react';
import MuuriGrid from 'react-muuri';
import '../../css/MuuriGrid.css'

import { NavLink } from 'react-router-dom';

export default class RecipeGrid extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      searchString: '',
      typeFilter: '',
      originFilter: ''
    };

    this.createItems = this.createItems.bind(this);
    this.filter = this.filter.bind(this);
    this.rebuildGridOnPageChange = this.rebuildGridOnPageChange.bind(this);
    this.buildSearchResults = this.buildSearchResults.bind(this);
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

  componentDidUpdate(prevProps) {
    if (prevProps.searchString !== this.props.searchString) {
       this.setState({
        searchString: this.props.searchString
       }, () => {
        this.filter();
      }); 
    }
    if (prevProps.typeFilter !== this.props.typeFilter) {
       this.setState({
        typeFilter: this.props.typeFilter
       }, () => {
        this.filter();
      });
    }
    if (prevProps.originFilter !== this.props.originFilter) {
       this.setState({
        originFilter: this.props.originFilter
       }, () => {
        this.filter();
      });
    }
    if (prevProps.recipesOnPage !== this.props.recipesOnPage) {
      this.grid.getMethod('destroy');
    }
    if ((prevProps.searchResults != this.props.searchResults) && this.props.searchResults.length) {
      this.buildSearchResults()
    }    
    if (prevProps.firstItem !== this.props.firstItem || (prevProps.searchResults.length && !this.props.searchResults.length)) {
      this.rebuildGridOnPageChange()
    }
  }

  componentWillUnmount() {
    this.grid.getMethod('destroy'); // Required: Destroy the grid when the component is unmounted.    
  }

  filter() {
    let searchFilter = this.state.searchString,
        typeFilter = this.state.typeFilter,
        originFilter  = this.state.originFilter;

    this.grid.getMethod('filter', function (item) {
      let element = item.getElement(),
          isSearchMatch = !searchFilter ? true : (element.getAttribute('data-title') || '').toLowerCase().indexOf(searchFilter) > -1,
          isFilterTypeMatch = !typeFilter ? true : (element.getAttribute('data-type') || '') === typeFilter,
          isFilterOriginMatch = !originFilter ? true : (element.getAttribute('data-origin') || '') === originFilter;
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

  rebuildGridOnPageChange() {
    var currentElements = this.grid.getMethod('getItems'); 
    var i = currentElements.length;
    while (i--) {
        this.grid.getMethod('remove', currentElements[i], {removeElements: true});
        currentElements.splice(i, 1);
    }

    let newElements = [];
    var end = this.props.lastItem
    if (end > this.props.entries.length) {
      end = this.props.entries.length;
    }
    for (let i = this.props.firstItem; i < end; i++) {
      let item = this.props.entries[i];
      var itemElem = document.createElement('div');
      let imageUrl = process.env.PUBLIC_URL + '/users/' + item.image;

      let itemTemplate = 
        '<div class="item box1" key="' + item._id + '" title="' + item.title + '" data-title="' + item.title + '" data-type="' + item.formType + '" data-origin="' + item.origin + '">' +
          '<a href="/recipe/view/' + item._id + '">' + 
            '<div class="item-content">' + 
              '<div class="background-image" style="background-image: url(' + imageUrl +'")></div>' +
                '<div class="tile-banner">' + 
                '<p class="recipe-tile-header col">' + item.title + '</p>' +
              '</div>' +
            '</div>' +
          '</a>' +
        '</div>';

      itemElem.innerHTML = itemTemplate;
      newElements.push(itemElem.firstChild);
    }
    this.grid.getMethod('add', newElements);
  }

   buildSearchResults() {
    var currentElements = this.grid.getMethod('getItems'); 
    var i = currentElements.length;
    while (i--) {
        this.grid.getMethod('remove', currentElements[i], {removeElements: true});
        currentElements.splice(i, 1);
    }

    let newElements = [];

    for (let i = 0; i < this.props.searchResults.length; i++) {
      let item = this.props.searchResults[i];
      var itemElem = document.createElement('div');
      let imageUrl = process.env.PUBLIC_URL + '/users/' + item.image;

      let itemTemplate = 
        '<div class="item box1" key="' + item._id + '" title="' + item.title + '" data-title="' + item.title + '" data-type="' + item.formType + '" data-origin="' + item.origin + '">' +
          '<a href="/recipe/view/' + item._id + '">' + 
            '<div class="item-content">' + 
              '<div class="background-image" style="background-image: url(' + imageUrl +'")></div>' +
                '<div class="tile-banner">' + 
                '<p class="recipe-tile-header col">' + item.title + '</p>' +
              '</div>' +
            '</div>' +
          '</a>' +
        '</div>';

      itemElem.innerHTML = itemTemplate;
      newElements.push(itemElem.firstChild);
    }
    this.grid.getMethod('add', newElements);
  } 

  render () {
    var currentRecipes = this.props.entries.slice(this.props.firstItem, this.props.lastItem);
    var listItems;
    if (this.props.firstItem === 0) {
      listItems = currentRecipes.map(this.createItems);
    }

    return (
      <div>

        <div ref={gridElement => this.gridElement = gridElement}>
          {listItems}
        </div>

      </div>
    )
  }
}