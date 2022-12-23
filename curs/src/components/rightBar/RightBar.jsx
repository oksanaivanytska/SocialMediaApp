import "./rightBar.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const RightBar = () => {

	const { isLoading, error, data } = useQuery(["recommends"], () =>
		makeRequest.get("/recommends").then((res) => {
			return res.data;
		})
	);

	return (
		<div className="rightBar">
			<div className="container">
				<div className="item">
					<h2>inTouch ком'юніті</h2>
					{error ? "Something went wrong" : isLoading ? "loading" : data.map((recommend) => (
						<div className="recommend" key={recommend.id}>
							<img src={recommend.profilePic  ? "/upload/" + recommend.profilePic : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU"} alt="" />
							<Link to={`/profile/${recommend.id}`} style={{ textDecoration: "none", color: "inherit" }}>
								<span>{recommend.name}</span>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
};

export default RightBar;