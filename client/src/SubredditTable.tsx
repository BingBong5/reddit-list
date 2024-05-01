import React, { Component } from "react";
import { SubredditInfo } from "./data/subredditInfo";

const DEBUG: boolean = true;

type SubredditTableProps = {
  items: SubredditInfo[],
  pageNumber: bigint,
  itemsPerPage: bigint
}

export class SubredditTable extends Component<SubredditTableProps, {}> {
  constructor(props: SubredditTableProps) {
    super(props);
  }

  render = (): JSX.Element => {
    return this.makeSubredditTable();
  }

  makeSubredditTable = (): JSX.Element => {
    if(DEBUG) console.log(`SubredditTable.makeSubredditTable: itemsPerPage: ${this.props.itemsPerPage}`);
    
    const rows: JSX.Element[] = [];
    let alternate: boolean = false;
    let rank: bigint = this.props.pageNumber == 0n ? 1n : (this.props.itemsPerPage * this.props.pageNumber) + 1n;

    for (let i: bigint = 0n; i < this.props.items.length; i++) {
      rows.push(
        this.makeSubredditRow({ subreddit: this.props.items[Number(i)], alternate: alternate, rank: rank + i })
      );
      alternate = !alternate;
    }

    return (
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