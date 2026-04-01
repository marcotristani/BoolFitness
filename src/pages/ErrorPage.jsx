import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div>
      <h1 className="title-404">Hai sbagliato pagina</h1>
      <div className="card-404">
        <img src="/404-image.jpg" alt="" className="w-100" />
      </div>
      <div className="desc-404">
        <p>
          La pagina che stai cercando non esiste, ti consiglio di tornare alla
          home
        </p>
        <Link className="btn" to={"/"}>
          Torna alla home
        </Link>
      </div>
    </div>
  );
}
