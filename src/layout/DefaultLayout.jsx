// import outlet
import { Outlet } from "react-router-dom";
//importo
import { useApi } from "../contexts/ApiProvider";
// import MainHeader
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";

//importo componente loader
import Loader from "../components/Loader";

function DefaultLayout() {
  //definisco isloading
  const { isLoading } = useApi();
  return (
    <>
      <MainHeader />
      <main>
        <Outlet />
        {isLoading && <Loader />}
      </main>
      <MainFooter />
    </>
  );
}

export default DefaultLayout;
