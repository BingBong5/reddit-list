import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ITEMS, SubredditInfo } from "./data/subredditInfo";


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

  // check that itemsPerPage is valid and part of the request
  if (typeof itemsPerPage != "number") {
    res.status(400).send("missing or invalid 'itemsPerPage' parameter");
    return;
  } else if (isNaN(itemsPerPage) || itemsPerPage < 0) {
    res.status(400).send(`itemsPerPage is not a positive integer: ${itemsPerPage}`);
    return;
  }

  // check that pageNumber is valid and part of the request
  if (typeof pageNumber != "number") {
    res.status(400).send("missing or invalid 'pageNumber' parameter");
    return;
  } else if (isNaN(pageNumber) || pageNumber < 0) {
    res.status(400).send(`pageNumber is not a positive integer: ${pageNumber}`);
    return;
  }

  const startingIndex: number = pageNumber * itemsPerPage;

  // check that pageNumber and itemsPerPage is a valid index
  if (startingIndex >= items.length) {
    res.status(400).send(`passed starting index is invalid: ${pageNumber * itemsPerPage}`);
    return;
  }

  const returnItems: SubredditInfo[] = [];
  const endIndex = Math.min(startingIndex + itemsPerPage, items.length);

  for (let i: number = 0; i < endIndex; i++) {
    returnItems.push(items[i]);
  }

  res.send({ items: returnItems });
}



/**
 * Dummy route that just returns a hello message to the client.
 * @param req The request object
 * @param res The response object
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing or invalid "name" parameter');
    return;
  }

  res.send({ msg: `Hi, ${name}!` });
};


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
