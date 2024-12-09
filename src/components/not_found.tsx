import notFound from "../assets/not-found.svg";

export default function NotFound() {
  return (
    <div className="flex-1 p-5 flex flex-col justify-center items-center">
      <img src={notFound} className="w-[30%] h-auto" />
      <div className="text-center mt-5 font-bold font-montserrat text-xl">
        Belum ada data
      </div>
    </div>
  );
}
