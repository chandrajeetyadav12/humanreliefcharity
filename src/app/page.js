import HumanReliefInfo from "./components/HumanReliefInfo";
import HeritageSlider from "./components/HeritageSlider";
import CharityFullBanner from "./components/CharityFullBanner";
export default function Home() {
    const slides = [
    {
      bgImage: "/bg1.jpg",
      titleHindi: "मानव राहत चैरिटेबल टीम",
      titleEnglish: "Human Relief Charitable Team",
      subtitle: "Helping One Another",
    },
    {
      bgImage: "/banner2.jpg",
      titleHindi: "ह्यूमन रिलीफ चैरिटेबल ट्रू संस्थान",
      titleEnglish: "Donate for Helpless",
      subtitle: " पता: Plot no.15 , block -A, Natvar singh ki kothi,Krishna nagar bharatpur Rajasthan 321001",
    },
  ];
  return (
    <div>
      <CharityFullBanner slides={slides} />

      <HeritageSlider/>
      <HumanReliefInfo/>
    </div>
  );
}
