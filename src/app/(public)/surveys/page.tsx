import { CSSProperties } from 'react';

const SurveyPage = () => {
  return (
    <div style={pageContainer}>
      <header style={header}>
        <h1>We Value Your Feedback!</h1>
        <p>Your experience matters to us. Please share your thoughts and help us improve our service by completing the feedback survey.</p>
      </header>

      <section style={surveySection}>
        <div id="hotjar-survey-trigger" style={surveyEmbed}>
          <p style={thankYouMessage}>Thank you for choosing Tashus!</p>
          <p style={appreciationMessage}>We appreciate your feedback.</p>
        </div>
      </section>

      <footer style={footer}>
        <p>
          If you have any questions, feel free to reach out to our support team at <a href="mailto:support@tashus.com">support@tashus.com</a>.
        </p>
      </footer>
    </div>
  );
};
export default SurveyPage;

// Styles
const pageContainer: CSSProperties = {
  fontFamily: '"Arial", sans-serif',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

const header: CSSProperties = {
  marginBottom: '40px',
};

const surveySection: CSSProperties = {
  marginBottom: '60px',
};

const surveyEmbed: CSSProperties = {
  border: '2px solid #e1e1e1',
  padding: '20px',
  borderRadius: '8px',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const footer: CSSProperties = {
  fontSize: '0.9em',
  color: '#777',
};

const thankYouMessage: CSSProperties = {
  fontSize: '16px',
  margin: '0',
};

const appreciationMessage: CSSProperties = {
  fontSize: '14px',
  margin: '0',
};
