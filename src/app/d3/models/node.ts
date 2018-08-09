import APP_CONFIG from '../../app.config';
import * as d3 from 'd3';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  linkCount: number = 0;
  visibility: boolean = true;

  constructor(id) {
    this.id = id;
    this.linkCount = this.getRandomInt(0, 99);
  }

  normal() {
    return Math.sqrt(this.linkCount / APP_CONFIG.N);
  }

  get r() {
    // return 50 * this.normal() + 25;
    return APP_CONFIG.R;
  }

  get fontSize() {
    // return (30 * this.normal() + 10) + 'px';
    return APP_CONFIG.FONTSIZE + 'px';
  }

  get color() {
    let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    return APP_CONFIG.SPECTRUM[index];
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
