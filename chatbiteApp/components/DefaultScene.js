import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight , TextInput} from 'react-native';

export default class DefaultScene extends Component {

  constructor(props) {
    super(props);
    this.state = { text: null };

    this.onPressJoin = this.onPressJoin.bind(this);
    this.onPressCreate =this.onPressCreate.bind(this);
  }


onPressJoin(){
  if(this.state.text){
    this.props.updateName(this.state.text);
    fetch(this.props.urlServer+'join/session', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: this.state.text,
          token: this.props.token
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('responseJson', responseJson);
        this.props.navigator.push({id: 'join'})
      })
    .catch((error) => {
        console.error(error);
    });
  }
}

onPressCreate(){
  if(this.state.text){
    this.props.updateName(this.state.text);
    fetch(this.props.urlServer+'create/session', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.text,
        token: this.props.token
      })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson', responseJson);
        this.props.navigator.push({id: 'create'})
      })
      .catch((error) => {
        console.error(error);
      });
  }
}


  render() {
    return (
      <View>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <Text>Choisis entre joindre ou créer</Text>
          <TouchableHighlight onPress={this.onPressJoin}>
            <Text>Joindre</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onPressCreate}>
            <Text>Créer</Text>
          </TouchableHighlight>
      </View>
    )
  }
}