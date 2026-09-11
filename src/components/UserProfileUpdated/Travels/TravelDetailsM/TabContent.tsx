const TabContent = ({ id, refProp, children }: { id: string; refProp: React.Ref<HTMLDivElement>; children: React.ReactNode }) => {
  return (
    <div id={id} ref={refProp} className="w-full bg-white shadow-md shadow-secondary rounded-lg ml-0 sm:ml-4 mt-3 p-5">
      {children}
    </div>
  );
};

export default TabContent;
