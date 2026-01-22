import React from 'react'
import Link from 'next/link'
const Footer = () => {
  return (
  <footer className="footer bg-dark text-white py-4">
      <div className="container">
        <div className="row">

          {/* Column 1: Logo */}
          <div className="col-md-4 mb-3 mb-md-0 text-center text-md-start">
            <h5>Human Relief Charity </h5>
            <p>Making the world better together</p>
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
                <Link href="#" className="text-white text-decoration-none">About Us</Link>

              </li>
              <li>
                <Link href="/" className="text-white text-decoration-none">Home</Link>

              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-md-4 text-center text-md-start">
            <h5>Contact Us</h5>
            <p className="mb-1">123 Charity Street</p>
            <p className="mb-1">City, State, 123456</p>
            <p className="mb-0">Phone: +91 9876543210</p>
            <p className="mb-0">Email: info@hrct.com</p>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="text-center mt-3">
          <small>© {new Date().getFullYear()} Human relief charity. All rights reserved.</small>
        </div>
      </div>
    </footer>
  )
}

export default Footer