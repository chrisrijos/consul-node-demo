import bodyParser from "body-parser";

import { findAll as airportFindAll } from "./model/airport";
import { findAll as flightPathFindAll } from "./model/flightPath";
import { createLogin, login, book, booked } from "./model/auth.js";

let jsonParser = bodyParser.json();

let urlencodedParser = bodyParser.urlencoded({"extended": false});

export default function (app) {

	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	app.get("/api/airport/findAll", (req, res) => {
		if (req.query.search) {
			airportFindAll(req.query.search, (err, done) => {
				if (err) {
					res.status = 400;
					res.send(err);
					return;
				}
				res.status = 202;
				res.send(done);
			});
		} else {
			res.status = 400;
			res.send({"airport": "bad request"});
		}
	});

	app.get("/api/flightPath/findAll", (req, res) => {
		if (req.query.from && req.query.to && req.query.leave) {
			flightPathFindAll(req.query.from, req.query.to, req.query.leave, (err, done) => {
				if (err) {
					res.status = 400;
					res.send(err);
					return;
				}
				res.status = 202;
				res.send(done);
			});
		} else {
			res.status = 400;
			res.send({"flightPath": "bad request"});
		}
	});

	app.post("/api/user/login", jsonParser, (req, res) => {
		createLogin(req.body.user, req.body.password, (err, done) => {
			if (err) {
				res.status = 400;
				res.send(err);
				return;
			}
			res.status = 202;
			res.send(done);
		});
	});

	app.get("/api/user/login", urlencodedParser, (req, res) => {
		login(req.query.user, req.query.password, (err, check) => {
			if (err) {
				res.status = 400;
				res.send(err);
				return;
			}
			if (check) {
				res.status = 202;
				res.send(check);
			}
		});
	});

	app.post("/api/user/flights", jsonParser, (req, res) => {
		book(req.body.token, req.body.flights, (err, done) => {
			if (err) {
				res.status = 400;
				res.send(err);
				return;
			}
			res.status = 202;
			res.send({"added": done});
		});
	});

	app.get("/api/user/flights", urlencodedParser, (req, res) => {
		booked(req.query.token, (err, done) => {
			if (err) {
				res.status = 400;
				res.send(err);
				return;
			}
			res.status = 202;
			res.send(done);
		});
	});
}
