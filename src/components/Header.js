import { MainHeader } from "./MainHeader";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
export default function Header() {
  return (
    <>
      {/* TOP HEADER */}
      <div className="headerWrapper">
      <div className="topheader">
        <ul>
          <li><CallIcon /> <span>7599382068</span></li>
          <li><EmailIcon /> hrctrajasthanofficial@gmail.com</li>
          <li><HomeIcon />Plot no.15 , block -A, Natvar singh ki kothi,
            Krishna nagar bharatpur
            (Rajasthan)- 321001</li>
        </ul>
      </div>
      <MainHeader/>
      </div>
    </>
  );
}
