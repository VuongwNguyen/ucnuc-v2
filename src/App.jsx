import { Bounce, ToastContainer } from "react-toastify";
import Navigator from "./navigations/Navigator";
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <Navigator />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
    </Provider>
  );
}

export default App;
