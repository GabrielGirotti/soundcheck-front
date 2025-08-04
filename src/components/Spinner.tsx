const Spinner: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-40">
    <div
      className="animate-spin rounded-full h-16 w-16 border-4"
      style={{
        borderImage: "linear-gradient(to right, #fb923c, #ec4899) 1",
        borderStyle: "solid",
        borderWidth: "4px",
      }}
    ></div>
    <p className="mt-8">Cargando...</p>
  </div>
);

export default Spinner;