import Image from "next/image";
import styles from "./page.module.css";
import MembersPage from "./member/page";
import HumanReliefInfo from "./components/HumanReliefInfo";
export default function Home() {
  return (
    <div className={`d-flex${styles.page}`}>
      <HumanReliefInfo/>
     <MembersPage/>
    </div>
  );
}
