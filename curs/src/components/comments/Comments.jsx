import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import moment from "moment";
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

const Comments = ({ postId }) => {
	const { currentUser } = useContext(AuthContext);
	const [desc, setDesc] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);

	const { isLoading, error, data } = useQuery({
		queryKey: ['comments'],
		queryFn: () =>
			makeRequest.get("/comments?postId=" + postId).then(res => {
				return res.data;
			})
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (newComment) => {
			return makeRequest.post("/comments", newComment);
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['comments'] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (commentId) => {
			return makeRequest.delete("/comments/" + commentId);
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['comments'] });

		},
	});

	const handleClick = async (e) => {
		e.preventDefault();
		mutation.mutate({ desc, postId });
		setDesc("");
	};

	return (
		<div className="comments">
			<div className="write">
				<img src={currentUser.profilePic ? "/upload/" + currentUser.profilePic : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU"} alt="" />
				<input type="text" placeholder="напишіть коментар..." value={desc} onChange={e => setDesc(e.target.value)} />
				<button onClick={handleClick}>Відправити</button>
			</div>
			{isLoading ? "loading" : data.map(comment => (
				<div className="comment" key={comment.id}>
					<img src={comment.profilePic ? "/upload/" + comment.profilePic : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU"} alt="" />
					<div className="info">
						<span>{comment.name}</span>
						<p>{comment.desc}</p>
					</div>
					<span className="date">{moment(comment.reatedAt).fromNow()}</span>
					<MoreHorizOutlinedIcon style={{cursor: "pointer"}} onClick={() => setMenuOpen(!menuOpen)} />
					{menuOpen && comment.userId === currentUser.id && <button style={{cursor: "pointer"}} onClick={() => deleteMutation.mutate(comment.id)}>Видалити</button>}
				</div>
			))}
		</div>
	);
};

export default Comments;