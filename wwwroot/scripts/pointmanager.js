import { getRandomColor } from './utils/color.js';
import * as api from './api.js';
import * as forms from './ui/form.js';

export class PointManager {
  constructor(stage, layer) {
    this.stage = stage;
    this.layer = layer;
    this.selectedPointId = null;

    this.stage.on('click', this.handleClick.bind(this));
    this.loadPoints();
  }

  handleClick(e) {
    if (e.evt.button !== 0) return;

    const target = e.target;
    const pos = this.stage.getPointerPosition();

    if (target === this.stage) {
      const newPoint = {
        x: pos.x,
        y: pos.y,
        radius: 20,
        color: getRandomColor(),
        comments: []
      };

      api.createPoint(newPoint).then(() => this.loadPoints());
    } else if (target instanceof Konva.Circle) {
      this.selectedPointId = parseInt(target.id());
      forms.showCommentForm(pos, comment => {
        comment.pointId = this.selectedPointId;
        api.addComment(this.selectedPointId, comment).then(() => this.loadPoints());
      });
    }
  }

  loadPoints() {
    api.getPoints().then(points => {
      this.layer.destroyChildren();

      points.forEach(point => {
        const circle = new Konva.Circle({
          x: point.x,
          y: point.y,
          radius: point.radius,
          fill: point.color,
          id: point.id.toString(),
          draggable: true
        });

        circle.on('dragend', () => {
          const updated = {
            id: point.id,
            x: circle.x(),
            y: circle.y(),
            radius: circle.radius(),
            color: circle.fill()
          };
          api.updatePoint(point.id, updated).then(() => this.loadPoints());
        });

        circle.on('dblclick', () => {
          api.deletePoint(point.id).then(() => this.loadPoints());
        });

        circle.on('contextmenu', e => {
          e.evt.preventDefault();
          forms.showEditForm(circle, updated => {
            const fullUpdate = {
              ...updated,
              id: point.id,
              x: circle.x(),
              y: circle.y()
            };
            api.updatePoint(point.id, fullUpdate).then(() => this.loadPoints());
          });
        });

        this.addComments(point, circle);
        this.layer.add(circle);
      });

      this.layer.draw();
      renderGridFromPoints(points);
    });
  }

  addComments(point, circle) {
    const commentGroups = [];
    let yOffset = 0;

    point.comments.forEach(comment => {
      const text = new Konva.Text({ x: point.x + point.radius + 10, y: point.y + yOffset, text: comment.text, fontSize: 14, fill: 'black', padding: 5 });
      const rect = new Konva.Rect({ x: text.x(), y: text.y(), width: text.width(), height: text.height(), fill: comment.backgroundColor, opacity: 0.7, cornerRadius: 4 });

      const group = new Konva.Group({ visible: false });
      group.commentId = comment.id;
      group.add(rect);
      group.add(text);

      group.on('click', () => {
        const pos = this.stage.getPointerPosition();
        forms.showEditCommentForm(comment, pos, updated => {
          api.updateComment(comment.id, updated).then(() => this.loadPoints());
        });
      });

      this.layer.add(group);
      commentGroups.push(group);
      yOffset += text.height() + 8;
    });

    let hideTimeout = null;
    circle.on('mouseover', () => {
      if (hideTimeout) clearTimeout(hideTimeout);
      commentGroups.forEach(g => g.visible(true));
      this.layer.draw();
    });

    circle.on('mouseout', () => {
      hideTimeout = setTimeout(() => {
        commentGroups.forEach(g => g.visible(false));
        this.layer.draw();
      }, 1000);
    });
  }
}