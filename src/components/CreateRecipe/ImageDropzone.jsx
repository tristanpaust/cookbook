import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import '../../css/ImageDropzone.css';

class ImageDropzone extends Component {
  constructor() {
    super();
    this.onDrop = (files) => { console.log(files);
      this.setState({files})
    };
    this.state = {
      files: [],
      file: ''
    };

    this.sendRequest = this.sendRequest.bind(this);
  }

  sendRequest(e) {
    e.preventDefault();

    var file = this.state.files[0];
    var formData = new FormData();
    formData.append('image', file);

    fetch('/api/upload', {
      method:'POST',
      body: formData
    })
    .then(res => res.json())
    .then(image => {
      if (!image.error) {
        this.setState({file: window.location.origin + '/users/' + image.filename});
      } else {
        const error = new Error(image.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  }

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <div>
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <p className="dropzone-header">Vorschaubild</p>
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Bild des Rezeptes hier ablegen oder klicken</p>
            </div>
            <aside>
              <ul>{files}</ul>
              <button className="btn btn-success" onClick={this.sendRequest}>Upload</button>
            </aside>
          </section>
        )}
      </Dropzone>
            <img src={this.state.file}/>
            </div>
    );
  }
}
export default ImageDropzone;