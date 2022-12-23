import "./post.scss";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { AuthContext } from "../../context/authContext";


const Post = ({ post }) => {

	const [commentOpen, setCommentOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	const { currentUser } = useContext(AuthContext);

	const { isLoading, error, data } = useQuery({
		queryKey: ['likes', post.id],
		queryFn: () =>
			makeRequest.get("/likes?postId=" + post.id).then(res => {
				return res.data;
			})
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (liked) => {
			if (liked) return makeRequest.delete("/likes?postId=" + post.id);
			return makeRequest.post("/likes", { postId: post.id });
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['likes'] });

		},
	});

	const deleteMutation = useMutation({
		mutationFn: (postId) => {
			return makeRequest.delete("/posts/" + postId);
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['posts'] });

		},
	});

	const handleLike = () => {
		mutation.mutate(data.includes(currentUser.id));
	};

	const handleDelete = () => {
		deleteMutation.mutate(post.id);
	};

	return (
		<div className="post">
			<div className="container">
				<div className="user">
					<div className="userInfo">
						<img src={post.profilePic ? "/upload/" + post.profilePic : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU"} alt="" />
						<div className="details">
							<Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
								<span className="name">{post.name}</span>
							</Link>
							<span className="date">{moment(post.createdAt).fromNow()}</span>
						</div>
					</div>
					<MoreHorizOutlinedIcon style={{cursor: "pointer"}} onClick={() => setMenuOpen(!menuOpen)} />
					{menuOpen && post.userId === currentUser.id && <button onClick={handleDelete}>Видалити</button>}
				</div>
				<div className="content">
					<p>{post.desc}</p>
					<img src={"/upload/" + post.img} alt="" />
				</div>
				<div className="info">
					<div className="item">
						{isLoading ? "loading" : data.includes(currentUser.id) ? <FavoriteOutlinedIcon onClick={handleLike} /> : <FavoriteBorderOutlinedIcon onClick={handleLike} />}
						{data?.length} Лайкнути
					</div>
					<div className="item" onClick={() => setCommentOpen(!commentOpen)}>
						<TextsmsOutlinedIcon />
						Відкрити Коментарі
					</div>
				</div>
				{commentOpen && <Comments postId={post.id} />}
			</div>
		</div >
	);
};

export default Post;