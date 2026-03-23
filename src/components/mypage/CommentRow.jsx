import { useState } from "react";
import { ListRow } from "./ListRow";
import CommentEditModal from "./CommentEditModal";

export default function CommentRow({ item, onDelete }) {
    const [editOpen, setEditOpen] = useState(false);

    const handleSave = (newContent) => {
        // PUT /api/comments/{item.id} ← API 연동 시 교체
        console.log("댓글 수정:", item.id, newContent);
    };

    return (
        <>
            <ListRow
                title={item.postTitle}
                desc={item.content}
                date={item.date}
                onEdit={() => setEditOpen(true)}
                onDelete={() => onDelete?.(item.id)}
            />
            <CommentEditModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                item={item}
                onSave={handleSave}
            />
        </>
    );
}
