const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" />
      <span>{message}</span>
    </div>
  );
};

export default Loader;
