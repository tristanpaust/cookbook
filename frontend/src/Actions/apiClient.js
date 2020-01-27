import axios from 'axios';

// Obviously needs to get changed if the server port / address is changing
const BASE_URI = 'http://0.0.0.0:8001';

// Client that is used in every server request
const client = axios.create({
 baseURL: BASE_URI,
 json: true
});

// Call perform function with method, route and (if needed, e.g. POST) data 
class APIClient {
  /*** ///  Maps to auth controller  /// ***/  
  login(user) {
    console.log("<<<", user)
    return this.perform('post', '/login', user);
  }
 
  getAuth() {
    return this.perform('get', '/hasAuth');
  }
   
  logout() {
    this.perform('delete', '/logoutAccessToken').then(() => {
      console.log('done');
    })
  }
  
  refresh() {
    return this.performRefresh('post', '/refresh');
  }

  /*** ///  Maps to user controller  /// ***/
  createUser(newUser) {
    return this.perform('post', '/user', newUser);
  }
 
  getUser(user) {
   return this.perform('get', '/user', user);
  }
  
  updateUserHistory(LongRunningTaskID) {
    return this.perform('put', '/updateUserHistory', LongRunningTaskID);
  }
  
  removeFromUserHistory(ids) {
    return this.perform('delete', '/removeFromUserHistory', ids);
  }
  
  changeEmail(email) {
    return this.perform('put', '/changeEmail', email);  
  }
  
  checkPassword(oldPassword) {
    return this.perform('post', '/checkPassword', oldPassword);  
  }
  
  changePassword(newPassword) {
    return this.perform('put', '/changePassword', newPassword);
  }

  getUserDetails(email) {
    return this.perform('get', '/user?email=' + email);
  }

  /*** ///  Maps to LongRunningTask controller  /// ***/
  createLongRunningTask(LongRunningTask) {
    return this.perform('post', '/LongRunningTask', LongRunningTask);
  }
  
  deleteLongRunningTask(LongRunningTaskID) {
    return this.perform('delete', '/LongRunningTask', LongRunningTaskID)
  }

  /*** ///  Maps to queue controller  /// ***/
  createQueueItem(newQueueItem) {
    return this.perform('post', '/queue', newQueueItem);
  }
  
  getQueue() {
    return this.perform('get', '/queue');
  }
  
  deleteQueueItem(queueItem) {
    return this.perform('delete', '/queue', queueItem);
  }
  
  /*** /// Upload /// ***/
  uploadFile(file) {
    return this.perform('post', '/upload', file);  
    // Please not that this is NOT the final route, as it doesn't go to ODIN but just to the local server
  }

  deleteFile(file) {
    return this.perform('delete', '/upload', file);  
    // Please not that this is NOT the final route, as it doesn't go to ODIN but just to the local server
  }
  
  /*** /// Mail /// ***/
  sendMail() {
    return this.perform('get', '/mail');
  }
  
  // Perform takes in the mehthod, route, data and creates a new client
  // Also gets the token from localStorage and adds it to the header of the request
  async perform (method, resource, data) {         
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }      
    }).then(resp => {
      return resp.data ? resp.data : [];
    })
   }
}

export default APIClient;