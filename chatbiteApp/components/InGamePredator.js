import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight , ToastAndroid} from 'react-native';

export default class InGamePredator extends Component {
  
	constructor(props) {
    super(props);
    this.state = {position:null, preyPosition: 'null'};

  }


  componentDidMount() {


  }


  render() {
    return (
      <View>
          <Text>Tu es un prédator {this.props.indiceClose}</Text>
      </View>
    )
  }
}