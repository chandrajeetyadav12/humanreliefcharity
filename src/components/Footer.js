import React from 'react'
import Link from 'next/link'
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-4">
      <div className="container">
        <div className="row">

          {/* Column 1: Logo */}
          <div className="col-md-4 mb-3 mb-md-0 text-center text-md-start">
            <h5>HUMAN RELIEF CHARITABLE TEAM  </h5>
            <p>Making the world better together with HUMAN RELIEF CHARITABLE TRUE SANSTHAN</p>
            <Link href="/register" className="text-white text-decoration-none">Register</Link>

          </div>

          {/* Column 2: Links */}
          <div className="col-md-4 mb-3 mb-md-0 text-start">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/member" className="text-white text-decoration-none">Member List</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white text-decoration-none">Contact Us</Link>
              </li>
              <li>
                <Link href="/aboutus" className="text-white text-decoration-none">About Us</Link>

              </li>
              <li>
                <Link href="/" className="text-white text-decoration-none">Home</Link>

              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-md-4 text-center text-md-start">
            

            <p className="mb-1"><HomeIcon sx={{color:"white"}}/>  Plot no.15 , block -A, Natvar singh ki kothi,
              Krishna Nagar Bharatpur
              Rajasthan 321001</p>
            <p className="mb-0"><CallIcon sx={{ color: "white" }} /> +91 7599382068</p>
            <p className="mb-0"><EmailIcon sx={{color:"white"}}/> hrctrajasthanofficial@gmail.com</p>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="text-center mt-3">
          <small>© {new Date().getFullYear()} HUMAN RELIEF CHARITABLE TRUE SANSTHAN. All rights reserved.</small>
        </div>
      </div>
    </footer>
  )
}

export default Footer