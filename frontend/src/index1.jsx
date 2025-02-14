// import React from "react";
// import { Link } from "react-router-dom";
// import ContactUsFooter from "./footer";

// function Landing_Page() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-grow">
//         <h1 className="text-2xl font-bold mb-4">Landing Page</h1>
//         <Link to="/dashboard" className="cursor-pointer mr-4">
//           Dashboard
//         </Link>

//         <br />

//         <Link to="/academic-info" className="cursor-pointer">
//           Academic Details
//         </Link>



//       </main>

//       <footer className="mt-auto">
//         <ContactUsFooter />
//       </footer>
//     </div>
//   );
// }

// export default Landing_Page;
import React from "react";
import { Link } from "react-router-dom";
import ContactUsFooter from "./footer";

function Landing_Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gray-700 text-white p-4 text-center">
        <h1 className="text-4xl font-bold">Welcome to CMS Platform</h1>
        <p className="text-lg mt-2">Your journey starts here</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">Choose an option to proceed</p>
          
          {/* Login and Register buttons */}
          <div className="space-y-6"> {/* Increased space between buttons */}
            <Link 
              to="/login" 
              className="w-full sm:w-64 mx-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
            >
              Login
            </Link>

            <Link 
              to="/registeration" 
              className="w-full sm:w-64 mx-auto px-6 py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors"
            >
              If not a user, Register
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-gray-800 text-white py-6">
        <ContactUsFooter />
      </footer>
    </div>
  );
}

export default Landing_Page;
