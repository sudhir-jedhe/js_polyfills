import { useState, useCallback } from "react";
import "./styles.css";
import { debounce } from "lodash";

export default function App() {
  // store the email address
  const [email, setEmail] = useState("");

  // store the valid state of email
  const [invalidEmail, setInvalidEmail] = useState(false);

  // helper function that checks email using regex
  const isValidEmail = (email) => {
    return /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(
      email
    );
  };

  // function to validate email
  const validateEmail = (text) => {
    if (!!text && !isValidEmail(text)) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
    }
  };

  // debounce the function to initiate test
  // when user stops writing for certain time
  const debouncedValidateEmail = useCallback(debounce(validateEmail, 1000), []);

  // email change handler
  // stores the email and validates it
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    debouncedValidateEmail(e.target.value);
  };

  return (
    <div className="App">
      <div className="field-area">
        <label>Email: </label>
        <input
          type="email"
          name="email"
          placeholder="Your email please"
          value={email}
          onChange={emailChangeHandler}
        />
        {invalidEmail && <p>Please enter a valid email address</p>}
      </div>
    </div>
  );
}