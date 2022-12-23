import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
	const userId = req.query.userId;

	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in.");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid.");

		const q = userId !== "undefined"
			? `SELECT posts.*, users.id AS userId, name, profilePic FROM posts JOIN users ON (users.id = posts.userId) WHERE  posts.userId = ? ORDER BY posts.createdAt DESC`
			: `SELECT posts.*, users.id AS userId, name, profilePic FROM posts JOIN users ON (users.id = posts.userId) 
		LEFT JOIN relationships ON (posts.userId = relationships.followedUserId) WHERE relationships.followerUserId = ? OR posts.userId = ?
		ORDER BY posts.createdAt DESC`;

		db.query(q, [userId !== "undefined" ? userId : userInfo.id, userInfo.id], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(data);
		});
	});
};

export const addPost = (req, res) => {

	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in.");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid.");

		const q = "INSERT INTO posts (`desc`, `img`, `userId`, `createdAt`) VALUES (?)";

		const values = [req.body.desc, req.body.img, userInfo.id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")];

		db.query(q, [values], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json("Post has been created.");
		});
	});
};

export const deletePost = (req, res) => {  

	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in.");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid.");

		const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

		db.query(q, [req.params.id, userInfo.id], (err, data) => {
			if (err) return res.status(500).json(err);
			if (data.affectedRows > 0) 
				return res.status(200).json("Post has been deleted.");
			return res.status(403).json("You can delete only your post"); // if it's not our post
		});
	});
};