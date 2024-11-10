import { Bounce, ToastContainer } from "react-toastify";
import Navigator from "./navigations/Navigator";

function App() {
  return (
    <>
      <Navigator />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        rtl={false}
        draggable
        progress={undefined}
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
