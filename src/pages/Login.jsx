import { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    navigate("/home");
    return null;
  }

  const onSubmit = async (data) => {
    const { email } = data;
    try {
      const response = await axios.get(
        `http://localhost:5000/users?email=${email}`
      );
      if (response.data.length > 0) {
        login(response.data[0]);
        navigate("/home");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>
          <button type="submit" className="btn btn-primary center">
            Submit
          </button>
        </form>
        <div className="mt-2">
          Don&apos;t have an account?
          <span style={{ marginLeft: "2px" }}>
            <Link to={"/register"}>Register</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
