import { cn } from "@/lib/utils"
import { type Code } from "@/lib/code";

export function CodeDisplay({ code }: { code: Code }) {

  return (
    <div className={cn(
      'relative flex-1 overflow-hidden',
      'after:absolute after:inset-y-0 after:left-0 after:w-10 after:bg-background',
      '[&_.line:before]:sticky [&_.line:before]:left-2 [&_.line:before]:z-10 [&_.line:before]:translate-y-[-1px] [&_.line:before]:pr-1',
      '[&_pre]:h-[var(--height)] [&_pre]:overflow-auto [&_pre]:!bg-transparent [&_pre]:pb-20 [&_pre]:pt-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed'
    )} 
    data-rehype-pretty-code-fragment
    dangerouslySetInnerHTML={{ __html: code.content }} />
  );
}