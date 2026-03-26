import { useState } from "react";
import { ListRow } from "./ListRow";
import ReviewEditModal from "./ReviewEditModal";

const ReviewRow = ({ item, onEditReview, onDeleteReview }) => {
    const [editOpen, setEditOpen] = useState(false);

    const handleSave = async (newContent) => {
        await onEditReview(item.id, newContent);
    };

    const handleDelete = () => {
        onDeleteReview(item.id);
    };

    return (
        <>
            <ListRow
                title={item.heritageName}
                desc={item.content}
                date={item.date}
                onEdit={() => setEditOpen(true)}
                onDelete={handleDelete}
                showDesc
            />
            <ReviewEditModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                item={item}
                onSave={handleSave}
            />
        </>
    );
};

export default ReviewRow;
