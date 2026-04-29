import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

export default function TooltipLabel({ label, description }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <div className="flex items-center gap-1">
          <span className="text-[10px] lg:text-sm font-semibold text-gray-700">
            {label ? label : ""}
          </span>

          <Tooltip.Trigger asChild>
            <Info className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 cursor-pointer hover:text-blue-500" />
          </Tooltip.Trigger>
        </div>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            className="z-100 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg"
          >
            {description}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}