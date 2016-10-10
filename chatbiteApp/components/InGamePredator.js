import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight , ToastAndroid} from 'react-native';
import Pulse from 'react-native-pulse';


//cold to hot
const colors = ['dodgerblue', 'lightblue', 'lightcoral', 'firebrick'];
const numPulses = [2, 3, 4, 5];
const speedValues =[30, 20, 10, 5];
const durationValues =[2000, 1500, 1000, 500];

export default class InGamePredator extends Component {
  
	constructor(props) {
    super(props);
    this.state = {position:null, preyPosition: 'null'};

  }


  componentDidMount() {


  }


  render() {
    let colorValue = colors[0];
    let numPulseValue = numPulses[0];
    let speedValue = speedValues[0];
    let durationValue = durationValues[0];

    let backgroundColorView = 'blue';

    if(this.props.indiceClose === 0){
      
    }else if(this.props.indiceClose < 0.01){
    let colorValue = colors[1];
    let numPulseValue = numPulses[1];
    let speedValue = speedValues[1];
    let durationValue = durationValues[1];

    }else if(this.props.indiceClose < 0.1){
    let colorValue = colors[2];
    let numPulseValue = numPulses[2];
    let speedValue = speedValues[2];
    let durationValue = durationValues[2];
    backgroundColorView = 'red';
    }else {
    let colorValue = colors[3];
    let numPulseValue = numPulses[3];
    let speedValue = speedValues[3];
    let durationValue = durationValues[3];
    backgroundColorView = 'red';
    }


    const top = 100;
    const diameter = 400;

    return (
      //add a backround color 
      //but view do not take all the screen 
      // see how to do with flex
      <View style={{flex:1}}>
        <Text style={{textAlign:'center'}}>Tu es un prédator {this.props.indiceClose}</Text>
          <View style={{flex:1,justifyContent:'center', backgroundColor:backgroundColorView}} >
          <Text style={{textAlign:'center', fontWeight:'bold'}}>{this.props.indiceClose}</Text>
          <Pulse color={colorValue} numPulses={numPulseValue} diameter={diameter} top={top} speed={speedValue} duration={durationValue} />
      </View>
      </View>
    )
  }
}