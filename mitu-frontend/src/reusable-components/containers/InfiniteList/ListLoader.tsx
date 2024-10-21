import { ScaleLoader } from 'react-spinners';

export default function ListLoader() {
  return (
    <div className="w-full flex justify-center items-center">
      <ScaleLoader loading={true} color={'#FF0000'} />
    </div>
  );
}
