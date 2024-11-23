interface PriceProps {
  sell: boolean;
  price: number;
}

export default function Price({ sell, price }: PriceProps) {
  return (
    <div
      className={`flex flex-row items-center h-9 border border-gray-200 shadow-sm px-2 py-1.5 rounded-full bg-blue-200 text-black
    ease-in
    duration-1
  `}
    >
      {sell ? (
        <div className="flex">
          <div className="font-bold pe-0.5">{price}</div>
          <p className="font-medium">zł</p>
        </div>
      ) : (
        <div className="flex">
          <div className="font-bold pe-0.5">{price} </div>
          <p className="font-medium">zł/msc</p>
        </div>
      )}
    </div>
  );
}
