import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Login = () => {
	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});

	const [err, setErr] = useState(null);

	const navigate = useNavigate();

	const handleChange = e => {
		setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const { login } = useContext(AuthContext);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await login(inputs);
			navigate("/");
		} catch (err) {
			setErr(err.response.data);
		}
	};

	return (
		<div className="login">
			<div className="card">
				<div className="left">
					<h1>inTouch</h1>
					<p>Будьте на зв'язку з рідними та близькими.</p>
					<span>Не маєте профілю?</span>
					<Link to="/register">
						<button>Зареєструватися</button>
					</Link>

				</div>
				<div className="right">
					<h1>Увійдіть в обліковий запис</h1>
					<form>
						<input type="text" placeholder="Ім'я користувача" name="username" onChange={handleChange} />
						<input type="password" placeholder="Пароль" name="password" onChange={handleChange} />
						{err && err}
						<button onClick={handleLogin}>Увійти</button>
					</form>
				</div>
			</div>
		</div>
	)
};

export default Login;