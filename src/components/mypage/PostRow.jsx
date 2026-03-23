import React from "react";
import { ListRow } from "./ListRow";

const PostRow = ({ item, navigate, onEditPost, onDeletePost }) => {
    // 카테고리 클릭 핸들러 (예: 해당 카테고리 목록으로 이동)
    const handleCategoryClick = (e) => {
        e.stopPropagation();
        navigate(`/community?category=${item.category}`);
    };

    // 제목 클릭 핸들러 (상세 페이지로 이동)
    const handleTitleClick = (e) => {
        e.stopPropagation();
        navigate(`/community/view/${item.id}`);
    };

    // 수정 클릭 핸들러 (게시글 수정 폼으로 이동)
    const handleEditClick = async (e) => {
        e.stopPropagation();
        await onEditPost(item.id);
    };

    const handleDeleteClick = async (e) => {
        e.stopPropagation();

        if (!window.confirm("削除しますか？")) return;

        await onDeletePost(item.id);
    };

    return <ListRow category={item.category} title={item.title} desc={item.desc} date={item.date} views={item.views} likes={item.likes} onCategoryClick={handleCategoryClick} onTitleClick={handleTitleClick} onEdit={handleEditClick} onDelete={handleDeleteClick} />;
};

export default PostRow;
