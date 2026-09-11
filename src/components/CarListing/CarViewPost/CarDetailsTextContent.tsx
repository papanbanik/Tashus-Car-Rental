import MoreLessButton from '@/components/Common/Buttons/MoreLessButton';
import DisplayRichText from '@/components/Common/DisplayRichText';
import useExpanded from '@/hooks/custom-hooks/useExpanded';
import { getShortenText } from '@/utils/Functions/randomCommonFn';

interface CarDetailsTextContentProps {
  textContent: string;
}

const CarDetailsTextContent = ({ textContent }: CarDetailsTextContentProps) => {
  const { isShorten, formattedText } = getShortenText(textContent, 150);
  const [isExpanded, toggleExpand] = useExpanded();

  const shouldTruncate = isShorten && !isExpanded;

  return (
    <div>
      {/* <div className={`${shouldTruncate ? 'truncate overflow-hidden' : ''}`}> */}
      <div>
        <DisplayRichText content={shouldTruncate ? formattedText : textContent} />
      </div>

      {isShorten && <MoreLessButton isExpanded={isExpanded} toggleExpand={toggleExpand}></MoreLessButton>}
    </div>
  );
};

export default CarDetailsTextContent;
