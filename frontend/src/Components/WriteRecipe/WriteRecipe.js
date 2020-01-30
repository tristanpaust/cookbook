import React from "react";
import {withRouter} from 'react-router';
import './WriteRecipe.css';
import APIClient from '../../Actions/apiClient';

import TagSelect from './TagSelect.js';
import IngredientAdd from './IngredientAdd.js';
import IngredientSelect from './IngredientSelect.js';
import StepAdd from './StepAdd.js';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropzone from 'react-dropzone';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-select';

import { withTranslation } from 'react-i18next';
import i18n from "i18next";

import {countryOptions} from '../../Static/other/SelectOptions.js';
import {dishOptions} from '../../Static/other/SelectOptions.js';

class WriteRecipe extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      userMail: '',
      
      recipeTitle: '',
      recipeDescription: '',
      imagePath: '',
      servingSize: 0,
      recipeOrigin: undefined,
      recipeType: undefined,
      tags: [],
      ingredients: [],
      steps: [],
      user: {},


      dropzoneIsLocked: false,
      fileIsHidden: true,
      file: {},
  
      uploading: false,
  
      successfulUpload: false,
      fileError: false,
      titleError: false,
      otherError: false,
      noFileError: false,
      uploadError: false,
      deleteError: false
    }
    this.onDrop = (files) => {
      this.setState({file: files[0]});
      this.setState({
        dropzoneIsLocked:true,
        fileIsHidden: false 
      });
    };

    this.sendRequest = this.sendRequest.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.startLongRunningTask = this.startLongRunningTask.bind(this);
    this.resetIndicators = this.resetIndicators.bind(this);
    this.isEmpty = this.isEmpty.bind(this);

    this.increasePeople = this.increasePeople.bind(this);
    this.decreasePeople = this.decreasePeople.bind(this);

    this.handleTagSelect = this.handleTagSelect.bind(this);
    this.handleIngredientSelect = this.handleIngredientSelect.bind(this);
    this.handleIngredientDelete = this.handleIngredientDelete.bind(this);

    this.onStepAdd = this.onStepAdd.bind(this);
    this.handleStepDelete = this.handleStepDelete.bind(this);
    this.handleStepEdit = this.handleStepEdit.bind(this);
    this.handleStepBlur = this.handleStepBlur.bind(this);

    this.child = React.createRef();
  }

  // Check the users auth token,
  // If there is none / it is blacklisted,
  // Push user to login, set message banner to appropriate message,
  // Store current location to redirect user back here after successful login
  async componentDidMount() {
    this.apiClient = new APIClient();
    
    this.apiClient.getAuth().then((data) => {
      this.setState({
        userMail: data.logged_in_as.email
      })
    }).catch((err) => {
  		if (err.response.status) {
        if (err.response.status === 401) {
    			const location = { 
    				pathname: '/login', 
    				state: { 
    					from: 'WriteRecipe', 
    					message: i18n.t('messages.notauthorized') 
    				} 
    			} 
    			this.props.history.push(location) 
   		  }
      } 
    })
  }
  
  // Start uploading file, set state o pending,
  // Post to server
  sendRequest() {
    let file = this.state.file;
    const formData = new FormData();
    formData.append("file", file);
    
    this.apiClient.uploadFile(formData).then((data) => {
      this.setState({
        dropzoneIsLocked: true,
        fileIsHidden: false,
        successfulUpload: true, 
        uploading: false
      })
    }).catch((err) => {
      this.setState({
        uploadError: true
      })
    })
  }
  
  // File is an object, check whether it has properties
  isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }

  // Get file object and upload it to the server
  uploadFiles(file) {
    if (this.isEmpty(this.state.file)) {
      this.setState({
        noFileError: true
      })
      return;
    }
  
    this.setState({  
      uploading: true,
      noFileError: false,
      uploadError: false
    });
    var file = this.state.file;
    this.sendRequest()
  }
  
  handleInputChange = (event) => {
    const { value, name } = event.target;
    console.log(event.target);
    this.setState({
      [name]: value
    });
    console.log(this.state)
  }  

  handleOriginChange = (option) => {
    this.setState({
      recipeOrigin: option.label
    });
  }  
  
  handleTypeChange = (option) => {
    this.setState({
      recipeType: option.label
    });
  }

  handleTagSelect(options) {
    this.setState({tags: options});
  }

  handleIngredientSelect(options) {
    this.setState({ingredients: options});
  }

  handleIngredientDelete(id) {
    var array = [...this.state.ingredients]; // make a separate copy of the array

    for (let i = 0; i < array.length; i++) {
      if (array[i]['item'].value === id) {
        array.splice(i, 1);
        this.setState({ingredients: array});
        this.child.current.deleteIngredient(id);
      }
    }
  }

  getIngredients = () => {
    var ingredientArray = this.child.getAllIngredients()
  }

  onStepAdd(e) {
    let step = this.refs.step.value;

    let newStep = {
      text: step,
      key: 'step' + parseInt(this.state.steps.length+1)
    }

    this.setState((prevState) => {
      return {
        steps: prevState.steps.concat(newStep)
      };
    });
    this.refs.step.value = '';

    e.preventDefault();
  }

  handleStepDelete(id) {
    var array = [...this.state.steps];

    for (let i = 0; i < array.length; i++) {
      if (array[i]['key'] === id) {
        array.splice(i, 1);
        return this.setState({steps: array});
      }
    }
  }

  handleStepEdit(textElement) {
    textElement.contentEditable = true;
    textElement.classList.add('editable');
  }

  handleStepBlur(textElement, id) {
    textElement.contentEditable = false;
    textElement.classList.remove('editable');

    var array = [...this.state.steps];

    for (let i = 0; i < array.length; i++) {
      if (array[i]['key'] === id) {
        array[i]['text'] = textElement.textContent;
      }
    }
    this.setState({steps: array});
  }  

  // Remove file from selection by emptying the file object, reset all messages and button states
  removeFile() {
    this.setState({
      fileIsHidden: true,
      dropzoneIsLocked: false,
      successfulUpload: false,
      uploading: false,
      deleteError: false,
      file: {}
    });
  }
  
  // Delete the previously uploaded file from the server and call removeFile to clear all messages, etc
  deleteFile() {
    let file = this.state.file.name;
    
    this.apiClient.deleteFile({'filename': file}).then((data) => {
      this.removeFile();
    }).catch((err) => {
      this.setState({
        deleteError: true
      })
    })
  }
  
  startLongRunningTask() {
    this.resetIndicators();

    if (!this.state.successfulUpload) {
      this.setState({
        fileError: true
      })
      return;
    }

    if (!this.state.LongRunningTaskTitle) {
      this.setState({
        titleError: true
      })
      return;
    }
    
    if (!this.state.userMail) {
      this.setState({
        otherError: true
      })
      return;
    }
    
    let LongRunningTask = {
      "submittedBy": this.state.userMail,
      "LongRunningTaskTitle": this.state.LongRunningTaskTitle,
      "storedAt": this.state.file.path
    }
    
    // Create a new LongRunningTask in the database, return the auto generated ID, 
    // Pass ID into next function to save it in the history of the creator,
    // Pass the creator ID and the LongRunningTask ID to the last function to create a new item in the queue
    this.apiClient.createRecipe(LongRunningTask).then((data) => {
      this.apiClient.updateUserHistory({"LongRunningTaskID": data.data}).then((data) => {
        this.apiClient.createQueueItem(data.data).then((data) => {
   			  const location = { 
    				pathname: '/queue', 
    				state: { 
    					from: 'LongRunningTask', 
    					message: i18n.t('messages.newLongRunningTasksuccess')
    				} 
    			} 
    			this.props.history.push(location) 
        }).catch((err) => { console.log('Something went wrong while creating the queue item') })
      }).catch((err) => { console.log('Something went wrong while updating the user') })
    }).catch((err) => { console.log('Something went wrong while creating a new LongRunningTask') })
  }

  resetIndicators() {
    this.setState ({
      fileError: false,
      titleError: false,
      otherError: false,
      noFileError: false,
      uploadError: false,
      deleteError: false,
      uploading: false
    })
  }

  increasePeople() {
    this.setState({servingSize: parseInt(this.state.servingSize) + 1});
  }
  
  decreasePeople() {
    if (parseInt(this.state.servingSize) >= 1) {
      this.setState({servingSize: parseInt(this.state.servingSize) - 1});
    }
  }

	render () {
    // Translation item
    const { t } = this.props;
    return (
      <div className="container">
        <div className="container-fluid">
        
          <p className="dropzone-header">{t('writerecipe.recipeimageheader')}</p>
          

          <Form.Group controlId="formBasicFile" className="test">
            <Form.Control 
              type="text" 
              placeholder={t('writerecipe.titleplaceholder')}
              name='WriteRecipeTitle' 
              value={this.state.WriteRecipeTitle}
              onChange={this.handleInputChange}
              required
            />
            <Form.Text className="text-muted WriteRecipe-info">
              {t('writerecipe.recipeimagesubmit')}
            </Form.Text>
          </Form.Group>

          <div className="new-recipe-form">

            <div className="input-left-side">
              <Dropzone 
                onDrop={this.onDrop} 
                disabled={!this.isEmpty(this.state.file)} 
              >
                {({getRootProps, getInputProps}) => (
                  <section className={'container ' + (this.state.dropzoneIsLocked ? 'hidden' : '')}>
                    <div {...getRootProps({className: 'dropzone'})}>
                      <input {...getInputProps()} />
                      <p>{t('writerecipe.dropzonehelper')}</p>
                    </div>
                  </section>
                )}
              </Dropzone>
              
              <div className={'preview-file ' + (this.state.fileIsHidden ? 'hidden' : '')}>
                <p>{this.state.file.name}
                  <span className={'remove-file ' + (this.state.successfulUpload ? 'hidden' : '')} onClick={this.removeFile}></span>
                </p>
              </div>
              
              <Button variant="primary" 
                className={'upload-button ' + ((this.state.successfulUpload) ? 'hidden' : '')} 
                onClick={this.uploadFiles} 
              >
                <div className={'container ' + (this.state.uploading ? 'hidden' : '')}>
                  {t('writerecipe.startupload')}
                </div>
                <div className={'spinner-container ' + ((this.state.uploading) ? '' : 'hidden')}>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="upload-spinner"
                  />
                  <span>{t('writerecipe.uploading')}</span>
                </div>
              </Button> 
              
              <p className={'WriteRecipe-error ' + (this.state.noFileError ? 'show' : 'hidden')}>
                {t('writerecipe.nofileerror')}
              </p>
              
              <p className={'WriteRecipe-error ' + (this.state.uploadError ? 'show' : 'hidden')}>
                {t('writerecipe.uploadError')}
              </p>
              
              <p className={'WriteRecipe-error ' + (this.state.deleteError ? 'show' : 'hidden')}>
                {t('writerecipe.deleteError')}
              </p>

              <p className={'WriteRecipe-success ' + (this.state.successfulUpload ? 'show' : 'hidden')}>
                {t('writerecipe.successfulUpload')}
              </p>
              
              <Button variant="danger" 
                className={'upload-button ' + ((this.state.successfulUpload) ? '' : 'hidden')} 
                onClick={this.deleteFile} 
              >
                {t('writerecipe.deletefile')}
              </Button>
              
            </div>

            <div className="input-right-side">
              <h5> {t('writerecipe.recipegeneralinfoheader')}</h5>

              <Form.Group controlId="formBasicDescription">
                <Form.Control as="textarea" rows="3"
                  placeholder={t('writerecipe.descriptionplaceholder')}
                  name='recipeDescription' 
                  className='recipeTextbox'
                  value={this.state.recipeDescription}
                  onChange={this.handleInputChange}
                  required
                />
                <Form.Text className="text-muted createRecipe-info">
                  {t('writerecipe.recipedescriptionhelp')}
                </Form.Text>
              </Form.Group>

              <div className='form-group'>
                <div className='servingSizeWrapper'>
                  <div className="value-button btn-danger decrease" onClick={this.decreasePeople}>-</div>
                  <input type="text" pattern="[0-9]*" name="servingSize" className="form-control servingSize" value={this.state.servingSize} onChange={this.handleInputChange}/>
                  <div className="value-button btn-success increase" onClick={this.increasePeople}>+</div>
                </div>
                <Form.Text className="text-muted createRecipe-info">
                  {t('writerecipe.recipeservingshelp')}
                </Form.Text>
              </div>

              <div className='form-group'>
                <Select
                  placeholder={t('writerecipe.recipeoriginplaceholder')}
                  label="Single select"
                  onChange={this.handleOriginChange}
                  options={countryOptions}
                  name="recipeOrigin"
                  className="general-info-input"
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
                <Form.Text className="text-muted createRecipe-info">
                  {t('writerecipe.recipeservingshelp')}
                </Form.Text>
              </div>              

              <div className='form-group'>
                <Select
                  placeholder={t('writerecipe.recipetypeplaceholder')}
                  label="Single select"
                  options={dishOptions}
                  onChange={this.handleTypeChange}
                  className="general-info-input"
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
                <Form.Text className="text-muted createRecipe-info">
                  {t('writerecipe.recipetypehelp')}
                </Form.Text>              
              </div>

              <div className="form-group">
                  <TagSelect onSelectTag={this.handleTagSelect} searchPlaceholder={t('writerecipe.tagsearchplaceholder')}/>
                  <Form.Text className="text-muted createRecipe-info">
                    {t('writerecipe.recipetaghelp')}
                  </Form.Text>
              </div>

              <hr />

              <div className="row" id="ingredients">
                <div className="form-group col">

                  <h5 className="recipe-headline" htmlFor="ingredients">{t('writerecipe.ingredientsheader')}</h5>

                  <IngredientSelect onSelectIngredient={this.handleIngredientSelect} ref={this.child}   />

                  <Form.Text className="text-muted createRecipe-info">
                    {t('writerecipe.recipeingredienthelp')}
                  </Form.Text>

                  <IngredientAdd entries={this.state.ingredients} onHandleDelete={this.handleIngredientDelete}/>
                </div>
              </div>
                
              <hr />

              <div className="row">
                <div className="form-group col">
                  <h5 className="recipe-headline">{t('writerecipe.stepsheader')}</h5>
                    
                    <div className="input-group">
                      <input 
                        id="step" 
                        name="step" 
                        type="text" 
                        ref="step"
                        className='col form-control step-control'
                        onKeyPress={event => {
                          if (event.key === 'Enter') {
                            this.onStepAdd(event)
                          }
                        }}
                      />

                    <Form.Text className="text-muted createRecipe-info">
                      {t('writerecipe.recipestephelp')}
                    </Form.Text>
                    </div>

                    <StepAdd 
                      entries={this.state.steps} 
                      onHandleDelete={this.handleStepDelete} 
                      onHandleEdit={this.handleStepEdit} 
                      onHandleBlur={this.handleStepBlur}
                    />
                  </div>
              </div>

            </div>

          </div>

          <hr />
          
          <p className={'WriteRecipe-error ' + (this.state.fileError ? 'show' : 'hidden')}>
            {t('writerecipe.fileisempty')} 
          </p>                
          <p className={'WriteRecipe-error ' + (this.state.titleError ? 'show' : 'hidden')}>
            {t('writerecipe.titleisempty')}  
          </p>
          <p className={'WriteRecipe-error ' + (this.state.otherError ? 'show' : 'hidden')}>
            {t('writerecipe.othererror')}
          </p>
                
          <span className="text-muted WriteRecipe-info">{t('writerecipe.submitNewRecipe')}</span>
          <br />
          <Button className={'btn btn-primary btn-WriteRecipe ' + (this.state.successfulUpload ? '' : 'disabled')} onClick={this.createNewRecipe}>
            {t('writerecipe.submitNewRecipe')}
          </Button>
          
        </div>
      </div>
    )
  }
}
export default withRouter(withTranslation()(WriteRecipe));