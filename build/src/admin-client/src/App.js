import React, { Component } from "react";
import "./App.css";
import Uploader from "./Uploader/Uploader";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      files: null
    };
  }
  componentDidMount = () => {
    this.loadFileInfo();
  };

  loadFileInfo = () => {
    axios
      .get("/fileinfo")
      .then(response => {
        this.setState({ files: response.data });
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({ fileerror: error });
      });
  };

  handleDelete = e => {
    const data = new FormData();
    data.append("filename", e.target.dataset["filename"]);

    axios.post("/delete", data).then(res => {
      console.log(res.statusText);
      this.loadFileInfo();
    });
  };

  render() {
    const files = this.state.files
      ? this.state.files.map(f => {
          if (!f.exists) {
            return (
              <div>
                <Uploader
                  key={f.filename}
                  filename={f.filename}
                  description={f.description}
                  onuploaded={this.loadFileInfo}
                />
                <hr />
              </div>
            );
          } else {
            return (
              <div>
                <span>
                <div><b>{f.filename}</b></div> Available
                </span>
                <button data-filename={f.filename} onClick={this.handleDelete}>
                  Delete
                </button>
                <hr />
              </div>
            );
          }
        })
      : null;
    return (
      <div className="App">
        <h1>Config files</h1>
        <header className="App-header">{files}</header>
        <div>{this.state.fileerror}</div>
      </div>
    );
  }
}

export default App;
