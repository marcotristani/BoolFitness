import { Link } from "react-router-dom"
import logo from '../assets/boolshop-logo-2nd.svg';

export default function MainFooter() {
    return (
        <footer className="gym-footer">
            <div className="my-footer container">

                {/* Logo */}
                <div className="text-center mb-4">
                    <img className="logo img-fluid" src={logo} />
                </div>

                {/* Links */}
                <div className="row text-center text-md-start justify-content-lg-around">

                    <div className="col-12 col-md-4 col-lg-2 mb-4">
                        <h5 className="footer-title">SU DI NOI</h5>
                        <Link to={"/"} className="footer-text d-block">Chi siamo</Link>
                        <Link to={"/"} className="footer-text d-block">Lavora con noi</Link>
                        <Link to={"/"} className="footer-text d-block">Production</Link>
                        <Link to={"/"} className="footer-text d-block">Per le aziende</Link>
                        <Link to={"/"} className="footer-text d-block">Testimonianze</Link>
                        <Link to={"/"} className="footer-text d-block">Privacy Policy</Link>
                        <Link to={"/"} className="footer-text d-block">Condizioni vendita</Link>
                        <Link to={"/"} className="footer-text d-block">Cookie</Link>
                    </div>

                    <div className="col-12 col-md-4 col-lg-2 mb-4">
                        <h5 className="footer-title">INFORMAZIONI</h5>
                        <Link to={"/"} className="footer-text d-block">Contatti</Link>
                        <Link to={"/"} className="footer-text d-block">Consegne e Spedizioni</Link>
                        <Link to={"/"} className="footer-text d-block">Soddisfatti o Rimborsati</Link>
                        <Link to={"/"} className="footer-text d-block">Metodi di pagamento</Link>
                        <Link to={"/"} className="footer-text d-block">FAQs</Link>
                        <Link to={"/"} className="footer-text d-block">Guest Tracking</Link>
                        <Link to={"/"} className="footer-text d-block">Istruzioni Prodotti</Link>
                        <Link to={"/"} className="footer-text d-block">Fine Serie</Link>
                    </div>

                    <div className="col-12 col-md-4 col-lg-2 mb-4">
                        <h5 className="footer-title">ACCOUNT</h5>
                        <Link to={"/"} className="footer-text d-block">Informazioni Personali</Link>
                        <Link to={"/"} className="footer-text d-block">Ordini</Link>
                        <Link to={"/"} className="footer-text d-block">Note di Credito</Link>
                        <Link to={"/"} className="footer-text d-block">Indirizzi</Link>
                        <Link to={"/"} className="footer-text d-block">I miei buoni</Link>
                        <Link to={"/"} className="footer-text d-block">Notifiche Disponibilità</Link>
                        <Link to={"/"} className="footer-text d-block">Le mie liste desideri</Link>
                    </div>

                    <div className="col-12 col-md-6 col-lg-2 mb-4">
                        <h5 className="footer-title">BLOG</h5>
                        <Link to={"/"} className="footer-text d-block">Blog</Link>
                        <Link to={"/"} className="footer-text d-block">Panche</Link>
                        <Link to={"/"} className="footer-text d-block">Home Gym</Link>
                    </div>

                    <div className="col-12 col-md-6 col-lg-2 mb-4">
                        <h5 className="footer-title">SERVIZI</h5>
                        <Link to={"/"} className="footer-text d-block">Noleggio</Link>
                        <Link to={"/"} className="footer-text d-block">Allestimenti</Link>
                        <Link to={"/"} className="footer-text d-block">Progettazione render</Link>
                        <Link to={"/"} className="footer-text d-block">Montaggio</Link>
                        <Link to={"/"} className="footer-text d-block">Home gym</Link>
                        <Link to={"/"} className="footer-text d-block">Acquisto in sede</Link>
                        <Link to={"/"} className="footer-text d-block">Campus ed università</Link>
                    </div>

                </div>
            </div>
        </footer>
    )
}