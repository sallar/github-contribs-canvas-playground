import moment from "moment";
import mockData from "./mock.json";

const FORMAT = "YYYY-MM-DD";
const COLORS = {
  empty: "transparent",
  grad0: "#ebedf0",
  grad1: "#c6e48b",
  grad2: "#7bc96f",
  grad3: "#239a3b",
  grad4: "#196127"
};

function getDateInfo(date) {
  return mockData.contributions.find(contrib => contrib.date === date);
}

function getTotalCount(graphEntries) {
  return graphEntries.reduce((total, row) => {
    return (
      total +
      row.reduce((rowTotal, col) => {
        return rowTotal + (col.info ? col.info.count : 0);
      }, 0)
    );
  }, 0);
}

const canvas = document.getElementById("graph");

const boxWidth = 10;
const boxMargin = 2;
const textMargin = 15;
const yearDistance = 110;

function draw(year, index = 0) {
  const today = moment(year.range.end);
  const start = moment(year.range.start).day(-1);
  const firstDate = start.clone();

  const nextDate = firstDate.clone();
  const firstRowDates = [];
  const graphEntries = [];

  while (nextDate <= today && nextDate.day(7) <= today) {
    const date = nextDate.format(FORMAT);
    firstRowDates.push({
      date,
      info: getDateInfo(date)
    });
  }

  graphEntries.push(firstRowDates);

  for (let i = 1; i < 7; i += 1) {
    graphEntries.push(
      firstRowDates.map(dateObj => {
        const date = moment(dateObj.date)
          .day(i)
          .format(FORMAT);
        return {
          date,
          info: getDateInfo(date)
        };
      })
    );
  }

  const yearMargin = yearDistance * index;
  const count = getTotalCount(graphEntries);

  ctx.fillStyle = "#000000";
  ctx.font = "10px Menlo";
  ctx.fillText(
    `${year.year}: ${count} Contributions`,
    0,
    yearMargin + textMargin / 2
  );

  for (let y = 0; y < graphEntries.length; y += 1) {
    for (let x = 0; x < graphEntries[y].length; x += 1) {
      const day = graphEntries[y][x];
      if (moment(day.date) > today) {
        continue;
      }
      ctx.fillStyle = day.info.color;
      ctx.fillRect(
        (boxWidth + boxMargin) * x,
        yearMargin + textMargin + (boxWidth + boxMargin) * y,
        10,
        10
      );
    }
  }
}

const ctx = canvas.getContext("2d");
const height = mockData.years.length * yearDistance;
const width = 54 * (boxWidth + boxMargin);
const scaleFactor = window.devicePixelRatio || 1;

canvas.width = width * scaleFactor;
canvas.height = height * scaleFactor;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

ctx.scale(scaleFactor, scaleFactor);

mockData.years.forEach((year, i) => draw(year, i));
