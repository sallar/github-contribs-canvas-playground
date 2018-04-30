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

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 2000;
canvas.style.width = "700px";
canvas.style.height = "1000px";

ctx.scale(2, 2);

const boxWidth = 10;
const boxMargin = 2;
const yearDistance = 100;

function draw(year, i = 0) {
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

  for (let y = 0; y < graphEntries.length; y += 1) {
    for (let x = 0; x < graphEntries[y].length; x += 1) {
      const day = graphEntries[y][x];
      if (moment(day.date) > today) {
        continue;
      }
      ctx.fillStyle = day.info.color;
      ctx.fillRect(
        (boxWidth + boxMargin) * x,
        yearDistance * i + (boxWidth + boxMargin) * y,
        10,
        10
      );
    }
  }
}

mockData.years.forEach((year, i) => draw(year, i));
