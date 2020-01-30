import React, { Component } from "react"; 

import './Popup.css';

import { Icon, InlineIcon } from '@iconify/react';
import checkmarkIcon from '@iconify/icons-gridicons/checkmark';
import crossIcon from '@iconify/icons-gridicons/cross';


import APIClient from '../../Actions/apiClient';

import AsyncCreatableSelect from 'react-select/async-creatable';
import UnitSelect from './UnitSelect.js';

import Popup from "reactjs-popup";
import Form from 'react-bootstrap/Form';

import { withTranslation } from 'react-i18next';
import i18n from "i18next";

const createOption = (label, id) => ({
  value: id,
  label
});

class IngredientSelect extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      value: [],
      ingredients: [],
      open: false,
      currentHeadlline: undefined,
      unit: undefined,
      amount: undefined,
      item: undefined,
      ingredientObjs: [],
    }
    this.onChange = this.onChange.bind(this);
    this.onGetIngredient = this.onGetIngredient.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

    this.handleUnitSelect = this.handleUnitSelect.bind(this);
    this.getAmount = this.getAmount.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.dismissModal = this.dismissModal.bind(this);

  }
  
  async componentDidMount() {
    this.apiClient = new APIClient();
  }

   onChange(newValue, actionMeta) {
    this.setState({ 
      value: [],
      item: newValue 
    });

    if (actionMeta.action === "select-option") { 
      // Add the ingredient to the array that keeps track of all ids
      this.state.ingredients.push(newValue);
    }
    if (actionMeta.action === "remove-value" || actionMeta.action === "pop-value") {
      // calculates diff between old and new list
      var index = 0;
      
      if (newValue) {
        let difference = this.state.value.filter(x => !newValue.includes(x)); 
        index = this.state.ingredients.indexOf(difference[0].value); 
      }
      // Get index of removed item in ingredients array
      if (index > -1) {
        // Remove the ingredient
        this.state.ingredients.splice(index, 1); 
      }
    }
    this.openModal(newValue);
  };

  async handleCreate(inputValue) {
    this.setState({ isLoading: true });

    const newOption = await (this.apiClient.createIngredient({title: inputValue}));  

    var ingredient = newOption.data;
    var option = createOption(ingredient.title, ingredient._id);
    this.setState({ 
      value: this.state.value.concat([option]),
      ingredients: this.state.ingredients.concat([option]),
      isLoading: false,
      item: option
    })
    console.log(newOption)
    this.openModal(option);
  }

  async onGetIngredient(value) {
    if (!value) {
      return Promise.resolve({ options: [] });
    }

    const response = await (this.apiClient.searchIngredient(value));

    const formatted = response.data.map((l) => {
      return Object.assign({}, {
        value: l._id,
        label: l.title
      });
    });
    return formatted;
  }

  openModal(headline) {
    if (headline === null) {
      return;
    }
    this.setState({ currentHeadlline: headline.label})
    this.setState({ open: true });
  }
  
  closeModal() {
      // If the array of ingredients already contains the selected one, just return and reset
      for (let i = 0; i < this.state.ingredientObjs.length; i++) {
        if (this.state.item !== undefined) {
          if (this.state.ingredientObjs[i].item.value === this.state.item.value) {
            return this.setState({ 
              open: false,
              item: undefined,
              unit: undefined,
              amount: undefined,
              value: {}
            });
          }
        }
      }
      // Otherwise build new object, pass to parent controller and return
      if (this.state.amount !== undefined && this.state.unit !== undefined) {
        let ingredient = {};
        ingredient.amount = this.state.amount;
        ingredient.unit = this.state.unit;
        ingredient.item = this.state.item;
        this.state.ingredientObjs.push(ingredient);
        this.props.onSelectIngredient(this.state.ingredientObjs);
      }

      return this.setState({ 
        open: false,
        item: undefined,
        unit: undefined,
        amount: undefined,
        value: {},
      });
  }

  dismissModal() {
    return this.setState({ 
      open: false,
      item: undefined,
      unit: undefined,
      amount: undefined,
      open: false
    });
  }

  getAmount(e) {
    // Store amount, as well as actual ingredient name and ID in state
    this.setState({amount: e.target.value});
  }

  handleUnitSelect(options) {
    this.setState({unit: options});
    if (this.refs.amountInput.value.length) {
      this.refs.closeModalBtn.focus();
    }
  }

  deleteIngredient(id) {    
    var array = [...this.state.ingredientObjs];
    for (let i = 0; i < array.length; i++) {
      if (array[i]['item'].value === id) {
        array.splice(i, 1);
        this.setState({ingredientObjs: array});
      }
    }
  }

  render() {
    const { t } = this.props;

    return (
      <div className="async-ingredient-control">
        <AsyncCreatableSelect
          isClearable
          isDisabled={this.state.isLoading}
          isLoading={this.state.isLoading}
          backspaceRemoves={true}           
          value={this.state.value}
          loadOptions={this.onGetIngredient}
          onChange={this.onChange}
          onCreateOption={this.handleCreate}
          placeholder={t('ingredient.searchingredient')}
        />

        <Popup
          open={this.state.open}
          modal
          onClose={this.closeModal}
        >
          <h2>{this.state.currentHeadlline}</h2>
          
          <div className="row popup-inner">
            <div className="form-group col">
              <input ref="amountInput" type="number" step="0.01" className="col form-control" onChange={this.getAmount} autoFocus={true}/>
              <Form.Text className="text-muted WriteRecipe-info">
                {t('ingredient.amountinfo')}
              </Form.Text>
            </div>

            <div className="form-group col">
              <UnitSelect ref="unitInput" onSelectUnit={this.handleUnitSelect} searchPlaceholder={t('ingredient.unitsearchplaceholder')}/> 
              <Form.Text className="text-muted WriteRecipe-info">
                {t('ingredient.unitinfo')}
              </Form.Text>
            </div>          
          </div>

          <div className="row float-right popup-btns">
              <button ref="closeModalBtn" id="modalSuccess" onClick={this.closeModal} className="close-modal-success btn btn-success">
                <Icon icon={checkmarkIcon} />
              </button>
              <button id="modalCancel" onClick={this.dismissModal} className="close-modal-cancel btn btn-success">
                <Icon icon={crossIcon} />
              </button>
          </div>

        </Popup>

      </div>

    );
  }
};

export default withTranslation()(IngredientSelect);
