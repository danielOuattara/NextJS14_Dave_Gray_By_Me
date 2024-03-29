import Image from "next/image";

export default function ProfilePic() {
  return (
    <section className="w-full mx-auto">
      <Image
        src={"/images/kangaroo_jack.jpg"}
        alt="Daniel Ouattara"
        width={200}
        height={200}
        priority={true}
        className="border-2 border-black dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto mt-8"
      />
    </section>
  );
}
