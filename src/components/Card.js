// Card component that displays statistics in a card format
function Card({ cardTitle, cardNumber }) {
  // Card component props:
  // - cardTitle: Title of the statistic
  // - cardNumber: Value to display
  
  return (
    <div className="card">
      {/* Card header with title */}
      <div className="card-header">
        <h4>{cardTitle}</h4>
      </div>
      
      {/* Card body with the number */}
      <div className="card-body">
        <h2>{cardNumber}</h2>
      </div>
    </div>
  );
}

export default Card;
