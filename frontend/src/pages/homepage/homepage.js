import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/header/header";
import Footer from "../../components/layout/footer/footer";
import Banner from "../../components/banner/banner";
//import Sidebox from "../../components/sidebox/sidebox";
import Loginbox from "../../components/layout/loginbox/loginbox";
import Registerbox from "../../components/layout/registerbox/registerbox";

export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {

    document.getElementById("root").classList.add("homepage");
  }, []);


  const [loginboxVisibility, setLoginboxVisibility] = useState(false);
  const [registerboxVisibility, setRegisterboxVisibility] = useState(false);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("individual");

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirmation: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    const expirationTime = localStorage.getItem('tokenExpiration');

    if (storedToken && expirationTime && new Date().getTime() < expirationTime) {
      setIsLoggedIn(true);
    }
  }, []);
  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/user/login', {
        email: email,
        password: password
      }, { withCredentials: true });

      console.log(response, "  fe  login")
      if (response.data.success) {
        console.log(response, "  login response")
        const userToken = response.data.token;
        console.log(userToken, "fe login")

        localStorage.setItem('userToken', userToken)
        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiration', expirationTime);
        setIsLoggedIn(true);
        setLoginboxVisibility(false);
        setLoading(false);

        window.location.reload();


      } else {
        alert("Unexpected response from server");
      }
    } catch (error) {
      if (error.response) {
        setLoading(false);

        if (error.response.status === 401) {
          alert("Invalid email or password. Please try again.");
        } else {
          alert("Server error. Please try again later.");
        }
      } else if (error.request) {

        alert("No response from server. Please try again later.");
      } else {

        alert("Request failed. Please check your internet connection and try again.");
      }
    }
  };
  const logout = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get("http://localhost:3001/user/logout", { withCredentials: true });


      setIsLoggedIn(false);
      setLoginboxVisibility(false);
      localStorage.removeItem("userToken");
      localStorage.removeItem("tokenExpiration");


    } catch (error) {

    }

  };

  const register = async (event) => {

    event.preventDefault();
    if (activeTab === "corporate") {

      try {
        const response = await axios.post("http://localhost:3001/user/company/register", {
          registerData: registerData
        });

        if (response.status === 201) {
          setRegisterboxVisibility(false);
          setLoading(false);

          alert("Register successful");

        } else {
          alert("Unexpected response from server");
        }
      }

      catch (error) {
        if (error.response) {
          setLoading(false);

          if (error.response.status === 401) {
            alert(error.response.data.error);
          } else {
            alert("Server error. Please try again later.");
          }
        } else if (error.request) {

          alert("No response from server. Please try again later.");
        } else {

          alert("Request failed. Please check your internet connection and try again.");
        }
      }
    }
    else if (activeTab === "individual") {

      try {
        const response = await axios.post("http://localhost:3001/user/personal/register", {
          registerData: registerData
        });

        if (response.status === 201) {
          setRegisterboxVisibility(false);
          setLoading(false);

          alert("Register successful");

        } else {
          alert("Unexpected response from server");
        }
      }

      catch (error) {
        if (error.response) {
          setLoading(false);

          if (error.response.status === 401) {
            alert(error.response.data.error);
          } else {
            alert("Server error. Please try again later.");
          }
        } else if (error.request) {

          alert("No response from server. Please try again later.");
        } else {

          alert("Request failed. Please check your internet connection and try again.");
        }
      }
    }
  }



  return (
    <div className="wrapper homepage">
      <Header
        auth={isLoggedIn}
        logout={logout}
        setLoginboxVisibility={setLoginboxVisibility}
        setRegisterboxVisibility={setRegisterboxVisibility}
      />
      <Banner setRegisterboxVisibility={setRegisterboxVisibility} />
      {!isLoggedIn && (
        <>
          <Loginbox
            login={login}
            loginboxVisibility={loginboxVisibility}
            setLoginboxVisibility={setLoginboxVisibility}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            setError={setError}
            loading={loading}
          />
          <Registerbox
            register={register}
            registerboxVisibility={registerboxVisibility}
            setRegisterboxVisibility={setRegisterboxVisibility}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            registerData={registerData}
            setRegisterData={setRegisterData}
            error={error}
            setError={setError}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

