"use client";

interface TagSelectorProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  allowCustom?: boolean;
  onAddCustom?: (tag: string) => void;
}

const PRESET_TAGS = [
  "강아지",
  "고양이",
  "예민",
  "VVIP",
  "단골",
  "주차불가",
  "엘리베이터없음",
  "주의",
  "창틀",
  "화장실",
  "블랙리스트",
];

export default function TagSelector({
  tags = PRESET_TAGS,
  selectedTags,
  onToggle,
}: TagSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 cursor-pointer
              ${
                isSelected
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

export { PRESET_TAGS };
