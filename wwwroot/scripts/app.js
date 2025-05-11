import { PointManager } from './pointmanager.js'

$(function () {
  const stage = new Konva.Stage({
    container: 'container',
    width: 800,
    height: 600
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  new PointManager(stage, layer);
});
