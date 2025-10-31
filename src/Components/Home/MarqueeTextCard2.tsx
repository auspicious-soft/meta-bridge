type MarqueeTextCard2Props = {
  items: string[];
};
const MarqueeTextCard2 = ({ items }: MarqueeTextCard2Props) => {
  return (
    <div className="overflow-hidden w-full">
      <div className="flex animate-marquee-reverse whitespace-nowrap gap-3">
        {/* Duplicate items to create seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="px-[30px] py-[18px] bg-white/5 rounded-[15px] outline outline-1 outline-offset-[-1px] outline-white/20 inline-flex justify-center items-center gap-2.5 text-white text-sm md:text-lg  uppercase"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeTextCard2;
