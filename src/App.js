import { useState, useRef } from "react";
import axios from "axios";

function App() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [pincode, setPincode] = useState("");
	const [address, setAddress] = useState("");
	const [error, setError] = useState("");
	const [errorFlag, setErrorFlag] = useState(false);

	const firstNameRef = useRef();
	const lastNameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const pincodeRef = useRef();
	const addressRef = useRef();
	const passwordMinLength = 4;

	const handleFormSubmission = async () => {
		setError("");
		if(firstName == "") {
			setError("Enter First Name");
			firstNameRef.current.focus();
			return;
		}
		if(lastName == "") {
			setError("Enter Last Name");
			lastNameRef.current.focus();
			return;
		}
		if(email == "") {
			setError("Enter Email");
			emailRef.current.focus();
			return;
		} else {
			const validateEmail = (email) => {
				return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
			};

			if(!validateEmail(email)){
				setError("Invalid Email");
				emailRef.current.focus();
				return
			}
		}
		if(password == "" || password.length < passwordMinLength) {
			setError(`Password must be ${passwordMinLength} characters`);
			passwordRef.current.focus();
			return;
		}
		if(confirmPassword == "" || confirmPassword.length < passwordMinLength) {
			setError(`Password must be ${passwordMinLength} characters`);
			confirmPasswordRef.current.focus();
			return;
		} else if(password !== confirmPassword) {
			setError("Match password");
			confirmPasswordRef.current.focus();
			return;
		}

		if(pincode == "") {
			setError("Enter Pincode");
			pincodeRef.current.focus();
			return;
		}
	
		if(address == "") {
			setError("Enter Address");
			addressRef.current.focus();
			return;
		}

		try {
			const response = await axios.post('http://localhost:4000/', {
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
				pincode: pincode,
				address: address
			}, { headers: { 'Content-Type': 'application/json' } });

			if(response.status === 200) {
				setErrorFlag(false);
				setError(response.data.message)
				setFirstName("");
				setLastName("");
				setEmail("");
				setPassword("");
				setConfirmPassword("");
				setPincode("");
				setAddress("");
			} else {
				setErrorFlag(true);
				setError(response.data.message)
			}
		} catch (error) {
			setErrorFlag(true);
			setError(JSON.stringify(error))
		}
	}

	return (
		<div className="container" style={{ margin: 10 }}>
			<div className='col-sm-6 col-md-5 col-lg-5'>
				<h2>User</h2>
				<br />
				{
					error != "" ?
						<div className={errorFlag ? "alert alert-danger": "alert alert-success"}>{ error }</div>
					: null
				}
				<form>
					<div className="form-group">
						<label>First Name</label>
						<input
							ref={firstNameRef}
							onChange={(e) => setFirstName(e.target.value)}
							value={firstName}
							type="text"
							className="form-control"
							placeholder="Enter Name"
						/>
					</div>
					<div className="form-group">
						<label>Last Name</label>
						<input
							ref={lastNameRef}
							onChange={(e) => setLastName(e.target.value)}
							value={lastName}
							type="text"
							className="form-control"
							placeholder="Enter Last Name"
						/>
					</div>
					<div className="form-group">
						<label>Email address</label>
						<input
							ref={emailRef}
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							type="email"
							className="form-control"
							placeholder="Enter email"
						/>
						<small className="form-text text-muted">We'll never share your email with anyone else.</small>
					</div>
					<div className="form-group">
						<label>Password</label>
						<input
							ref={passwordRef}
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							type="password"
							className="form-control"
							placeholder="Password"
						/>
					</div>
					<div className="form-group">
						<label>Confirm Password</label>
						<input
							ref={confirmPasswordRef}
							onChange={(e) => setConfirmPassword(e.target.value)}
							value={confirmPassword}
							type="password"
							className="form-control"
							placeholder="Password"
						/>
					</div>
					<div className="form-group">
						<label>Pincode</label>
						<input
							ref={pincodeRef}
							onChange={(e) => setPincode(e.target.value)}
							value={pincode}
							type="text"
							className="form-control"
							placeholder="Pincode"
							maxLength={7}
						/>
					</div>
					<div className="form-group">
						<label>Address</label>
						<textarea
							ref={addressRef}
							onChange={(e) => setAddress(e.target.value)}
							value={address}
							className="form-control"
							placeholder="Type address here.."
						/>
					</div>
					<br />
					<button type="button" onClick={() => handleFormSubmission()} className="btn btn-primary">Submit</button>
				</form>
			</div>
		</div>
	);
}

export default App;