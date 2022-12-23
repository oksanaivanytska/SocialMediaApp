import "./profile.scss";
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import PlaceIcon from '@mui/icons-material/Place';
import Posts from "../../components/posts/Posts";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {

	const [openUpdate, setOpenUpdate] = useState(false);

	const { currentUser } = useContext(AuthContext);

	const userId = parseInt(useLocation().pathname.split("/")[2]);

	const { isLoading, error, data } = useQuery({
		queryKey: ['user'],
		queryFn: () =>
			makeRequest.get("/users/find/" + userId).then(res => {
				return res.data;
			})
	});

	const { isLoading: rIsLoading, data: relationshipData } = useQuery({
		queryKey: ['relationship'],
		queryFn: () =>
			makeRequest.get("/relationships?followedUserId=" + userId).then(res => {
				return res.data;
			})
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (following) => {
			if (following) return makeRequest.delete("/relationships?userId=" + userId);
			return makeRequest.post("/relationships", { userId });
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['relationship'] });

		},
	});

	const handleFollow = () => {
		mutation.mutate(relationshipData.includes(currentUser.id));
	};

	return (
		<div className="profile">
			{isLoading ? "loading" : <><div className="images">
				<img src={data.coverPic ? "/upload/" + data.coverPic : "https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} alt="" className="cover" />
				<img src={data.profilePic ? "/upload/" + data.profilePic : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU"} alt="" className="profilePic" />
			</div>
				<div className="profileContainer">
					<div className="uInfo">
						<div className="left">
							<a href="https://www.facebook.com/">
								<FacebookIcon fontSize="large" style={{ color: "#c25f15", fontSize: "2rem" }} />
							</a>
							<a href="https://www.instagram.com/">
								<InstagramIcon fontSize="large" style={{ color: "#c25f15", fontSize: "2rem" }} />
							</a>
							<a href="https://twitter.com/">
								<TwitterIcon fontSize="large" style={{ color: "#c25f15", fontSize: "2rem" }} />
							</a>
							<a href="https://www.linkedin.com/">
								<LinkedInIcon fontSize="large" style={{ color: "#c25f15", fontSize: "2rem" }} />
							</a>
							<a href="https://www.pinterest.com/">
								<PinterestIcon fontSize="large" style={{ color: "#c25f15", fontSize: "2rem" }} />
							</a>
						</div>
						<div className="center">
							<span>{data.name}</span>
							{rIsLoading ? "loading" : userId === currentUser.id ? (<button  onClick={() => setOpenUpdate(true)}>Оновити профіль</button>) : <button onClick={handleFollow}>{relationshipData.includes(currentUser.id) ? "Відписатись" : "Підписатись"}</button>}
						</div>
						<div className="right">
							<PlaceIcon style={{ color: "#c25f15", fontSize: "2rem" }} />
							<span>{data.city}</span>
						</div>
					</div>
					<Posts userId={userId} />
				</div></>}
			{openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
		</div>
	);
};

export default Profile;