import { useState } from "react";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "./App.css";

const LoginForm = () => {
 const [track, setTrack] = useState(0);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");

 const verifyEmail = async () => {
   // async operations
   // validate email
   if (email) {
     setTrack(1);
   }
 };

 const handleSubmit = async () => {
   // async operations
 };

 const Email = () => (
   <>
     <TextBoxComponent
       type="email"
       value={email}
       placeholder="Email"
       floatLabelType="Auto"
       input={({ value }) => setEmail(value)}
       cssClass="e-outline"
     />
     <div className="buttonWrapper">
       <ButtonComponent
         type="submit"
         cssClass="e-info"
         style={{ fontSize: "18px", padding: "10px 20px" }}
         onClick={verifyEmail}
       >
         Next
       </ButtonComponent>
     </div>{" "}
   </>
 );

 const Password = () => (
   <>
     <TextBoxComponent
       type="password"
       value={password}
       placeholder="Password"
       floatLabelType="Auto"
       input={({ value }) => setPassword(value)}
       cssClass="e-outline"
       key="2"
     />
     <div className="buttonWrapper">
       <ButtonComponent
         type="submit"
         cssClass="e-danger"
         onClick={() => setTrack(0)}
         style={{ fontSize: "18px", padding: "10px 20px" }}
       >
         Change Email
       </ButtonComponent>{" "}
       <ButtonComponent
         type="submit"
         cssClass="e-success"
         onClick={handleSubmit}
         style={{ fontSize: "18px", padding: "10px 20px" }}
       >
         Submit
       </ButtonComponent>
     </div>
   </>
 );

 // verify the email first and then the password
 return track === 0 ? <Email /> : <Password />;
};

export default LoginForm;



/************************************************* */


import React, { Component } from "react";
import styles from "./index.module.css";
import { isEmpty } from "lodash";
import Button from "../Button";
import Input from "../Input";

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    isLoading: false,
    error: {
      status: false,
      message: ""
    },
    success: false
  };

  handleInputChange = ({ name, value }) => {
    this.setState({
      [name]: value,
      error: {
        status: false,
        message: ""
      }
    });
  };

  shouldSubmitDisable = () => {
    return isEmpty(this.state.username) || isEmpty(this.state.password);
  };

  handleKeyPressed = e => {
    if (e.event.key === "Enter" && !this.shouldSubmitDisable()) {
      this.handleSubmitClick();
    }
  };

  handleSubmitClick = async () => {
    const { username, password } = this.state;
    this.setState({ isLoading: true });

    try {
      //Replace this with api call
      //Or action
      if (username === "Prashant Yadav" && password === "123456789") {
        this.setState({
          success: true
        });
      } else {
        this.setState({
          error: {
            status: true,
            message: "Invalid Credentials"
          }
        });
      }
    } catch (e) {
      this.setState({
        error: {
          status: true,
          message: e
        }
      });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { username, password, isLoading, error, success } = this.state;

    return (
      <>
        <div className={styles.wrapper}>
          {/* Form element */}
          <form className={styles.box} onSubmit={this.handleSubmitClick}>
            <div className={styles.container}>
              <div className={styles.header}>Sign in</div>

              {/* User credentials input */}
              <div className={styles.content}>
                <Input
                  label="Username"
                  name="username"
                  placeholder="your username"
                  className={styles.userType}
                  value={username}
                  onKeyDown={this.handleKeyPressed}
                  onChange={this.handleInputChange}
                />
                <Input
                  type="password"
                  label="Password"
                  name="password"
                  placeholder="your password"
                  className={styles.userType}
                  value={password}
                  onKeyDown={this.handleKeyPressed}
                  onChange={this.handleInputChange}
                />
              </div>

              {/* Submit Button */}
              <div className={styles.footer}>
                <Button
                  className={styles.submitBtn}
                  type="submit"
                  label="Sign in"
                  disabled={this.shouldSubmitDisable()}
                  onClick={this.handleSubmitClick}
                  isLoading={isLoading}
                />
              </div>

              {/* Forgot password */}
              <div className={styles.forgotPassword}>
                <span>forgot password?</span>
              </div>

              {/* show error message */}
              {error.status && (
                <div className={styles.error}>{error.message}</div>
              )}

              {/* Show success Message */}
              {success && (
                <div className={styles.success}>Login Successful!.</div>
              )}
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default LoginForm;

.container {
    padding: 0 32px;
    width: 100%;
  }
  
  .wrapper {
    display: flex;
    justify-content: center;
    height: 100vh;
    background-color: #f7f8fa;
    background: linear-gradient(90deg, #ffffff 0%, #ffffff 20%, #f7f8fa 98.27%);
  }
  
  .box {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 365px;
    max-width: 460px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
    padding: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .logoWrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .content > input {
    margin-bottom: 15px;
    box-shadow: rgba(0, 0, 0, 1) 0px 0px 0px 1px inset,
      rgba(28, 28, 29, 1) 0px 0px 2px inset;
  }
  
  .header {
    display: inline-block;
    position: relative;
    width: 100%;
    font-weight: 600;
    font-size: 20px;
    text-align: center;
    line-height: 25px;
    color: #1d1c22;
    padding: 10px 0;
  }
  
  .footer {
    display: flex;
    width: 100%;
    text-align: right;
    bottom: 0;
    left: 0;
    padding: 0 0 15px;
    justify-content: flex-end;
  }
  
  .submitBtn {
    height: 40px;
  }
  
  .error,
  .success {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: relative;
    height: 24px;
    font-size: 16px;
    padding: 24px 0;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .error {
    color: #ec454d;
  }
  
  .success {
    color: #8bc34a;
  }
  
  .forgotPassword {
    text-align: right;
    width: 100%;
    color: #004bdc;
    text-transform: capitalize;
    font-weight: 600;
  }
  
  .forgotPassword > a {
    cursor: pointer;
    color: #8bc34a;
  }
  
  .forgotPassword > a:hover {
    color: blue;
  }