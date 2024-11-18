export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      Uc Nuc
      <h1 className="text-center">404 Not Found</h1>
      <p className="text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <p className="text-center">
        Why you are seeing this page? please go back to the home page.
      </p>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Go to Home
      </button>
    </div>
  );
}
