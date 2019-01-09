import React, { Component } from "react";
import "./App.css";
import Uploader from "./Uploader/Uploader";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      config: null
    };
  }
  componentDidMount = () => {
    this.loadConfig();
  };

  loadConfig = () => {
    axios
      .get("/config")
      .then(response => {
        this.setState({ config: response.data });
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({ configerror: error.message });
      });
  };

  setParam = e => {
    let stateVal = {};
    stateVal[e.target.dataset["name"]] = e.target.value;
    this.setState(stateVal);
  };

  handleSetParam = e => {
    console.log(e.target.dataset["name"]);
    let p = { value: this.state[e.target.dataset["name"]] };
    console.log(p);
    const data = new FormData();
    data.append(e.target.dataset["name"], this.state[e.target.dataset["name"]]);

    axios.post("/param", data).then(res => {
      console.log(res.statusText);
      this.loadConfig();
    });
  };

  handleDelete = e => {
    const data = new FormData();
    data.append("filename", e.target.dataset["filename"]);

    axios.post("/delete", data).then(res => {
      console.log(res.statusText);
      this.loadConfig();
    });
  };

  render() {
    const renderedConfig = this.state.config
      ? Object.keys(this.state.config).map(c => {
          const f = this.state.config[c];
          switch (f.type) {
            case "file":
              if (!f.exists) {
                return (
                  <div>
                    <Uploader
                      key={c}
                      filename={c}
                      description={f.description}
                      onuploaded={this.loadConfig}
                    />
                    <hr />
                  </div>
                );
              } else {
                return (
                  <div>
                    <span>
                      <div>
                        <b>{c}</b>
                      </div>{" "}
                      (Value Set)
                    </span>
                    <button data-filename={c} onClick={this.handleDelete}>
                      Delete
                    </button>
                    <hr />
                  </div>
                );
              }
              break;
            case "param":
              let exists = "";
              if (f.exists) {
                exists = "(Value set)";
              }
              return (
                <div>
                  <span>
                    <div>
                      <b>
                        {c} {exists}
                      </b>
                    </div>
                  </span>
                  <input onChange={this.setParam} data-name={c} />
                  <button data-name={c} onClick={this.handleSetParam}>
                    Set
                  </button>
                  <hr />
                </div>
              );
              break;
            default:
              return <div>--{f.type}-- unknOWN</div>;
              break;
          }
        })
      : null;
    return (
      <div className="App">
        <h1>Config</h1>
        <header className="App-header">{renderedConfig}</header>
        <div>{this.state.configerror}</div>
        
      </div>
    );
  }
}

export default App;
