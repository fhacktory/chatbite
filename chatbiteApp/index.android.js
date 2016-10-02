/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


 import React, { Component } from 'react';
import { AppRegistry, Navigator, Text, View, ToastAndroid } from 'react-native';

import DefaultScene from './components/DefaultScene';
import CreateSession from './components/CreateSession';
import InGamePredator from './components/InGamePredator';
import InGamePrey from './components/InGamePrey';
import JoinSession from './components/JoinSession';

import PushNotification from 'react-native-push-notification';


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

    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: (token) =>{
        //ToastAndroid.show('TOKEN'+token.token, ToastAndroid.SHORT);
        this.setState({token:token.token});
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: (notification)=> {
        //ToastAndroid.show('notification'+JSON.stringify(notification), ToastAndroid.LONG);
            switch (notification.type) {
              case 'start':
                //ToastAndroid.show(JSON.parse(notification.data).prey + ' '+this.state.name , ToastAndroid.LONG);
                if(JSON.parse(notification.data).prey === this.state.name){
                  this._navigator.push({id: 'prey'});
                }else{
                  this._navigator.push({id: 'predator'});
                }
                break;
              case 'updateprey':
                this.setState({preyPosition:notification.data});
                if(this.state && this.state.position){
                  this.setState({iAmClose:this.getDistanceFromLatLonInKm(this.state.position.lat, this.state.position.lng, notification.data.lat, notification.data.lng)});
                }
                break;
              case 'create':
                this._navigator.push({id: 'predator'});
                break;
            }
      },

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
      senderID: "37425605893",


      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
  });

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
            ToastAndroid.show('last '+lastPosition, ToastAndroid.LONG);
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
            ToastAndroid.show('last '+lastPosition, ToastAndroid.LONG);
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