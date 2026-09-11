import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

import DisplayRichText from '../Common/DisplayRichText';
import { faqData } from '../LandingPage/FAQ/FAQ';

const VerificationFAQ = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-full md:w-2/3 flex flex-col items-center justify-center">
        <div>
          <span className="text-2xl lg:text-4xl text-black font-bold text-center ">
            Learn more about <span className="tashus text-primary  font-flighter">TASHUS</span>
          </span>
        </div>
        <div className="pt-5">
          {faqData.map((item: { answer: string; question: string }, index) => (
            <Accordion key={index}>
              <AccordionSummary className="bg-white" expandIcon={<ExpandMoreIcon />} aria-controls={`${index}-content`} id={`${index}-header`}>
                <Typography className="text-sm md:text-md font-bold">{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails className="text-sm md:text-md bg-white border-none shadow-none ">
                <DisplayRichText content={item.answer} />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerificationFAQ;
