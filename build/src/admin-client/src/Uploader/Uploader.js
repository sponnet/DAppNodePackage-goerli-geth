import React, { Component } from "react";
import axios from "axios";

const endpoint = "/file";

class Uploader extends Component {
  constructor(props) {
    super();
    this.state = {
      filename: props.filename,
      description: props.description,
      selectedFile: null,
      loaded: 0
    };
    this.onuploaded = props.onuploaded;
  }

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  handleUpload = e => {
    const data = new FormData();
    data.append("file", this.state.selectedFile, this.state.selectedFile.name);
    data.append("filename", e.target.dataset["filename"]);

    axios
      .post(endpoint, data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      })
      .then(res => {
        console.log(res.statusText);
        this.onuploaded();
      });
  };
  render() {
    return (
      <div className="Uploader">
        <div>
          <b>{this.state.filename}</b>
        </div>
        <div>{this.state.description}</div>
        <input type="file" name="" id="" onChange={this.handleselectedFile} />
        <button data-filename={this.state.filename} onClick={this.handleUpload}>
          Upload
        </button>
      </div>
    );
  }
}

export default Uploader;
