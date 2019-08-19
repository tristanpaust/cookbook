import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import '../../css/ImageDropzone.css';

class ImageDropzone extends Component {
  constructor() {
    super();
    this.onDrop = (files) => {
      this.setState({files})
    };
    this.state = {
      files: []
    };
  }

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
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
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default ImageDropzone;