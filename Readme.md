# Test task for Frontend Developer

**Please, don't fork this repository. Make your own, clone this and change origin to your repository.**

## Description

Your task implements a dashboard with a stock graph. You will have realtime updates through WebSockets. Also, you can get a market history by making a request to `/market-history`.

There are two graph's types:

- intraday price graph. It shows a price in every moment. `F(t) = P(t)`
- intraday percent change graph. It shows a percent change from the start of the day. `F(t) = (P(t) - P(0))/P(0) * 100%`

Assumptions:
- The user can change the type of the graph.
- The graph should change in real-time.
- The graph uses data only for the current day.

## Tech info

Please, use this tools in the task:

- [webpack](https://webpack.github.io)
- [d3.js](https://d3js.org)
- [React](https://facebook.github.io/react/)

Please, write your code in `client` folder. The bundle should be built in `public` folder. For this change script `build-client` in `package.json` file. 

It will be plus, if you implement `npm test` command. This command should check eslint rules for your code and then run tests.