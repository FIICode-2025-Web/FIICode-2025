import { Input, Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SignUp() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const register = async (register_data) => {
    try {
      const response = await api.post("/api/v1/auth/user/signup", {
        name: register_data.name,
        email: register_data.email,
        password: register_data.password,
      });

      if (response.status === 200 || response.status === 201) {
        navigate('/auth/sign-in');
        toast.success(" Cont creat cu succes! Te rugăm să te conectezi pentru a continua.");
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      let errorMessage = "Registration failed";
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server response:", error.response);
        if (error.response.data) {
          errorMessage += ": " + error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage += ": " + error.message;
      }
      toast.error(errorMessage);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{7,}$/;
    if (!regex.test(password)) {
      toast.error("Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character");
      return false;
    }
    return true;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  }

  const handleSignup = (e) => {
    e.preventDefault();

    if (inputs.username === '' || inputs.name === '' || inputs.email === '' || inputs.password === '' || inputs.confirmPassword === '') {
      toast.error("Please fill all the fields");
      return;
    }

    if (inputs.password !== inputs.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!validatePassword(inputs.password)) {
      return;
    }
    register(inputs);
  }
  return (
    <section className="bg-green-200 flex gap-4 text-surface-mid-dark">
      <div className="w-full h-screen flex flex-col items-end justify-center bg-main">
        <div className="bg-white w-full lg:w-2/4 xl:w-1/3 h-screen flex flex-col items-center justify-center shadow-md shadow-green-500">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-1">
              Alătură-te comunității Vaya
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal text-surface-light-dark">
              Creează-ți contul pentru a începe să călătorești cu noi
            </Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-3/4" onSubmit={handleSignup}>
            <div className="mb-2 flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium text-surface-mid-light">
                Email
              </Typography>
              <Input
                size="lg"
                type="email"
                placeholder="name@mail.com"
                name="email"
                className="!border-surface-mid-dark text-surface-mid-dark focus:!border-secondary"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2 flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium text-surface-mid-light">
                Nume
              </Typography>
              <Input
                size="lg"
                placeholder="Numele tău"
                name="name"
                className="!border-surface-mid-dark text-surface-mid-dark focus:!border-secondary"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2 flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium text-surface-mid-light">
                Parolă
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="Parola ta"
                name="password"
                className="!border-surface-mid-dark text-surface-mid-dark focus:!border-secondary"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2 flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium text-surface-mid-light">
                Confirmare parolă
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="Confirmă parola ta"
                name="confirmPassword"
                className="!border-surface-mid-dark text-surface-mid-dark focus:!border-secondary"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={handleChange}
              />
            </div>
            <Button className="mt-6 bg-secondary hover:bg-primary" fullWidth type="submit">
              Creează cont
            </Button>
            <Typography variant="paragraph" className="text-center text-surface-light-dark font-medium mt-4">
              Ai deja un cont?
              <Link to="/auth/sign-in" className="text-secondary ml-1 hover:text-primary">
                Conectează-te
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
