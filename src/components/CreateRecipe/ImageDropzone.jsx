import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import '../../css/ImageDropzone.css';
import Progress from './Progress';

class ImageDropzone extends Component {
  constructor() {
    super();
    this.onDrop = (files) => { console.log(files);
      this.setState({files})
      this.uploadFiles(files[0])
    };
    this.state = {
      files: [],
      file: '',
      uploadProgress: 0
    };

    this.sendRequest = this.sendRequest.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

sendRequest(file) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.upload.addEventListener("progress", event => {
      if (event.lengthComputable) {
        var currentProgess = {
          state: "pending",
          percentage: (event.loaded / event.total) * 100
        };

        this.setState({ uploadProgress: currentProgess });
      }
    });
   
    req.upload.addEventListener("load", event => {
      var currentProgess = { state: "done", percentage: 100 };
      this.setState({ uploadProgress: currentProgess });
      resolve(req.response);
    });
   
    req.upload.addEventListener("error", event => {
      var currentProgess = { state: "error", percentage: 0 };
      this.setState({ uploadProgress: currentProgess });
      reject(req.response);
    });

    var formData = new FormData();
    formData.append('image', file);

    req.open("POST", '/api/upload');
    req.send(formData);
  });
}

uploadFiles(file) {
  //e.preventDefault();
   return new Promise((resolve, reject) => {

    this.setState({ uploadProgress: {}, uploading: true });
    var file = this.state.files[0];
    var self = this;
    this.sendRequest(file).then(function() {
      self.setState({ successfullUploaded: true, uploading: false });
    })
  })
  .catch(e => {
    // Not Production ready! Do some error handling here instead...
    this.setState({ successfullUploaded: true, uploading: false });
  })
}

  render() {
    const uploadProgress = this.state.uploadProgress;

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
              </aside>
            </section>
          )}
        </Dropzone>
        <img src={this.state.file}/>
        <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
      </div>
    );
  }
}
export default ImageDropzone;