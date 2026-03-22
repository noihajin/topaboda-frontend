import { ListRow } from "./ListRow";

const CommentRow = ({ item }) => <ListRow title={item.postTitle} desc={item.content} date={item.date} onDelete={() => confirm("削除しますか？")} />;

export default CommentRow;
