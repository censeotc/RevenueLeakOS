import { Badge } from "@/components/ui/badge";

export function VariablePicker({ variables }: { variables: string[] }) {
  return <div className="flex flex-wrap gap-2">{variables.map((variable) => <Badge key={variable} variant="info">{`{{${variable}}}`}</Badge>)}</div>;
}
