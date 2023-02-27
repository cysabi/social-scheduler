const Section = ({ logo, title, children, ...rest }) => (
  <div className="flex flex-col" {...rest}>
    {children}
  </div>
);

export default Section;
