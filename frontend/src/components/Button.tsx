export const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-[rgb(128,182,77)] hover:bg-[rgb(154,219,93)]  text-white font-bold py-4 px-8 rounded shadow-lg"
    >
      {children}
    </button>
  );
};
