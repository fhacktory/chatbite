import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import gcm from 'node-gcm';


let session;
let users;
let arrayUsers;
let prey;
let predators;


let sendToAll = (data, typeNotification)=>{
		let message = new gcm.Message();
		message.addData({
		    data: JSON.stringify(data),
		    type: typeNotification
		});

		let sender = new gcm.Sender('AIzaSyBRpJDRmZIm-s4EBo-IxLqK6pBLefBpDtM');

		let registrationTokens = [];
		console.log('Object.keys(users)',Object.keys(users));
		Object.keys(users).map((name)=>{
			console.log('users[name].token', users[name].token);
			if(users[name].token){
				registrationTokens.push(users[name].token);
			}
			
		});

		sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
		  if(err) console.error(err);
		  else    console.log(response);
		});
}

let sendToOne = (nameUser, data, typeNotification)=>{
		let message = new gcm.Message();
		message.addData({
		    data: JSON.stringify(data),
		    type: typeNotification
		});

		let sender = new gcm.Sender('AIzaSyBRpJDRmZIm-s4EBo-IxLqK6pBLefBpDtM');

		let registrationTokens = [];
		registrationTokens.push(users[nameUser].token);
		
		sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
		  if(err) console.error('err', err);
		  else    console.log('response', response);
		});
}

let sendToAllPredators = (data, typeNotification)=>{
	console.log('sendToAllPredators');
		let message = new gcm.Message();
		console.log('JSON.stringify(data)', JSON.stringify(data));
		message.addData({
		    data: JSON.stringify(data),
		    type: typeNotification
		});

		let sender = new gcm.Sender('AIzaSyBRpJDRmZIm-s4EBo-IxLqK6pBLefBpDtM');

		let registrationTokens = [];
		Object.keys(predators).map((name)=>{
			console.log('predators[name]',predators[name]);
			if(predators[name].token){
				registrationTokens.push(predators[name].token);
			}
			console.log('map', registrationTokens);
		});

		console.log('end map', registrationTokens);

		sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
		  if(err) console.error('err', err);
		  else    console.log('response', response);
		});
}

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });

	});

	api.post('/create/session', (req, res) => {
		session = true;
		users = {};
		console.log('req', req.body.token);
		users[req.body.username]={status:null, gps:{lat: null, long: null}, token:req.body.token};
		sendToOne(req.body.username, {}, 'test');
		res.json({ satus:true});
	});

	api.post('/join/session', (req, res) => {
		console.log('req join', req.body.token);
		users[req.body.username]={status:null, gps:{lat: null, long: null}, token:req.body.token};
		res.json({ satus:true});
	});

	api.post('/start/session', (req, res) => {
		arrayUsers = Object.keys(users);
		prey = arrayUsers[Math.floor(Math.random() * arrayUsers.length)];
		predators = {};
		for (let i = 0; i < arrayUsers.length ; i ++ ) {
			if(arrayUsers[i] !== prey){
				users[arrayUsers[i]].status='predator';
				predators[arrayUsers[i]] = {gps:{lat: null, long: null}, status: 'predator', token: users[arrayUsers[i]].token};
			}else{
				users[arrayUsers[i]].status='prey';
			}
		}
		users[prey].status = 'prey';
		console.log('prey', prey);
		sendToAll(JSON.stringify({users:users, predators:predators, prey:prey}), 'start');
		res.json({ satus:true, users : users, predators:predators, prey:users[prey]}); 
	});

	api.post('/get/position/predators', (req, res) => {
		res.json({ satus:true, users : users, predators:predators, prey:users[prey]}); 
	});

	api.post('/update/position/user', (req, res) => {
		users[req.body.username].gps = req.body.gps;
		if(req.body.username === prey){
			console.log('uodate prey position', req.body.gps);
			sendToAllPredators(req.body.gps,'updateprey');
		}
		res.json({ satus:true});

	});

	return api;
}
