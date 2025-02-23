import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "./auth.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password } = values;

    if (!validatePassword(password)) {
      toast.error("Password must have at least 8 characters, 1 uppercase, 1 lowercase, and 1 special character.", toastOptions);
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(registerAPI, {
        firstName,
        lastName,
        email,
        password
      });

      if (data.success) {
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", toastOptions);
    }

    setLoading(false);
  };

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: { color: { value: '#000' } },
            fpsLimit: 60,
            particles: {
              number: { value: 200, density: { enable: true, value_area: 800 } },
              color: { value: '#ffcc00' },
              shape: { type: 'circle' },
              opacity: { value: 0.5, random: true },
              size: { value: 3, random: { enable: true, minimumValue: 1 } },
              move: { enable: true, speed: 2 },
            },
            detectRetina: true,
          }}
          style={{ position: 'absolute', zIndex: -1, top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <Container className="mt-5" style={{ position: 'relative', zIndex: 2, color: "white" }}>
          <Row>
            <h1 className="text-center">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "white" }} />
            </h1>
            <h1 className="text-center text-white">Welcome to Expenzo</h1>
            <Col md={{ span: 6, offset: 3 }}>
              <h2 className="text-white text-center mt-5">Registration</h2>
              <Form onSubmit={handleSubmit}>
                {/* First Name */}
                <Form.Group controlId="formFirstName" className="mt-3">
                  <Form.Label className="text-white">First Name</Form.Label>
                  <Form.Control type="text" name="firstName" placeholder="First Name" value={values.firstName} onChange={handleChange} required />
                </Form.Group>

                {/* Last Name */}
                <Form.Group controlId="formLastName" className="mt-3">
                  <Form.Label className="text-white">Last Name</Form.Label>
                  <Form.Control type="text" name="lastName" placeholder="Last Name" value={values.lastName} onChange={handleChange} required />
                </Form.Group>

                {/* Email */}
                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label className="text-white">Email address</Form.Label>
                  <Form.Control type="email" name="email" placeholder="Enter email" value={values.email} onChange={handleChange} required />
                </Form.Group>

                {/* Password */}
                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label className="text-white">Password</Form.Label>
                  <Form.Control type="password" name="password" placeholder="Password" value={values.password} onChange={handleChange} required />
                  <Form.Text className="text-muted">
                    Must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 special character.
                  </Form.Text>
                </Form.Group>

                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }} className="mt-4">
                  <Button type="submit" className="text-center mt-3 btnStyle" disabled={loading}>
                    {loading ? "Registering..." : "Signup"}
                  </Button>

                  <p className="mt-3" style={{ color: "#9d9494" }}>
                    Already have an account? <Link to="/login" className="text-white lnk">Login</Link>
                  </p>
                </div>
              </Form>
            </Col>
          </Row>
          <ToastContainer />
        </Container>
      </div>
    </>
  );
};

export default Register;
