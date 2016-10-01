import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';


let session;
let users;
let arrayUsers;
let prey;
let predators;


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
		console.log('req', req.body.username);
		users[req.body.username]={status:null, gps:{lat: null, long: null}};
		res.json({ satus:true});
	});

	api.post('/join/session', (req, res) => {
		users[req.body.username]={status:null, gps:{lat: null, long: null}};
		res.json({ satus:true});
	});

	api.post('/start/session', (req, res) => {
		arrayUsers = Object.keys(users);
		prey = arrayUsers[Math.floor(Math.random() * arrayUsers.length)];
		predators = {};
		for (let i = 0; i < arrayUsers.length ; i ++ ) {
			if(arrayUsers[i] !== prey){
				users[arrayUsers[i]].status='predator';
				predators[arrayUsers[i]] = {gps:{lat: null, long: null}};
			}else{
				users[arrayUsers[i]].status='prey';
			}
		}
		users[prey].status = 'prey';
		res.json({ satus:true, users : users, predators:predators, prey:users[prey]}); 
	});

	api.post('/get/position/predators', (req, res) => {
		res.json({ satus:true, users : users, predators:predators, prey:users[prey]}); 
	});

	api.post('/update/position/user', (req, res) => {
		users[req.body.username].gps = req.body.gps;
	});

	return api;
}
