import {Input, Button, Typography} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import api from "@/services/api";
import axios from "axios";
import "../../../public/css/backgrounds.css";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if(!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await api.post("/api/v1/auth/user/login", {
        email: email,
        password: password,
      });

      if(response.status === 200) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful");
        navigate('/dashboard/home');
      }
    } catch (error) {
      let errorMessage = "Login failed";
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
  }


  return (
    <section className="bg-green-200 flex gap-4 text-surface-mid-dark">
      <div className="w-full h-screen flex flex-col items-end justify-center bg-main">
        <div className="bg-white w-1/3 h-screen flex flex-col items-center justify-center shadow-md shadow-green-500">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">Sign in</Typography>
            <Typography variant="paragraph" className="text-lg font-normal text-surface-light-dark">Enter your email and password to sign in.</Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-3/4" onSubmit={handleSignIn}>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" className="-mb-3 font-medium text-surface-mid-light">
                Email
              </Typography>
              <Input
                size="lg"
                placeholder="Your email"
                className="!border-surface-mid-dark text-surface-mid-dark focus:!border-secondary"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Typography variant="small" className="-mb-3 font-medium text-surface-mid-light">
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="***********"
                className="!border-surface-mid-dark text-surface-mid-dark focus:!border-secondary"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button className="mt-6 bg-secondary hover:bg-primary duration-200" fullWidth type="submit">
                Sign In
              </Button>
              <div id="signInDiv" className="w-6"></div>
            </div>
            <Typography variant="small" className="text-center text-surface-light-dark font-medium mt-4">
              Not registered?
              <Link to="/auth/sign-up" className="text-secondary ml-1 hover:text-primary">Create account</Link>
            </Typography>
            {/* <Typography variant="small" className="text-center text-surface-light-dark font-medium mt-4">
              Forgot password?
              <Link to="/auth/send-reset-code" className="text-secondary ml-1 hover:text-primary">Reset password</Link>
            </Typography> */}
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
