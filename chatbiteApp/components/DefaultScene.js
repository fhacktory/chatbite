import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

export default class DefaultScene extends Component {

  render() {
    return (
      <View>
          <Text>Choisis entre joindre ou créer</Text>
          <TouchableHighlight onPress={()=>{this.props.navigator.push({id: 'join'})}}>
            <Text>Joindre</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>{this.props.navigator.push({id: 'create'})}}>
            <Text>Créer</Text>
          </TouchableHighlight>
      </View>
    )
  }
}