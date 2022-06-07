/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';
import io from "socket.io-client";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.socket = null
    this.state = {
      userName: "RN1",
      chatMessage: "",
      chatMessages: [],
    };
  }

  componentDidMount() {
    this.socket = io("http://192.168.1.16:3000")
    // this.socket = io("http://192.168.1.16:3000", {
    //   transports: ['websocket'],
    //   jsonp: false
    // });

    this.socket.connect();

    this.socket.on('connect', () => {
      console.log('connected to socket server');
    });

    this.socket.on("msgToClient", msg => {
      console.log("msgToClient")
      console.log("msg: ", msg)
      this.setState({
        chatMessages: [...this.state.chatMessages, msg]
      });
    })
  }

  submitChatMessage() {
    const message = {
      name: this.state.userName,
      text: this.state.chatMessage
    }
    this.socket.emit('msgToServer', message);
    console.log("message: ", message)
    this.setState({ chatMessage: '' });
  }

  render() {
    const chatMessages = this.state.chatMessages.map((chatMessage, index) => (
      <Text key={index}>{chatMessage.name}: {chatMessage.text}</Text>
    ));

    return (
      <View style={{ margin: 20 }}>
        <TextInput
          style={{ height: 45, borderWidth: 1, borderRadius: 3 }}
          value={this.state.userName}
          placeholder="Enter User Name"
          onChangeText={userName => {
            this.setState({ userName })
          }}
        />
        <View
          style={{
            borderWidth: 1,
            borderRadius: 2,
            minHeight: 300,
            top: 20,
            padding: 5
          }}>
          {chatMessages}
        </View>
        <TextInput
          style={{ height: 45, borderWidth: 1, borderRadius: 3, top: 50 }}
          autoCorrect={false}
          placeholder={"Type Message..."}
          value={this.state.chatMessage}
          onSubmitEditing={() => this.submitChatMessage()}
          onChangeText={chatMessage => {
            this.setState({ chatMessage });
          }}
        />
      </View>
    );
  }
}

export default App;
