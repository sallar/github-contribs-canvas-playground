import moment from "moment";
import mockData from "./mock.json";

function getDateInfo(date) {
  return mockData.contributions.find(contrib => contrib.date === date);
}

const FORMAT = "YYYY-MM-DD";
const boxWidth = 10;
const boxMargin = 2;
const textHeight = 15;
const canvasMargin = 20;
const yearHeight = textHeight + (boxWidth + boxMargin) * 7 + canvasMargin;
const height = mockData.years.length * yearHeight + canvasMargin;
const width = 54 * (boxWidth + boxMargin) + canvasMargin * 2;
const scaleFactor = window.devicePixelRatio || 1;

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

canvas.width = width * scaleFactor;
canvas.height = height * scaleFactor;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

ctx.scale(scaleFactor, scaleFactor);

function draw(ctx, year, offsetX = 0, offsetY = 0) {
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

  const count = new Intl.NumberFormat().format(year.total);

  ctx.fillStyle = "#000000";
  ctx.font = "10px 'IBM Plex Mono'";
  ctx.fillText(
    `${year.year}: ${count} Contributions`,
    offsetX,
    offsetY + textHeight / 2
  );

  for (let y = 0; y < graphEntries.length; y += 1) {
    for (let x = 0; x < graphEntries[y].length; x += 1) {
      const day = graphEntries[y][x];
      if (moment(day.date) > today) {
        continue;
      }
      ctx.fillStyle = day.info.color;
      ctx.fillRect(
        offsetX + (boxWidth + boxMargin) * x,
        offsetY + textHeight + (boxWidth + boxMargin) * y,
        10,
        10
      );
    }
  }
}

mockData.years.forEach((year, i) => {
  const offsetY = yearHeight * i + canvasMargin;
  const offsetX = canvasMargin;
  draw(ctx, year, offsetX, offsetY);
});
