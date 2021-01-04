import React, { Component } from "react";
import Feed from "./Feed";


class App extends Component {
    state = { contacts: [] };
  
    componentDidMount() {
      fetch("https://api.randomuser.me/?results=50")
        .then(response => response.json())
        .then(parsedResponse =>
          parsedResponse.results.map(user => ({
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            thumbnail: user.picture.thumbnail
          }))
        )
        .then(contacts => this.setState({ contacts }));
    }
  
    render() {
      return (
        <div className="App">
          <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
                <a class="nav-link" href="#">
                  <h2>Higher Order Component (HOC)</h2>
                </a>
          </nav>
  
          <Feed contacts={this.state.contacts} />
        </div>
      );
    }
}

export default App;