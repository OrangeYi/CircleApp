import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

class ChatRoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.messages || [],
      text: '',
    };
    this.sendMsg = this.sendMsg.bind(this);
    this.props.socket.on('chat', function(){
      this.forceUpdate();
    }.bind(this));
  }

  componentWillMount(){
    BackHandler.addEventListener('createChat', this.onBackHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('createChat', this.onBackHandler);
  }

  onBackHandler() {
    Actions.pop();
    return true;
  };

  sendMsg() {
    this.props.socket.emit('chat', this.props.roomId, this.props.userName,
        this.props.iconName, this.state.text);
    this.setState({
      text: '',
    });
  }

  render() {
    return (
      <View style={styles.ChatRoomView}>
        <View style={styles.headerView}>
          <TouchableOpacity onPress={Actions.pop}
            style={styles.backKey}>
            <Icon name='ios-arrow-back'
              size={40}
              color='white'
            />
          </TouchableOpacity>
          <Text style={styles.titleText}>{this.props.name}</Text>
          <TouchableOpacity onPress={() => {}}
            style={styles.menuKey}>
            <Icon name='ios-menu'
              size={40}
              color='white'
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {this.state.messages.map((msg, i) => <Text key={i}>{msg.iconName}-{msg.userName}: {msg.text}</Text>)}
        </ScrollView>
        <View style={{flexDirection: 'row', position: 'absolute', bottom: 0}}>
          <TextInput
            style={{flex: 5}}
            value={this.state.text}
            onChangeText={(text) => this.setState({text})}
            onSubmitEditing={this.sendMsg}
          />
          <TouchableOpacity style={{flex: 1}} onPress={this.sendMsg}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


export const styles = StyleSheet.create({
  ChatRoomView: {
    flex: 1,
    flexDirection: 'column',
  },
  headerView: {
    height: 40,
    backgroundColor: 'skyblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  backKey: {
    paddingLeft: 10,
  },
  menuKey: {
    paddingRight: 10,
  },
});

export default ChatRoomList;
