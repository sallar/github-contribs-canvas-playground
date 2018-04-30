import mockData from "./mock.json";
import { drawContributions } from "./draw";

const canvas = document.getElementById("graph");
drawContributions(canvas, mockData);
