import Image from "next/image";
import styles from "./page.module.css";
import MembersPage from "./member/page";
export default function Home() {
  return (
    <div className={styles.page}>
     <MembersPage/>
    </div>
  );
}
