import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import '../../css/ImageDropzone.css';
import Progress from './Progress';

class ImageDropzone extends Component {
  constructor() {
    super();
    this.onDrop = (files) => { console.log(files);
      this.setState({files});
      this.uploadFiles(files[files.length-1]);
    };
    this.state = {
      dropBoxIsHidden: '',
      imageIsHidden: '',
      files: [],
      file: '',
      uploadProgress: 0
    };

    this.sendRequest = this.sendRequest.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeImage = this.removeImage.bind(this);
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
  return new Promise((resolve, reject) => {

    this.setState({ uploadProgress: {}, uploading: true });
    var file = this.state.files[0];
    var self = this;
    this.sendRequest(file)
    .then(function() {
      self.setState({dropBoxIsHidden: 'hidden'})
      self.setState({imageIsHidden: ''});
      self.setState({ successfullUploaded: true, uploading: false });
      self.setState({file: window.location.origin + '/users/' + file.name});
    })
  })
  .catch(e => {
    // Not Production ready! Do some error handling here instead...
    this.setState({ successfullUploaded: true, uploading: false });
  })
}

removeImage(childState) {
  this.setState({imageIsHidden: 'hidden'});
  this.setState({dropBoxIsHidden: ''});
  var currentProgess = { state: "pending", percentage: 0 };
  this.setState({ uploadProgress: currentProgess });
}

  render() {
    const uploadProgress = this.state.uploadProgress;

    return (
      <div>
        <Dropzone onDrop={this.onDrop}>
          {({getRootProps, getInputProps}) => (
            <section className={"container " + this.state.dropBoxIsHidden}>
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
        <img className={"preview-image " + this.state.imageIsHidden} src={this.state.file}/>
        <Progress progress={uploadProgress ? uploadProgress.percentage : 0} removeImage={this.removeImage}/>
      </div>
    );
  }
}
export default ImageDropzone;