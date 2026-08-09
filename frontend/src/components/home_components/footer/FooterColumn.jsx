const FooterColumn = ({ title, children }) => {
  return (
    <div className="flex flex-col">

      <h3 className="text-xl font-bold uppercase tracking-normal text-[#45653A]">
        {title}
      </h3>

      <div className="mt-2 h-[3px] w-12 rounded-full bg-[#7C9B63]" />
      
      <div className="mt-4 flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
};

export default FooterColumn;