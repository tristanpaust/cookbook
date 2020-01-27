import React from "react";
import {withRouter} from 'react-router';
import './History.css';
import APIClient from '../../Actions/apiClient';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import i18n from "i18next";
import { withTranslation } from 'react-i18next';

class History extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      isFetchingData: true,
      profile: {},
      LongRunningTaskIsFinished: false,
      history: {},
      searchField: ''
    }
    this.getFilteredList = this.getFilteredList.bind(this);
  }

  // Check the users auth token,
  // If there is none / it is blacklisted,
  // Push user to login, set message banner to appropriate message,
  // Store current location to redirect user back here after successful login
  async componentDidMount() {
    this.apiClient = new APIClient();

    this.apiClient.getAuth().then((data) => {
      this.apiClient.getUserDetails(data.logged_in_as.email).then((data) => { console.log(data)
        this.setState({
          isFetchingData: false,
          profile: data,
          history: data.submittedJobs
        })
      })
    }).catch((err) => { 
  		if (err.response.status) {
        if (err.response.status === 401) {
    			const location = { 
    				pathname: '/login', 
    				state: { 
    					from: 'History', 
    					message: i18n.t('messages.notauthorized') 
    				} 
    			} 
    			this.props.history.push(location) 
   		  }
      } 
		})  
	}
  
  // Filter object array
  // Return item if value at specified key includes letter(s)
  // Used for searching through list of history items
  getFilteredList(array, key, value) {
    return array.filter(function(e) {
      return e[key].includes(value);
    });
  }
  
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
    var filteredList = this.getFilteredList(this.state.profile.submittedJobs, "LongRunningTaskTitle", value);
    this.setState({
      history: filteredList.reverse()
    });
  }
  
  
  // CreateTabs and CreateCols map arrays of data to return functions that generate DOM elements
  createTabs(item) {
    return (    
      <ListGroup.Item action eventKey={item._id.$oid} key={item._id.$oid}>
        {item.LongRunningTaskTitle}
      </ListGroup.Item>
    )
  }
  
  createCols(item) {
    let startTime = new Date(item.timeStarted.$date);
    
    var endTime = i18n.t('history.LongRunningTaskrunning');
    
    if (item.timeEnded) {
      let timeEnded = new Date(item.timeEnded.$date);
      endTime = timeEnded.toLocaleTimeString() + ' ' + timeEnded.toLocaleDateString()
    }
    
    var result = i18n.t('history.noresult');
    
    if (item.result) {
      result = item.result
    }
    
    return (    
      <Tab.Pane eventKey={item._id.$oid} key={item._id.$oid}>
        <Table striped bordered hover className="LongRunningTask-info">
          <tbody>
            <tr>
              <td> LongRunningTask started: </td> 
              <td> {startTime.toLocaleTimeString() + ' ' + startTime.toLocaleDateString()} </td>
            </tr>
            <tr>
              <td> LongRunningTask finished: </td> 
              <td> {endTime} </td>
            </tr>
            <tr>
              <td> Result: </td> 
              <td> {result} </td>
            </tr>
          </tbody>
        </Table>
      </Tab.Pane>  
    )
  }

  render() {
    // Translation item
    const { t } = this.props;
    
    if (!this.state.isFetchingData) {
      var historyEntries = this.state.history;
      historyEntries = historyEntries.reverse()
      var tabs = historyEntries.map(this.createTabs);
      var cols = historyEntries.map(this.createCols);
    }
    
    return (
      <div className="container">
        <div className="container-fluid">
        
          <Form.Group controlId="formBasicFile" className="col-6">
            <Form.Control 
              type="text" 
              placeholder={t('history.searchbar')}
              name='searchField' 
              value={this.state.searchField}
              onChange={this.handleInputChange}
            />
          </Form.Group>
        
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="explanation">
            <Row key="Explanation">
              <Col sm={4}>   
                <ListGroup.Item action eventKey="explanation">
                  {t('history.explanationtab')}
                </ListGroup.Item>
                {tabs}
              </Col>
              <Col sm={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="explanation">
                    {t('history.explanationcontent')}
                  </Tab.Pane>
                  {cols}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        
        </div>
      </div>
    )
  }
}
export default withRouter(withTranslation()(History));