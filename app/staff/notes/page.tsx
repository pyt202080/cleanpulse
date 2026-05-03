"use client";

import { useState } from "react";
import { StickyNote, Plus, Search, User } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import TagSelector from "@/components/ui/TagSelector";
import { useStore } from "@/lib/store";
import { formatRelative } from "@/lib/utils/format";
import { toast } from "@/components/ui/Toast";

export default function StaffNotesPage() {
  const { currentUser, clientNotes, users, staff, addClientNote } = useStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New note form
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // All notes I've written or can see
  const allNotes = clientNotes
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredNotes = search
    ? allNotes.filter((n) => {
        const user = users.find((u) => u.id === n.user_id);
        return (
          user?.name.includes(search) ||
          n.content.includes(search) ||
          n.tags.some((t) => t.includes(search))
        );
      })
    : allNotes;

  const handleSubmit = () => {
    if (!selectedUserId || !content.trim()) {
      toast("고객과 메모를 입력해주세요", "error");
      return;
    }

    addClientNote({
      user_id: selectedUserId,
      staff_id: currentUser!.id,
      booking_id: null,
      content: content.trim(),
      tags: selectedTags,
    });

    toast("메모가 저장되었습니다");
    setIsModalOpen(false);
    setSelectedUserId(null);
    setContent("");
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-900">클라이언트 메모</h1>
        <Button size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus size={16} />}>
          작성
        </Button>
      </div>

      <Input
        placeholder="고객명, 태그, 내용 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search size={18} />}
      />

      <div className="space-y-3">
        {filteredNotes.map((note) => {
          const user = users.find((u) => u.id === note.user_id);
          const writer = staff.find((s) => s.id === note.staff_id);
          const isMyNote = note.staff_id === currentUser?.id;

          return (
            <Card key={note.id}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                  {user?.name[0]}
                </div>
                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                {isMyNote && <Badge variant="brand" size="sm">내 메모</Badge>}
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {writer?.name} · {formatRelative(note.created_at)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Note Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="메모 작성">
        <div className="space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">대상 고객</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`
                    flex items-center gap-2 p-2 rounded-xl text-left text-sm
                    transition-all cursor-pointer
                    ${selectedUserId === user.id ? "bg-brand-50 border-2 border-brand-500" : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"}
                  `}
                >
                  <User size={14} className={selectedUserId === user.id ? "text-brand-600" : "text-slate-400"} />
                  <span className="font-medium">{user.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">태그 선택</label>
            <TagSelector
              tags={["강아지", "고양이", "예민", "VVIP", "단골", "주차불가", "주의", "창틀", "블랙리스트"]}
              selectedTags={selectedTags}
              onToggle={toggleTag}
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">메모 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이 고객에 대해 다음 직원이 알아야 할 사항을 적어주세요"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none resize-none"
            />
          </div>

          <Button fullWidth size="lg" onClick={handleSubmit}>
            메모 저장
          </Button>
        </div>
      </Modal>
    </div>
  );
}
