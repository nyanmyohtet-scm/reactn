/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import io from "socket.io-client";

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.socket = null
    this.state = {
      name: "User1",
      chatMessage: "",
      chatMessages: [],
    };
  }

  onSubmit = () => {
    console.log('on submit')
  }

  componentDidMount() {
    console.log('componentDidMount...')
    this.socket = io("http://192.168.1.17:3000", {
      transports: ['websocket'], 
      jsonp: false 
    });   

    this.socket.connect(); 

    this.socket.on('connect', () => { 
      console.log('connected to socket server'); 
    });

    this.socket.on("msgToClient", msg => {
      console.log("msgToClient")
      console.log("msg: ", msg)
      this.setState({ chatMessages: [...this.state.chatMessages, msg.text]   
     });
    })
  }

  submitChatMessage() {
    const message = {
      name: this.state.name,
      text: this.state.chatMessage
    }
    this.socket.emit('msgToServer', message);
    console.log("message: ", message)
    this.setState({chatMessage: ''});
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        height: 400,
        flex: 1,
        backgroundColor: '#F5FCFF',
      },
    });

    const chatMessages = this.state.chatMessages.map((chatMessage, index) => (
      <Text key={index} style={{borderWidth: 2, top: 50}}>{chatMessage}</Text>
    ));

    return (
      <View style={styles.container}>
        {chatMessages}
        <TextInput
          style={{height: 40, borderWidth: 2, top: 60}}
          autoCorrect={false}
          value={this.state.chatMessage}
          onSubmitEditing={() => this.submitChatMessage()}
          onChangeText={chatMessage => {
            this.setState({chatMessage});
          }}
        />
      </View>
    );
  }
  /*
  render() {
    const isDarkMode = false;
    const backgroundStyle = {
      backgroundColor: Colors.lighter,
    };
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View>
            <Text>Test</Text>
            <TextInput 
              placeholder="Type here to translate!"
            />
            <Button
              onPress={() => console.log('gggg')}
              title="Send"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
  )}
  */
}
/*
const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onSubmit = () => {
    console.log('on submit')
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Header">
            Chat App
          </Section>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
*/
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
