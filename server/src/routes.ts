import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ITEMS, SubredditInfo } from "./data/subredditInfo";
// import { isRecord } from "./record";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

const items: SubredditInfo[] = ITEMS;

/**
 * retrieves some number of subreddit infos from array
 * @param req req the request
 * @param res the response
 */
export const getSubredditInfos = (req: SafeRequest, res: SafeResponse): void => {

  const itemsPerPage = req.body.itemsPerPage;
  const pageNumber = req.body.pageNumber;
  const firstItemNumber = req.body.firstItemNumber;

  // check that itemsPerPage is valid and part of the request
  if (typeof itemsPerPage !== "number") {
    res.status(400).send(`missing or invalid 'itemsPerPage' parameter: ${itemsPerPage}`);
    return;
  } else if (isNaN(itemsPerPage) || itemsPerPage < 0) {
    res.status(400).send(`itemsPerPage is not a positive integer: ${itemsPerPage}`);
    return;
  }

  // check that pageNumber is valid and part of the request
  if (typeof pageNumber !== "number") {
    res.status(400).send("missing or invalid 'pageNumber' parameter");
    return;
  } else if (isNaN(pageNumber) || pageNumber < 0) {
    res.status(400).send(`pageNumber is not a positive integer: ${pageNumber}`);
    return;
  }

  if(typeof firstItemNumber !== 'number'){
    res.status(400).send("missing or invalid 'firstItemNumber' parameter");
    return;
  } else if (isNaN(firstItemNumber) || firstItemNumber < 0) {
    res.status(400).send(`firstItemNumber is not a positive integer: ${firstItemNumber}`);
    return;
  }

  const returnItems: SubredditInfo[] = [];

  for (let i: number = firstItemNumber; i < firstItemNumber + itemsPerPage; i++) {
    returnItems.push(items[i]);
  }

  res.send({ items: returnItems, pageNumber: pageNumber, itemsPerPage: itemsPerPage, firstItemNumber: firstItemNumber });
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string | undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
