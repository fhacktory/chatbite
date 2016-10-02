import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

export default class CreateSession extends Component {
  
   constructor(props) {
    super(props);
    this.state = {};

    this.onPresStart =this.onPresStart.bind(this);
  }

onPresStart(){
    fetch(this.props.urlServer+'start/session', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson', responseJson);
        //this.props.navigator.push({id: 'create'})
      })
      .catch((error) => {
        console.error(error);
      });
}

  render() {
    return (
      <View>
          <Text>Valide le départ de la session</Text>
          <TouchableHighlight onPress={this.onPresStart}>
            <Text>Créer</Text>
          </TouchableHighlight>
      </View>
    )
  }
}