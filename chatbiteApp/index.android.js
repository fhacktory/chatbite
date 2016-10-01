/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


 import React, { Component } from 'react';
import { AppRegistry, Navigator, Text, View } from 'react-native';

import DefaultScene from './components/DefaultScene';
import CreateSession from './components/CreateSession';
import InGamePredator from './components/InGamePredator';
import InGamePrey from './components/InGamePrey';
import JoinSession from './components/JoinSession';

class chatbiteApp extends Component {

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'create':
        return (<CreateSession navigator={navigator} title="create"/>);
      case 'join':
        return (<JoinSession navigator={navigator} title="join"/>);
      case 'predator':
        return (<InGamePredator navigator={navigator} title="predator" />);
      case 'prey':
        return (<InGamePrey navigator={navigator} title="prey" />);
      default :
        return (<DefaultScene navigator={navigator} title="default"/>);
    }
  }


  render() {
    return (
      <Navigator
        initialRoute={{id: 'default'}}
        renderScene={this.navigatorRenderScene}/>
    );
  }
}

AppRegistry.registerComponent('chatbiteApp', () => chatbiteApp);