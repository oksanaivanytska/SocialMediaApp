import "./share.scss";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from "../../axios";

const Share = () => {
	const [file, setFile] = useState(null);
	const [desc, setDesc] = useState("");

	const upload = async () => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			const res = await makeRequest.post("/upload", formData);
			return res.data;
		} catch (err) { console.log(err); }
	};

	const { currentUser } = useContext(AuthContext);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (newPost) => {
			return makeRequest.post("/posts", newPost);
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		},
	});

	const handleClick = async (e) => {
		e.preventDefault();
		let imgUrl = "";
		if (file) imgUrl = await upload();
		mutation.mutate({ desc, img: imgUrl });
		setDesc("");
		setFile(null);
	};

	return (
		<div className="share">
			<div className="container">
				<div className="top">
					<img src={currentUser.profilePic ? "/upload/" + currentUser.profilePic : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU"} alt="" />
					<input type="text" placeholder="Що нового?" onChange={e => setDesc(e.target.value)} value={desc} />
				</div>
				<hr />
				<div className="bottom">
					<div className="left">
						<input type="file" id="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
						<label htmlFor="file">
							<div className="item">
								<AddPhotoAlternateIcon style={{color: "#c25f15", fontSize: "2rem"}}/>
								<span>Додати зображення</span>
							</div>
						</label>
					</div>
					<div className="right">
						<button onClick={handleClick}>Поділитися</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Share;