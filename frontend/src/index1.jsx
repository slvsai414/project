import React from "react";
import { Link } from "react-router-dom";
import ContactUsFooter from "./footer";

function Landing_Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <h1 className="text-2xl font-bold mb-4">Landing Page</h1>
        <Link to="/dashboard" className="cursor-pointer mr-4">
          Dashboard
        </Link>

        <br />

        <Link to="/academic-info" className="cursor-pointer">
          Academic Details
        </Link>



      </main>

      <footer className="mt-auto">
        <ContactUsFooter />
      </footer>
    </div>
  );
}

export default Landing_Page;
