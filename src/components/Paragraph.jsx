function Paragraph({ children, className = "" }) {
  return (
    <p className="text-lg leading-relaxed font-p-text [font-optical-sizing:auto] ${className}">
      {children}
    </p>
  );
}

export default Paragraph;
