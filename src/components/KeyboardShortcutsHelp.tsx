import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Keyboard } from "@phosphor-icons/react"

export function KeyboardShortcutsHelp() {
  const shortcuts = [
    { keys: ["Ctrl", "P"], description: "Pause/Resume stream" },
    { keys: ["Ctrl", "E"], description: "Export incidents" },
    { keys: ["Ctrl", "R"], description: "Reset filters" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-accent/10 transition-all duration-300"
        >
          <Keyboard weight="bold" className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Keyboard Shortcuts</h3>
          <div className="space-y-2">
            {shortcuts.map(({ keys, description }, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{description}</span>
                <div className="flex items-center gap-1">
                  {keys.map((key, i) => (
                    <span key={i}>
                      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                        {key}
                      </kbd>
                      {i < keys.length - 1 && <span className="mx-1">+</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
