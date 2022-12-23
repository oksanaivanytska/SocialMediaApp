import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
	const q = "SELECT * FROM users WHERE username = ?";
	db.query(q, [req.body.username], (err, data) => {
		if (err) return res.status(500).json(err);
		if (data.length) return res.status(409).json("User already exists!");  // check user if existis

		const salt = bcrypt.genSaltSync(10); // to hash a password
		const hashedPassword = bcrypt.hashSync(req.body.password, salt);  // hash a password of a new user

		const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)";
		const values = [req.body.username, req.body.email, hashedPassword, req.body.name];

		db.query(q, [values], (err, data) => {             // create a new user
			if (err) return res.status(500).json(err);
			return res.status(200).json("User has been created.");
		});
	});
};

export const login = (req, res) => {
	const q = "SELECT * FROM users WHERE username = ?";
	db.query(q, [req.body.username], (err, data) => {  // that returned data is an array with only one user.
		if (err) return res.status(500).json(err);
		if (data.length === 0) return res.status(404).json("User not found.");

		const checkPassword = bcrypt.compareSync(req.body.password, data[0].password); // check if equal
		if (!checkPassword) return res.status(400).json("Wrong password or username.");

		const token = jwt.sign({ id: data[0].id }, "secretkey");

		const { password, ...others } = data[0];

		res.cookie("accessToken", token, {
			httpOnly: true,   // in this case random scripts cannot use our cookie
		}).status(200).json(others); // all except password

	});
};

export const logout = (req, res) => {
	res.clearCookie("accessToken", {
		secure: true,
		sameSite: "none"
	}).status(200).json("User has been logged out.");
};