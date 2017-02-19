import React from "react";
import io from "socket.io-client";
import * as d3 from "d3";

// COMPONENTS
import Switch from "./switch";
import Chart from "./chart";

const eventTimeout = 500

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aaplData: [],
      fbData: [],
      googlData: [],
      msftData: [],
      percentageEnabled: false
    };

    this.loadHistory()
      .then( this.subscribeToChanges.bind(this) );

    this.handlePercentageSwitch = this.handlePercentageSwitch.bind(this)
  }

  loadHistory() {
    return new Promise(( resolve, reject ) => {
      d3.json("./market-history", ( error, data ) => {
        if (error) throw error;

        const now = new Date
        const dataLen = data["AAPL"].length
        const mapData = (v, i) => ({
          time: now - ( dataLen - i ) * eventTimeout,
          value: v
        })

        this.setState( {
          aaplData: data["AAPL"].map( mapData ),
          fbData: data["FB"].map( mapData ),
          googlData: data["GOOGL"].map( mapData ),
          msftData: data["MSFT"].map( mapData )
        })

        resolve();
      });
    })
  }

  subscribeToChanges() {
    const socket = io()

    socket.on( 'market events', data => {
      const changes = data.changes || {}
      const now = new Date

      const applyChange = ( data, nextVal ) => data.concat({
        time: now,
        value: data[ data.length - 1 ].value + nextVal
      })

      this.setState({
        aaplData: applyChange( this.state.aaplData, changes[ "AAPL" ] || 0 ),
        fbData: applyChange( this.state.fbData, changes[ "FB" ] || 0 ),
        googlData: applyChange( this.state.googlData, changes[ "GOOGL" ] || 0 ),
        msftData: applyChange( this.state.msftData, changes[ "MSFT" ] || 0 )
      })
    })
  }

  handlePercentageSwitch( percentageEnabled ) {
    this.state.percentageEnabled = percentageEnabled
    this.setState( this.state )
  }

  formatPrice( data ) {
    return data
  }

  formatPercentage( data ) {
    const v0 = ( data[0] && data[0].value ) || 0

    return data.map( d => ({
      time: d.time,
      value: ( d.value - v0 ) / v0 * 100
    }))
  }

  render() {
    const format = this.state.percentageEnabled ? this.formatPercentage
      : this.formatPrice

    const graphs = [
      { data: format( this.state.aaplData ), label: "AAPL" },
      { data: format( this.state.fbData ), label: "FB" },
      { data: format( this.state.googlData ), label: "GOOGL" },
      { data: format( this.state.msftData ), label: "MSFT" }
    ]

    const typeLabel = this.state.percentageEnabled ? "Growth (%)"
      : "Price ($)"

    return (
      <div>
        <Switch
          percentageEnabled={this.state.percentageEnabled}
          onUserChange={this.handlePercentageSwitch} />
        <Chart graphs={graphs} typeLabel={typeLabel} />
      </div>
    );
  }
}
