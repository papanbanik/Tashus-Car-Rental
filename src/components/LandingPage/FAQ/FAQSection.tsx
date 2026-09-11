'use client';
import DisplayRichText from '@/components/Common/DisplayRichText';
import { faqData } from '@/utils/Lists/landingPage';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { MdExpandMore } from 'react-icons/md';

const FAQSection = () => {
  return (
    <div className="flex items-center justify-center commonMarginBottom">
      <div className="w-full md:w-10/12 flex flex-col items-center justify-center">
        <div>
          <span className="text-2xl lg:text-4xl text-black font-bold text-center ">
            Learn more about <span className="text-primary">TASHUS</span>
          </span>
        </div>
        <div className="pt-5">
          {faqData.map((item: { answer: string; question: string }, index: number) => (
            <Accordion key={index}>
              <AccordionSummary
                className="bg-[#F6F1F6]"
                expandIcon={<MdExpandMore className="text-primary font-bold" />}
                aria-controls={`${index}-content`}
                id={`${index}-header`}
              >
                <Typography className="text-sm md:text-md font-bold">{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails className="text-sm md:text-md bg-[#F6F1F6] border-none shadow-none">
                <DisplayRichText content={item.answer} />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
