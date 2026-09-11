'use client';
import Typography, { TypographyProps } from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';

interface CommonExpandTextProps extends TypographyProps {
  text: string;
  maxLines: number;
  expandMore?: string;
  expandLess?: string;
  classLink?: string;
  multiMaxLine?: number;
}
const CommonExpandText: React.FC<CommonExpandTextProps> = ({
  text,
  maxLines,
  expandMore,
  expandLess,
  classLink,
  multiMaxLine = 50,
  ...typographyProps
}) => {
  const [shouldShow, setShouldShow] = useState<Boolean>(false);
  const [showMore, setShowMore] = useState<Boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const containerStyle = getComputedStyle(container);
      const lineHeight = parseInt(containerStyle.lineHeight, 10);
      const paddingTop = parseInt(containerStyle.paddingTop, 10);
      const paddingBottom = parseInt(containerStyle.paddingBottom, 10);

      const containerHeight = container.getBoundingClientRect().height;
      const textHeight = (lineHeight + paddingTop + paddingBottom) * maxLines;

      setShouldShow(containerHeight > textHeight);
    }
  }, [text, maxLines]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // const displayedText = shouldShow ? (showMore ? text : text.slice(0, maxLines * multiMaxLine)) : text;
  const displayedText = shouldShow ? (showMore ? text : text ? text.slice(0, maxLines * multiMaxLine) : '') : text;

  return (
    <div ref={containerRef}>
      <Typography {...typographyProps}>
        {displayedText}
        {shouldShow && !showMore && (
          <span className={`${classLink ?? 'font-semibold ml-2 cursor-pointer'}`} onClick={toggleShowMore}>
            {`${expandMore ?? 'See more...'}`}
          </span>
        )}
      </Typography>
      {shouldShow && showMore && (
        <span className={`${classLink ?? 'font-semibold cursor-pointer'}`} onClick={toggleShowMore}>
          {`${expandLess ?? 'See less...'}`}
        </span>
      )}
    </div>
  );
};

export default CommonExpandText;
