import { ListRow } from "./ListRow";

const ReviewRow = ({ item }) => <ListRow title={item.heritageName} desc={item.content} date={item.date} onDelete={() => confirm("削除しますか？")} />;

export default ReviewRow;
