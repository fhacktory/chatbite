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

   constructor(props) {
    super(props);
    this.state = {name: null, urlServer: 'https://sleepy-shore-33533.herokuapp.com/api/', token:null, statuts: null, position: null, preyPosition:null, iAmClose: 0};

    this.updateName = this.updateName.bind(this);
    this.navigatorRenderScene =this.navigatorRenderScene.bind(this);
    this.getDistanceFromLatLonInKm = this.getDistanceFromLatLonInKm.bind(this);
    this.deg2rad = this.deg2rad.bind(this);
  }

  updateName(name){
    //ToastAndroid.show('update name '+ name, ToastAndroid.LONG);
    this.setState({name});
  }


  watchID: ?number = null;


  componentDidMount(){


  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2){
  var R = 6371; // Radius of the earth in km
  var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  var dLon = this.deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

deg2rad(deg) {
  return deg * (Math.PI/180)
}

  navigatorRenderScene(route, navigatores) {
    this._navigator = navigatores;
    _navigator = navigatores;
    switch (route.id) {
      case 'create':
        return (<CreateSession urlServer={this.state.urlServer} navigator={navigatores} title="create"/>);
      case 'join':
        return (<JoinSession  navigator={navigatores} title="join"/>);
      case 'predator':
            this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            this.setState({position:{lat : position.coords.latitude, lng: position.coords.longitude}});

            if(this.state.preyPosition){
              this.setState({iAmClose:this.getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, this.state.preyPosition.lat, this.state.preyPosition.lng)});
            }

            fetch(this.state.urlServer+'update/position/user', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username:this.state.name, gps:{lat : position.coords.latitude, lng: position.coords.longitude}})
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log('responseJson', responseJson);
              //this.props.navigator.push({id: 'create'})
            })
            .catch((error) => {
              console.error(error);
            });
          },{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

        return (<InGamePredator indiceClose={this.state.iAmClose} urlServer={this.state.urlServer} username={this.state.name}  navigator={navigatores} title="predator" />);
      case 'prey':
              this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            this.setState({position:{lat : position.coords.latitude, lng: position.coords.longitude}});

            if(this.state.preyPosition){
              this.setState({iAmClose:this.getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, this.state.preyPosition.lat, this.state.preyPosition.lng)});
            }

            fetch(this.state.urlServer+'update/position/user', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username:this.state.name, gps:{lat : position.coords.latitude, lng: position.coords.longitude}})
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log('responseJson', responseJson);
              //this.props.navigator.push({id: 'create'})
            })
            .catch((error) => {
              console.error(error);
            });
          },{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
        return (<InGamePrey urlServer={this.state.urlServer} username={this.state.username} navigator={navigatores} title="prey" />);
      default :
        return (<DefaultScene token={this.state.token} urlServer={this.state.urlServer} updateName={this.updateName} navigator={navigatores} title="default"/>);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
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