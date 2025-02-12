const ContactUsFooter = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold">Contact Us</h2>
            <p className="text-sm mt-1">123 Street, City, Country</p>
            <p className="text-sm">Email: contact@example.com</p>
            <p className="text-sm">Phone: +123 456 7890</p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default ContactUsFooter;
  