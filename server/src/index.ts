import express, { Express } from "express";
import { dummy, getSubredditInfos } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/dummy", dummy);  // TODO: REMOVE
app.post("/api/getSubredditInfos", getSubredditInfos);
app.listen(port, () => console.log(`Server listening on ${port}`));

/**
 * store ITEMS on back end
 * create a get function that gets SubredditRows from stored array (for now just one)
 * with number of items requested
 * 
 * 
 * 
 */