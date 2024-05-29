import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { username, email, password } = data;
    try {
      await axios.post("http://localhost:5000/users", {
        username,
        email,
        password,
      });
      navigate("/");
    } catch (error) {
      console.error("Error registering", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <span className="error-message">{errors.username.message}</span>
            )}
          </div>
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
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        <div className="mt-2">
          Already have an account?
          <span style={{ marginLeft: "2px" }}>
            <Link to={"/"}>Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
