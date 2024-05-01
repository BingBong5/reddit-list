import React, { Component } from "react";
import { SubredditInfo } from "./data/subredditInfo";
// import { isRecord, parseSubredditInfo} from "./record";

const DEBUG : boolean = true;

type SubredditListProps = {
  pageNumber: bigint,
  itemsPerPage: bigint,
  firstItemNumber: bigint, 
  items : SubredditInfo[] | undefined,
}

export class SubredditList extends Component<SubredditListProps, {}> {
  constructor(props: SubredditListProps) {
    super(props);

    this.state = { items: undefined };
  }

  render = (): JSX.Element => {
    if(DEBUG) console.log(`SubredditList.render() `);
    return this.makeSubredditTable();
  }

  makeSubredditTable = (): JSX.Element => {
    if(DEBUG) console.log(`SubredditTable.makeSubredditTable: itemsPerPage: ${this.props.itemsPerPage}`);

    if(this.props.items === undefined){
      return <></>
    }
    
    const rows: JSX.Element[] = [];
    let alternate: boolean = false;
    let rank: bigint = this.props.firstItemNumber;

    for (let i: bigint = 0n; i < this.props.itemsPerPage; i++) {
      rows.push(
        this.makeSubredditRow({ subreddit: this.props.items[Number(i)], alternate: alternate, rank: rank + i })
      );
      alternate = !alternate;
    }

    return (
      <div className="subredditTableContainer">
        <div>
          <h2 className="table-title">Subscribers</h2>
          <table>
            <thead>
              <tr className="tableHeader">
                <th>Rank</th>
                <th>Name</th>
                <th>Subcount</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    );
  }

  makeSubredditRow = (props: { subreddit: SubredditInfo, alternate: boolean, rank: bigint, firstRow?: boolean }) => {
    let className: string = props.alternate ? "darkRow" : "lightRow";
    let url: string = 'https://reddit.com/r/' + props.subreddit.name;

    return (
      <tr className={className} onClick={() => this.doRowClick(url)} key={Number(props.rank)}>
        <td>{Number(props.rank)}</td>
        <td>{props.subreddit.name}</td>
        { }
        <td>{props.subreddit.subscribers.toLocaleString()}</td>
      </tr >
    );
  }

  doRowClick = (url: string): void => {
    window.open(url, '_blank');
  }
}