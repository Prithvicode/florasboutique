import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="mt-10">
        <hr />
        <div className="px-12 py-9 font-ovo flex flex-col space-y-4 text-slate-700  md:text-center">
          <h2 className="text-lg">Quick links</h2>
          <ul className="text-sm  flex flex-col space-y-6 md:flex-row  md:items-center md:justify-center md:space-x-9 md:space-y-0">
            <li>About</li>
            <li>Terms & Conditions</li>
            <li>Returns</li>
            <li>Security & Privacy Policy</li>
            <li>Shipping</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <hr />

        <p className="text-xs p-3 md:pl-56 font-extralight md:text-left  text-slate-500 text-center tracking-widest ">
          &copy; 2024, FlorasBoutique by Prithvi Ghatani
        </p>
      </footer>
    </>
  );
};

export default Footer;
