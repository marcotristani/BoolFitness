import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";

const Loader = () => {
  return (
    <div className="overlay-loader">
      <div className="spinner-loader" role="status">
        <FontAwesomeIcon icon={faDumbbell} className="text-warning" />
      </div>
    </div>
  );
};

export default Loader;
