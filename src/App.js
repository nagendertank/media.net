import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Ticker from './Components/ticker';
import Websocket from "react-websocket";


class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[]
    }
  }

  handleData(data) {
    let jsonData = JSON.parse(data);
    this.setState({ data: jsonData });
  }

  render() {
    return(<div className="App">
        <Websocket url="ws://stocks.mnet.website" onMessage={this.handleData.bind(this)} />
          <Ticker data={this.state.data}/>
        </div>);
  }
}

export default App;
