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