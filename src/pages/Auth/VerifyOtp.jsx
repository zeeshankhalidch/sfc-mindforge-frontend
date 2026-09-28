import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  CircleDollarSign,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import "./Auth.css";

function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(
      /\D/g,
      ""
    );

    setOtp(value.slice(0, 6));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter the complete 6-digit code");
      return;
    }

    toast.success("Email verified");

    navigate("/reset-password");
  };

  const resendCode = () => {
    toast.success("A new code has been sent");
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <section className="auth-side">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">
              <CircleDollarSign size={23} />
            </span>

            <span>Campus Coin</span>
          </Link>

          <div className="auth-side-content">
            <p className="auth-small-text">
              Email Verification
            </p>

            <h1>Check Your Inbox.</h1>

            <p>
              Enter the verification code sent to your email
              to continue resetting your password.
            </p>

            <div className="auth-visual">
              <div className="auth-visual-circle">
                <MailCheck
                  size={65}
                  strokeWidth={1.5}
                />
              </div>

              <div className="auth-mini-icon coin-icon">
                <ShieldCheck size={22} />
              </div>
            </div>
          </div>

          <span className="auth-side-footer">
            Your goals. Your money. Your support.
          </span>
        </section>

        <section className="auth-form-side">
          <div className="auth-form-wrapper">
            <Link
              to="/"
              className="mobile-auth-brand"
            >
              <CircleDollarSign size={25} />
              <span>Campus Coin</span>
            </Link>

            <div className="auth-heading">
              <span>Email Verification</span>

              <h2>Enter verification code</h2>

              <p>
                We sent a 6-digit code to your email
                address.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="auth-field">
                <label htmlFor="otp">
                  Verification code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength="6"
                  className="otp-input"
                  placeholder="000000"
                  value={otp}
                  onChange={handleOtpChange}
                />
              </div>

              <button
                type="submit"
                className="auth-submit"
              >
                Verify Code
              </button>
            </form>

            <div className="otp-help">
              <span>
                Didn't receive the code?
              </span>

              <button
                type="button"
                onClick={resendCode}
              >
                Resend code
              </button>
            </div>

            <p className="auth-switch">
              Wrong email?{" "}
              <Link to="/forgot-password">
                Go back
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default VerifyOtp;