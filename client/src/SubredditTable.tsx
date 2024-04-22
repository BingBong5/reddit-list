import React, { Component } from "react";
import { SubredditInfo } from "./data/subredditInfo";

type SubredditTableProps = {
  items: SubredditInfo[],
  page: bigint,
  itemsPerPage: bigint
}

export class SubredditTable extends Component<SubredditTableProps, {}> {
  constructor(props: SubredditTableProps) {
    super(props);
  }

  render = (): JSX.Element => {
    return this.makeSubredditTable({ subreddits: this.props.items });
  }

  makeSubredditTable = (props: { subreddits: SubredditInfo[] }): JSX.Element => {
    const rows: JSX.Element[] = [];
    let alternate: boolean = false;
    let rank: bigint = this.props.page == 0n ? 1n : (this.props.itemsPerPage * this.props.page) + 1n;

    // Inv: {}
    for (let i: bigint = 0n; i < this.props.itemsPerPage; i++) {
      rows.push(
        this.makeSubredditRow({ subreddit: props.subreddits[Number(i)], alternate: alternate, rank: rank + i })
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
    /**
     * .toLocaleString turns the number readable format, with commas
     * 1012349 -> 1,012,349
     */
  }

  doRowClick = (url: string): void => {
    window.open(url, '_blank');
  }
}