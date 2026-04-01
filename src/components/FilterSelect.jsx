export default function FilterSelect({
  order,
  setOrder,
  isFilterOn,
  setIsFilterOn,
}) {
  return (
    <>
      <div className="filter-container mt-5 row justify-content-between">
        <div className="my-select d-flex align-items-center col-3">
          {/* <span className="me-2 col-6">Ordina per...</span> */}
          <select
            value={order}
            className="search-select"
            onChange={(e) => {
              setOrder(e.target.value);
            }}
          >
            <option defaultValue="">Ordina per...</option>
            <option value="less_price">Meno costoso</option>
            <option value="more_price">Più costoso</option>
            <option value="latest_arrivals">Ultimi arrivi</option>
            <option value="first_arrivals">Primi arrivi</option>
            <option value="name">Per nome</option>
          </select>
        </div>
        <div className="filter-search-button col-3 d-flex align-items-center">
          <button
            className={
              isFilterOn ? "filter-search-active" : "filter-search-not-active"
            }
            onClick={() =>
              isFilterOn ? setIsFilterOn(false) : setIsFilterOn(true)
            }
          >
            Prodotti scontati
          </button>
        </div>
      </div>
    </>
  );
}
