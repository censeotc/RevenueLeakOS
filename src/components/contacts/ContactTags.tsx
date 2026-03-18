import { Badge } from "@/components/ui/badge";

interface ContactTagsProps {
  tags: string[];
}

export function ContactTags({ tags }: ContactTagsProps) {
  if (tags.length === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
