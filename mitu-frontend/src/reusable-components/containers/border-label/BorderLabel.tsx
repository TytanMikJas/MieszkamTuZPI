export default function BorderLabel(props: {
  children: React.ReactNode;
  label: string;
}) {
  const { children, label } = props;
  return (
    <div className="border-2 border-primary rounded-lg p-2 pt-10 relative">
      <div className="font-bold absolute top-2 left-4">{label}</div>
      {children}
    </div>
  );
}
