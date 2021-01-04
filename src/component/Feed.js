import React, { Component } from "react";
import FeedItem from "./FeedItem";
import Loading from "./HOC/Loading";

class Feed extends Component {
  render() {
    console.log(this.props);
    const { loadingTime } = this.props;
    return (
      <div className="feed">
        {this.props.contacts.map(
          contact => <FeedItem contact={contact} />
        )}
        {/* <FeedItem contacts={this.props.contacts} /> */}
        <p>Loading time {loadingTime} seconds</p>
      </div>
    );
  }
}

export default Loading("contacts")(Feed);