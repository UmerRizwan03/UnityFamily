import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { supabase } from './supabaseClient';

const LoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(true); // State to toggle between Login and Signup
  const [showOtpField, setShowOtpField] = useState(false); // State to show/hide OTP field
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [familyCode, setFamilyCode] = useState(''); // State for the unique family code input

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { emailOrPhone, password } = formData;
    // Supabase sign-in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password: password
    });
    if (error) {
      alert('Invalid admin email or password.');
      return;
    }
    alert('Admin Login successful!');
    // Optionally fetch family members here or after navigation
    navigate('/home');
  };

  // Optional: Fetch family members after login
  const fetchFamilyMembers = async () => {
    const { data, error } = await supabase
      .from('family_members')
      .select('*');
    if (error) {
      alert('Failed to fetch family members: ' + error.message);
      return [];
    }
    return data;
  };
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // This function is now primarily for initiating signup and sending OTP
    console.log('Initiating Signup for:', formData.emailOrPhone);
    // TODO: Implement backend call to send OTP
    alert('Signup initiation and OTP sending needs backend implementation.'); // Placeholder alert
    setShowOtpField(true); // Show OTP field after initiating signup/sending OTP
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // TODO: Implement OTP verification logic (backend API call)
    console.log('Verifying OTP:', formData.otp);
    alert('OTP verification needs backend implementation.'); // Placeholder alert
    // On successful verification, complete signup or login
    // After successful verification, you might want to automatically log the user in
    // or redirect them to the login page if it was a signup verification.
  };

  const handleSendOtp = () => { // <-- This is where the function is defined
    // TODO: Implement logic to send OTP (backend API call)
    console.log('Sending OTP to:', formData.emailOrPhone);
    alert('Resending OTP needs backend implementation.'); // Placeholder alert
    // You might want to add a timer or cooldown here
  };

  // Function to handle family code input change
  const handleFamilyCodeChange = (e) => {
    setFamilyCode(e.target.value);
  };

  // Function to handle family code submission
  const handleFamilyCodeSubmit = (e) => {
    e.preventDefault();
    // Hardcoded example family codes (replace with backend validation)
    const validFamilyCodes = ["CODE123", "FAMILY456", "UNITY789"]; 

    if (validFamilyCodes.includes(familyCode)) {
      alert("Family access granted!");
      // Redirect to the home page or a specific family view
      navigate("/home"); // Redirect to home page for now
    } else {
      alert("Invalid family code.");
    }
  };

  // Function to toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine which form submit handler to use
  const currentSubmitHandler = showOtpField ? handleVerifyOtp : (isLoginView ? handleLoginSubmit : handleSignupSubmit);

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="bg-neutral-900/80 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-neutral-800">
        <div className="p-6 bg-gradient-to-br from-accent-primary/70 to-accent-secondary/70 text-white text-center">
          <h2 className="text-2xl font-bold">{isLoginView ? 'Login' : (showOtpField ? 'Verify Account' : 'Sign Up')}</h2>
        </div>

        {/* Use the determined submit handler for the form */}
        {/* Separate forms for Admin Login, Signup/OTP, and Family Code */}
        {isLoginView && !showOtpField && (
           <form onSubmit={handleLoginSubmit} className="p-8 space-y-6">
             {/* Admin Login Fields */}
             <div>
               <label htmlFor="emailOrPhone" className="block text-sm font-medium text-neutral-300 mb-1">Admin Email or Phone</label>
               <div className="relative">
                 <input
                   id="emailOrPhone"
                   type="text"
                   name="emailOrPhone"
                   className="form-input-modern bg-neutral-700/30 border-neutral-700 text-neutral-100 placeholder-neutral-400 focus:ring-accent-primary focus:border-accent-primary pr-10"
                   placeholder="Admin Email or Phone"
                   value={formData.emailOrPhone}
                   onChange={handleInputChange}
                   required
                 />
                 <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                   <i className="fas fa-envelope text-neutral-400"></i> {/* Use appropriate icon class */}
                 </span>
               </div>
             </div>

             <div>
               <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">Admin Password</label>
               <div className="relative">
                 <input
                   id="password"
                   type={showPassword ? "text" : "password"}
                   name="password"
                   className="form-input-modern bg-neutral-700/30 border-neutral-700 text-neutral-100 placeholder-neutral-400 focus:ring-accent-primary focus:border-accent-primary pr-10"
                   placeholder="Enter password"
                   value={formData.password}
                   onChange={handleInputChange}
                   required
                 />
                 <button
                   type="button"
                   onClick={handleTogglePasswordVisibility}
                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-200 focus:outline-none"
                   aria-label={showPassword ? "Hide password" : "Show password"}
                 >
                   {showPassword ? (
                     <i className="fas fa-eye-slash"></i>
                   ) : (
                     <i className="fas fa-eye"></i>
                   )}
                 </button>
               </div>
             </div>

             {/* Admin Login Button */}
             <button type="submit" className="w-full px-4 py-2 rounded-md text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary-hover hover:to-accent-secondary-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-md">
               Admin Login
             </button>

             {/* Separator */}
             <div className="text-center text-neutral-500 text-sm my-4">- OR -</div>

             {/* Toggle to Family Access */}
             <button
                type="button"
                onClick={() => setIsLoginView(false)} // Switch to Family Access view
                className="w-full text-center text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
              >
                Access with Family Code
              </button>
           </form>
        )}

        {/* Family Code Access Form */}
        {!isLoginView && !showOtpField && (
           <form onSubmit={handleFamilyCodeSubmit} className="p-8 space-y-6">
             <div>
               <label htmlFor="familyCode" className="block text-sm font-medium text-neutral-300 mb-1">Family Access Code</label>
               <input
                 id="familyCode"
                 type="text"
                 name="familyCode"
                 className="form-input-modern bg-neutral-700/30 border-neutral-700 text-neutral-100 placeholder-neutral-400 focus:ring-accent-primary focus:border-accent-primary"
                 placeholder="Enter unique family code"
                 value={familyCode}
                 onChange={handleFamilyCodeChange}
                 required
               />
             </div>

             {/* Family Access Button */}
             <button type="submit" className="w-full px-4 py-2 rounded-md text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary-hover hover:to-accent-secondary-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-md">
               Access Family Site
             </button>

             {/* Separator */}
             <div className="text-center text-neutral-500 text-sm my-4">- OR -</div>

             {/* Toggle back to Admin Login */}
             <button
                type="button"
                onClick={() => setIsLoginView(true)} // Switch back to Admin Login view
                className="w-full text-center text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
              >
                Admin Login
              </button>
           </form>
        )}


        {/* Signup and OTP Verification Form (remains the same, but shown only when !isLoginView and showOtpField) */}
        {!isLoginView && showOtpField && (
           <form onSubmit={handleVerifyOtp} className="p-8 space-y-6">
             {/* Email/Phone (disabled when OTP is shown) */}
             <div>
               <label htmlFor="emailOrPhone" className="block text-sm font-medium text-neutral-300 mb-1">Email or Phone Number</label>
               <div className="relative">
                 <input
                   id="emailOrPhone"
                   type="text"
                   name="emailOrPhone"
                   className="form-input-modern bg-neutral-700/30 border-neutral-700 text-neutral-100 placeholder-neutral-400 focus:ring-accent-primary focus:border-accent-primary pr-10"
                   placeholder="Email or Phone"
                   value={formData.emailOrPhone}
                   onChange={handleInputChange}
                   required
                   disabled={showOtpField} // Disable input if OTP is shown
                 />
                 <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                   <i className="fas fa-envelope text-neutral-400"></i> {/* Use appropriate icon class */}
                 </span>
               </div>
             </div>

             {/* OTP Field */}
             <div>
               <label htmlFor="otp" className="block text-sm font-medium text-neutral-300 mb-1">Verification Code (OTP)</label>
               <input
                 id="otp"
                 type="text"
                 name="otp"
                 className="form-input-modern bg-neutral-700/30 border-neutral-700 text-neutral-100 placeholder-neutral-400 focus:ring-accent-primary focus:border-accent-primary"
                 placeholder="Enter OTP"
                 value={formData.otp}
                 onChange={handleInputChange}
                 required
               />
             </div>

             {/* Buttons for OTP verification */}
             <div className="space-y-4">
               <button type="submit" className="w-full px-4 py-2 rounded-md text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary-hover hover:to-accent-secondary-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-md">
                 Verify Code
               </button>

               {/* Option to resend OTP or go back during verification */}
               <div className="flex justify-between text-sm">
                 <button
                   type="button"
                   onClick={handleSendOtp} // Re-use send OTP logic
                   className="text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                 >
                   Resend Code
                 </button>
                 <button
                   type="button"
                   onClick={() => {
                     setShowOtpField(false); // Go back to initial signup form
                     setFormData({ ...formData, otp: '' }); // Clear OTP field
                   }}
                   className="text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                 >
                   Go Back
                 </button>
               </div>
             </div>
           </form>
        )}

      </div>
    </div>
  );
};

export default LoginPage;