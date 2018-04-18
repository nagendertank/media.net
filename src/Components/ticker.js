import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDataGrid from "react-data-grid";
import RowRenderer from "./RowRenderer";
import { Icon } from "semantic-ui-react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

class ticker extends Component {
  constructor(props) {
    super(props);
    this.state = { shareData: [], rows: [] };
    let self = this;
    this._columns = [
      { key: "label", name: "Ticker" },
      {
        key: "price",
        name: "Price",
        formatter: function(props) {
          return <span>&#8377; {props.value.toFixed(2)}</span>;
        }
      },
      {
        key: "last_update",
        name: "Last Update",
        formatter: function(props) {
          return (
            <span>{self.get_time_difference(props.value, new Date())}</span>
          );
        }
      },
      {
        key: "difference",
        name: "Up/Down",
        formatter: function(props) {
          if (props.value < 0) {
            return <Icon color={"red"} name="chevron circle down" />;
          } else if (props.value > 0) {
            return <Icon color={"green"} name="chevron circle up" />;
          } else {
            return <Icon name="sort" />;
          }
        }
      },
      {
        key: "sparkLineChart",
        name: "Trend",
        formatter: function(props) {
          return <Sparklines data={props.value} limit={20} height={20}>
              <SparklinesLine color="#1c8cdc" />
              <SparklinesSpots />
            </Sparklines>;
        }
      }
    ];

    this._rows = [];
  }

  createRows(nextData) {
    let data = [];
    nextData.forEach(element => {
      data.push(element);
    });
    this.setState({ rows: data });
  }

  rowGetter = i => {
    return JSON.parse(JSON.stringify(this.state.rows[i]));
  };

  formatData(data) {
    let formattedData = new Map();
    let date = new Date();
    data.forEach(element => {
      formattedData.set(element[0], {
        label: element[0],
        price: element[1],
        last_update: date,
        difference: 0,
        sparkLineChart: [element[1]]
      });
    });
    return formattedData;
  }

  get_time_difference(earlierDate, laterDate) {
    var oDiff = new Object();
    earlierDate = new Date(earlierDate);
    laterDate = new Date(laterDate);
    var nTotalDiff = laterDate.getTime() - earlierDate.getTime();

    oDiff.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
    nTotalDiff -= oDiff.days * 1000 * 60 * 60 * 24;

    oDiff.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
    nTotalDiff -= oDiff.hours * 1000 * 60 * 60;

    oDiff.minutes = Math.floor(nTotalDiff / 1000 / 60);
    nTotalDiff -= oDiff.minutes * 1000 * 60;

    oDiff.seconds = Math.floor(nTotalDiff / 1000);
    new Date().toTimeString;

    if (oDiff.days > 0) {
      return laterDate.toUTCString();
    } else if (oDiff.hours > 0) {
      return laterDate.toTimeString();
    } else if (oDiff.minutes > 0) {
      return oDiff.minutes + " Minutes ago";
    } else {
      return oDiff.seconds + " Seconds ago";
    }
  }

  findDifference(newData, oldData) {
    newData.forEach((element, key) => {
      let oldElement = oldData.get(key);
      if (oldElement) {
        oldElement.difference = element.price - oldElement.price;
        oldElement.price = element.price;
        oldElement.timeData = this.get_time_difference(
          oldElement.last_update,
          element.last_update
        );
        oldElement.sparkLineChart.push(oldElement.price)
        oldElement.last_update = element.last_update;
      } else {
        oldData.set(key, element);
      }
    });

    return oldData;
  }

  componentWillReceiveProps(nextProps) {
    let oldData = this.state.shareData;
    let nextData = [];
    if (oldData && !oldData.size) {
      nextData = this.formatData(nextProps.data);
      //console.log(newData);
    } else {
      let newData = this.formatData(nextProps.data);
      nextData = this.findDifference(newData, this.state.shareData);
    }

    this.createRows(nextData);
    this.setState({ shareData: nextData });
  }

  render() {
    return this.state.rows.length == 0 ? (
      <p>
        <b>Loading Data...</b>
      </p>
    ) : (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500}
        rowRenderer={RowRenderer}
      />
    );
  }
}

ticker.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired
};

export default ticker;
