import { useState } from "react";
import { ListRow } from "./ListRow";
import CommentEditModal from "./CommentEditModal";

export default function CommentRow({ item, onEditComment, onDeleteComment }) {
    const [editOpen, setEditOpen] = useState(false);

    const handleSave = async (newContent) => {
        await onEditComment(item.id, newContent);
    };

    const handleDelete = async () => {
        if (!window.confirm("コメントを削除しますか？")) return;
        await onDeleteComment(item.id);
    };

    return (
        <>
            <ListRow
                title={item.postTitle}
                desc={item.content}
                date={item.date}
                onEdit={() => setEditOpen(true)}
                onDelete={handleDelete}
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
