interface LineWithDotsProps {
  lineHeight: string;
  color?: string;
}
const LineWithDots = ({ lineHeight, color = '#800080' }: LineWithDotsProps) => {
  return (
    <div className="flex flex-col items-center relative">
      {/* Top Circle */}
      <div className={`w-3 h-3 rounded-full bg-${color}`} />
      {/* Connecting Line */}
      <div className={`h-[${lineHeight}] w-[2px] bg-${color}`} style={{ height: lineHeight }} />
      {/* Bottom Circle */}
      <div className={`w-3 h-3 rounded-full bg-${color}`} />
    </div>
  );
};

export default LineWithDots;
