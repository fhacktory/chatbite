import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';


let session;
let users;


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
		user[req.body.username]=true;
		res.json({ satus:true});
	});

	api.post('/join/session', (req, res) => {
		user[req.body.username]=true;
		res.json({ satus:true});
	});

	return api;
}
