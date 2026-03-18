import { Badge } from "@/components/ui/badge";

export function ContactTags({ tags }: { tags: string[] }) {
  return <div className="flex flex-wrap gap-2">{tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>;
}
