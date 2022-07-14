import { ListItem } from "@ui-kitten/components";
import { decode } from "html-entities";
import Byline from "../components/Byline";

export const renderRow = ({ item, index }) => (
    <ListItem
      title={decode(item.title.rendered)}
      description={item.parsely.meta.creator + "\n" + new Date(item.date).toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })}
    />
  );