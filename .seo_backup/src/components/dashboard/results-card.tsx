import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  answer: string;
}

export function ResultsCard({ answer }: Props) {
  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">AI Analysis</CardTitle>
          <Badge variant="secondary" className="text-xs">DeepSeek</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-zinc max-w-none text-sm leading-relaxed">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
