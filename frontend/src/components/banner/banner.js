
import logo from "../../images/logo.png";


export default function Banner({ setRegisterboxVisibility }) {
  const handleLetsStartClick = () => {
    setRegisterboxVisibility(true);
  };

  return (
    <section className="banner">
      <div className="container">
        <div className="banner__left">
          <h1>
            Empowering<b>Businesses</b> with Customer Insights

          </h1>
          <p>
            Businesses struggle to process customer feedback from various commercial platforms. Our AI tool analyzes product reviews providing actionable insights. With advanced sentiment analysis, businesses can prioritize improvements.
          </p>
          <h3>
            <a className="banner__left__button" onClick={handleLetsStartClick}>
              Let's Start
            </a>
          </h3>
        </div>
        <div className="banner__right">
          <img src={logo} alt="" />
        </div>
      </div>
    </section>
  );
}
