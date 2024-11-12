import { Bounce, ToastContainer } from "react-toastify";
import Navigator from "./navigations/Navigator";
import MasonryGrid from "../demo/script/MasonryGrid";

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
    // <div className="App p-8">
    //   <h1 className="text-3xl font-bold text-center mb-8">
    //     Masonry Grid with Tailwind & Masonry-Layout
    //   </h1>
    //   <MasonryGrid />
    // </div>
  );
}

export default App;
