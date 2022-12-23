import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import "./update.scss";
import { AuthContext } from "../../context/authContext";
import {  useNavigate } from "react-router-dom";
import PhotoIcon from '@mui/icons-material/Photo';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const Update = ({ setOpenUpdate, user }) => {
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const [cover, setCover] = useState(null);
	const [profile, setProfile] = useState(null);
	const [texts, setTexts] = useState({
		name: currentUser.name,
		city: currentUser.city,
	});

	const upload = async (file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			const res = await makeRequest.post("/upload", formData);
			return res.data;
		} catch (err) { console.log(err); }
	};

	const handleChange = (e) => {
		setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
	};

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (user) => {
			return makeRequest.put("/users", user);
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['user'] });
		},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		let coverUrl;
		let profileUrl;
		coverUrl = cover ? await upload(cover) : user.coverPic;
		profileUrl = profile ? await upload(profile) : user.profilePic;
		mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
		setOpenUpdate(false);
		navigate("/login");
	};

	return (
		<div className="update">
			<button onClick={() => setOpenUpdate(false)}>x</button>
			<h1>Оновити профіль</h1>
			<form>
				<input type="file" id="coverImg" style={{ display: "none" }} onChange={e => setCover(e.target.files[0])} />
				<label htmlFor="coverImg">
							<div className="item">
								<PhotoIcon style={{color: "#c25f15", fontSize: "2rem"}}/>
								<span>Додати шапку профілю</span>
							</div>
						</label>
				<input type="file" id="profileImg" style={{ display: "none" }} onChange={e => setProfile(e.target.files[0])} />
				<label htmlFor="profileImg">
							<div className="item">
								<CameraAltIcon style={{color: "#c25f15", fontSize: "2rem"}}/>
								<span>Додати фото профілю</span>
							</div>
						</label>
				<input type="text" name="name" placeholder="Ім'я та прізвище" onChange={handleChange} required/>
				<input type="text" name="city" placeholder="Місто" onChange={handleChange} />
				<button onClick={handleSubmit}>Підтвердити</button>
			</form>
		</div>
	);
};

export default Update;