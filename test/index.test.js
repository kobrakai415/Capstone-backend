import supertest from "supertest";
import server from "../src/server.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jest from "jest"
// import AccomodationModel from "../models/accomodation/schema.js"

dotenv.config();

const request = supertest(server);

beforeAll((done) => {
	console.log(process.env.MONGOOSE_CONNECTION);

	mongoose.connect(process.env.MONGOOSE_CONNECTION, { useNewUrlParser: true }).then(() => {
		console.log("Successfully connected to Atlas! 🍌");
		done();
	});
});


afterAll((done) => {
	mongoose.connection.dropDatabase().then(() => {
		mongoose.connection.close().then(() => {
			console.log("Closed connection to Atlas!");
			done()
		});
	});
});

describe("Stage I - Testing the test env", () => {
	it("should test that true is true", () => {
		expect(true).toBe(true);
	});

	it("should test that false is not true", () => {
		expect(false).not.toBe(true);
	});

	it("should test that false is falsy", () => {
		expect(false).toBeFalsy();
	});
});

