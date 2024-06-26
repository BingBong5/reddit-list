import { SubredditInfo } from "./data/subredditInfo";

/**
 * Determines whether the given value is a record.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object";
};


export const  parseSubredditInfo = (val  : unknown): SubredditInfo[] | undefined => {
  if(!isRecord(val)){
    return undefined;
  }else if (!Array.isArray(val.items)) {
    console.log(`parseSubredditInfo: !Array.isArray${val}`);
    return undefined;
  } else {
    const items = val.items
    const flashcards: SubredditInfo[] = [];
    for (const item of items) {
      if (typeof item.name !== 'string' || typeof item.subscribers !== 'number' || typeof item.over18 !== 'boolean') {
        return undefined;
      } else {
        flashcards.push(item);
      }
    }
    return flashcards;
  }
}
