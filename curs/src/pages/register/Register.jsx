import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Register = () => {

	const navigate = useNavigate();
	const { login } = useContext(AuthContext);

	const [inputs, setInputs] = useState({
		username: "",
		email: "",
		password: "",
		name: "",
	});

	const [err, setErr] = useState(null);

	const handleChange = e => {
		setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleClick = async e => {
		e.preventDefault();

		try {
			await axios.post("http://localhost:8800/api/auth/register", inputs);
			await login(inputs);
			navigate("/");
		} catch (err) {
			setErr(err.response.data);
		}
	};

	console.log(err);

	return (
		<div className="register">
			<div className="card">
				<div className="left">
					<h1>inTouch</h1>
					<p>Розширюйте свою соціальну мережу та будьте в курсі того, що зараз в тренді.</p>
					<span>Є обліковий запис?</span>
					<Link to="/login">
						<button>Увійти</button>
					</Link>

				</div>
				<div className="right">
					<h1>Створіть свій профіль</h1>
					<form>
						<input type="text" placeholder="Ім'я користувача" name="username" onChange={handleChange} />
						<input type="email" placeholder="Ел. пошта" name="email" onChange={handleChange} />
						<input type="password" placeholder="Пароль" name="password" onChange={handleChange} />
						<input type="text" placeholder="Ім'я та прізвище" name="name" onChange={handleChange} />
						{err && err}
						<button onClick={handleClick}>Зареєструватися</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Register;