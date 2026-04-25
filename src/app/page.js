import HumanReliefInfo from "./components/HumanReliefInfo";
import HeritageSlider from "./components/HeritageSlider";
import CharityFullBanner from "./components/CharityFullBanner";
import Link from "next/link";
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
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-light border rounded-4 shadow p-5 text-center">

              <h2 className="fw-bold text-success mb-3">
                हमारे संगठन से जुड़ें
              </h2>

              <p className="text-muted fs-5 mb-4">
                सदस्य बनकर संगठन को मजबूत करें और समाज सेवा में अपना योगदान दें।
                अभी पंजीकरण करें और हमारे परिवार का हिस्सा बनें।
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">

                <Link
                  href="/register"
                  className="btn btn-success btn-lg px-5 py-3 fw-bold rounded-pill shadow text-decoration-none d-inline-flex align-items-center justify-content-center gap-2"
                >
                  <span>📝</span>
                  <span>सदस्यता लें</span>
                </Link>

                <Link
                  href="/login"
                  className="btn btn-outline-primary btn-lg px-5 py-3 fw-bold rounded-pill shadow text-decoration-none d-inline-flex align-items-center justify-content-center gap-2"
                >
                  <span>🔐</span>
                  <span>लॉगिन करें</span>
                </Link>

              </div>

            </div>
          </div>
        </div>
      </div>
      <HeritageSlider />
      <HumanReliefInfo />
    </div>
  );
}
